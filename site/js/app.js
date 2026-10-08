// ============== MAIN APP ==============
// Wires up routing, state, and views

let STATE = Storage.load();
let EXAM = null;
const ONLINE_TRANSLATOR_API = 'https://apertium.org/apy/translate';
let feedbackAudioContext = null;

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function showToast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 2500);
}

function updateHeaderStats() {
  $('#streakNum').textContent = STATE.streak;
  $('#pointsNum').textContent = STATE.points;
}

function updateSoundToggle() {
  const button = $('#soundToggle');
  button.textContent = STATE.soundEnabled ? '🔊' : '🔇';
  button.setAttribute('aria-label', STATE.soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos');
  button.setAttribute('aria-pressed', String(STATE.soundEnabled));
  button.title = STATE.soundEnabled ? 'Sonidos activados' : 'Sonidos silenciados';
}

function playCorrectSound() {
  if (!STATE.soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    console.warn('Los efectos de sonido no están disponibles en este navegador.');
    return;
  }

  try {
    if (!feedbackAudioContext) feedbackAudioContext = new AudioContextClass();
    const playChime = () => {
      const notes = [659.25, 880];
      const startAt = feedbackAudioContext.currentTime;
      notes.forEach((frequency, index) => {
        const oscillator = feedbackAudioContext.createOscillator();
        const gain = feedbackAudioContext.createGain();
        const noteStart = startAt + index * 0.12;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.2);
        oscillator.connect(gain);
        gain.connect(feedbackAudioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.21);
      });
    };

    if (feedbackAudioContext.state === 'suspended') {
      feedbackAudioContext.resume().then(playChime).catch(error => {
        console.warn('No se pudo iniciar el sonido de respuesta correcta.', error);
      });
    } else {
      playChime();
    }
  } catch (error) {
    console.warn('No se pudo reproducir el sonido de respuesta correcta.', error);
  }
}

// Theme
function applyTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  $('#themeToggle').textContent = STATE.theme === 'dark' ? '☀️' : '🌙';
}

function init() {
  // Init theme
  applyTheme();
  updateSoundToggle();
  $('#themeToggle').addEventListener('click', () => {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    Storage.save(STATE);
  });
  $('#soundToggle').addEventListener('click', () => {
    STATE.soundEnabled = !STATE.soundEnabled;
    updateSoundToggle();
    Storage.save(STATE);
  });
  document.addEventListener('answered', event => {
    if (event.detail.correct) playCorrectSound();
  });
  const translatorLink = $('.nav-link[data-route="translate"]');
  translatorLink.addEventListener('click', event => {
    event.preventDefault();
    toggleFloatingTranslator();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('#translatorOverlayRoot').firstElementChild) {
      closeFloatingTranslator(true);
    }
  });
  document.addEventListener('pointerdown', event => {
    const root = $('#translatorOverlayRoot');
    if (root.firstElementChild && !root.contains(event.target) &&
        event.target !== translatorLink && !translatorLink.contains(event.target)) {
      closeFloatingTranslator();
    }
  });
  window.addEventListener('hashchange', () => {
    if ($('#translatorOverlayRoot').firstElementChild) closeFloatingTranslator();
  });
  updateHeaderStats();
  // Init storage streak
  Storage.updateStreak(STATE);
  Storage.save(STATE);
  // Set up routes
  Router.add('home', renderHome);
  Router.add('theory', renderTheory);
  Router.add('file', renderFile);
  Router.add('lesson', renderLesson);
  Router.add('practice', renderPractice);
  Router.add('translate', () => renderTranslator());
  Router.add('review', renderReview);
  Router.add('stats', renderStats);
  Router.add('exam', renderExam);
  Router.add('exam-result', renderExamResult);
  Router.init();
}

// ============== VIEWS ==============

// --- OFFLINE TRANSLATOR ---
function renderTranslator(view = $('#mainView'), floating = false, mode = 'offline') {
  const online = mode === 'online';
  const title = online ? 'Traductor online' : 'Traductor offline';
  const translatorForm = `
    <section class="translator-card" aria-label="${online ? 'Traductor online' : 'Traductor offline'}">
      <div class="translator-toolbar">
        <label for="translationDirection">Dirección de traducción</label>
        <select id="translationDirection" class="translator-direction">
          <option value="en-es">Inglés → Español</option>
          <option value="es-en">Español → Inglés</option>
        </select>
        <button type="button" class="btn btn-secondary" id="swapTranslation" aria-label="Invertir idiomas">⇄ Invertir</button>
      </div>
      <div class="translator-panels">
        <label class="translator-panel">
          <span id="sourceLanguageLabel">Inglés</span>
          <textarea id="translationSource" rows="${floating ? 4 : 8}" placeholder="Escribe una palabra o un texto para traducir…" spellcheck="true"></textarea>
          <span class="translator-count"><span id="sourceCharCount">0</span> caracteres</span>
        </label>
        <label class="translator-panel">
          <span id="targetLanguageLabel">Español</span>
          <textarea id="translationResult" rows="${floating ? 4 : 8}" placeholder="La traducción aparecerá aquí…" readonly></textarea>
          <span class="translator-count" id="translationStatus" aria-live="polite">${online ? 'Traducción online · requiere internet' : 'Traducción local'}</span>
        </label>
      </div>
      <div class="translator-actions">
        <button type="button" class="btn" id="translateNow">${online ? 'Traducir online' : 'Traducir'}</button>
        <button type="button" class="btn btn-secondary" id="copyTranslation">Copiar traducción</button>
        <button type="button" class="btn btn-ghost" id="clearTranslation">Borrar texto</button>
      </div>
      ${online ? '<p class="translator-online-notice">El texto se enviará por HTTPS al servicio público Apertium. No envíes información confidencial. Usa el modo offline si no tienes conexión.</p>' : ''}
    </section>
  `;

  view.innerHTML = floating ? `
    <section class="translator-floating" role="dialog" aria-modal="false" aria-label="Traductor flotante">
      <header class="translator-floating-header">
        <h2>🌐 ${title}</h2>
        <div class="translator-floating-header-actions">
          <button type="button" class="btn btn-ghost translator-floating-change">Cambiar</button>
          <button type="button" class="btn btn-secondary translator-floating-close" aria-label="Cerrar traductor">✕</button>
        </div>
      </header>
      ${translatorForm}
    </section>
  ` : `
    <h1 class="section-title">🌐 Traductor inglés ↔ español</h1>
    <p class="text-muted translator-note">Funciona sin internet con un diccionario integrado. Traduce palabras y textos; las palabras que no reconoce se conservan.</p>
    ${translatorForm}
    <section class="translator-verb-sections" aria-label="Verbos en pasado y futuro">
      <div class="translator-verb-card">
        <h2>⏮️ Verbos en pasado simple</h2>
        <p class="text-muted">Forma de ejemplo con “I” (yo). Los regulares suelen terminar en <strong>-ed</strong>; los irregulares cambian de forma.</p>
        <div class="translator-table-wrap">
          <table class="translator-verb-table">
            <thead><tr><th>Tipo</th><th>Verbo en pasado</th><th>Traducción</th></tr></thead>
            <tbody>
              ${OfflineTranslator.verbForms.map(verb => `
                <tr>
                  <td><span class="verb-type ${verb.type}">${verb.type === 'regular' ? 'Regular' : 'Irregular'}</span></td>
                  <td><code>I ${escapeHTML(verb.past)}</code></td>
                  <td>${escapeHTML(verb.pastTranslation)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="translator-verb-card">
        <h2>⏭️ Verbos en futuro con “will”</h2>
        <p class="text-muted">El futuro se forma con <strong>will + verbo base</strong> para todos los verbos, regulares e irregulares. Las traducciones muestran la forma con “yo”.</p>
        <div class="translator-table-wrap">
          <table class="translator-verb-table">
            <thead><tr><th>Tipo</th><th>Verbo en futuro</th><th>Traducción</th></tr></thead>
            <tbody>
              ${OfflineTranslator.verbForms.map(verb => `
                <tr>
                  <td><span class="verb-type ${verb.type}">${verb.type === 'regular' ? 'Regular' : 'Irregular'}</span></td>
                  <td><code>I will ${escapeHTML(verb.base)}</code></td>
                  <td>${escapeHTML(verb.futureTranslation)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  const source = $('#translationSource', view);
  const result = $('#translationResult', view);
  const direction = $('#translationDirection', view);
  const submitButton = $('#translateNow', view);
  const translateText = () => {
    const fromEnglish = direction.value === 'en-es';
    if (!online) result.value = OfflineTranslator.translate(source.value, direction.value);
    else {
      result.value = '';
      $('#translationStatus', view).textContent = source.value
        ? 'Pulsa “Traducir online” para enviar el texto al servicio'
        : 'Traducción online · requiere internet';
    }
    $('#sourceCharCount', view).textContent = source.value.length;
    $('#sourceLanguageLabel', view).textContent = fromEnglish ? 'Inglés' : 'Español';
    $('#targetLanguageLabel', view).textContent = fromEnglish ? 'Español' : 'Inglés';
    if (!online) {
      $('#translationStatus', view).textContent = source.value
        ? 'Traducción local · palabras desconocidas se conservan'
        : 'Traducción local';
    }
  };

  source.addEventListener('input', translateText);
  direction.addEventListener('change', translateText);
  submitButton.addEventListener('click', async () => {
    if (!source.value.trim()) {
      result.value = '';
      $('#translationStatus', view).textContent = online
        ? 'Escribe un texto antes de traducir'
        : 'Traducción local';
      return;
    }
    if (!online) {
      translateText();
      return;
    }

    const status = $('#translationStatus', view);
    const request = new AbortController();
    const timeout = setTimeout(() => request.abort(), 30000);
    submitButton.disabled = true;
    submitButton.textContent = 'Traduciendo…';
    status.textContent = 'Conectando con Apertium…';
    try {
      const response = await fetch(ONLINE_TRANSLATOR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          q: source.value,
          langpair: direction.value === 'en-es' ? 'eng|spa' : 'spa|eng',
        }),
        signal: request.signal,
      });
      if (!response.ok) {
        throw new Error(response.status === 429
          ? 'El servicio está ocupado. Espera un momento y vuelve a intentar.'
          : `El servicio respondió con el error ${response.status}.`);
      }
      const data = await response.json();
      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || 'Apertium no pudo procesar este texto.');
      }
      if (typeof data.responseData?.translatedText !== 'string') {
        throw new Error('El servicio devolvió una respuesta de traducción no válida.');
      }
      result.value = data.responseData.translatedText;
      status.textContent = 'Traducción online · Apertium';
    } catch (error) {
      console.error('No se pudo completar la traducción online', error);
      result.value = '';
      if (error.name === 'AbortError') {
        status.textContent = 'La solicitud tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.';
      } else if (error instanceof TypeError) {
        status.textContent = 'No se pudo conectar con el servicio. Revisa internet o inténtalo más tarde.';
      } else if (error instanceof SyntaxError) {
        status.textContent = 'El servicio devolvió una respuesta no válida. Inténtalo más tarde.';
      } else {
        status.textContent = `No se pudo traducir online: ${error.message || 'inténtalo más tarde.'}`;
      }
    } finally {
      clearTimeout(timeout);
      submitButton.disabled = false;
      submitButton.textContent = online ? 'Traducir online' : 'Traducir';
    }
  });
  $('#swapTranslation', view).addEventListener('click', () => {
    if (!result.value) {
      direction.value = direction.value === 'en-es' ? 'es-en' : 'en-es';
      translateText();
      return;
    }
    source.value = result.value;
    direction.value = direction.value === 'en-es' ? 'es-en' : 'en-es';
    translateText();
  });
  $('#clearTranslation', view).addEventListener('click', () => {
    source.value = '';
    result.value = '';
    translateText();
    source.focus();
  });
  $('#copyTranslation', view).addEventListener('click', async () => {
    if (!result.value) {
      showToast('No hay traducción para copiar', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(result.value);
      showToast('Traducción copiada', 'success');
    } catch (error) {
      console.error('No se pudo copiar la traducción', error);
      result.focus();
      result.select();
      showToast('Selecciona y copia el texto manualmente', 'error');
    }
  });

  if (floating) {
    $('.translator-floating-close', view).addEventListener('click', () => closeFloatingTranslator(true));
    $('.translator-floating-change', view).addEventListener('click', openTranslatorChooser);
  }
}

function toggleFloatingTranslator() {
  const root = $('#translatorOverlayRoot');
  if (root.firstElementChild) {
    if (root.querySelector('.translator-mode-choice')) {
      closeFloatingTranslator();
    } else {
      openTranslatorChooser();
    }
    return;
  }
  openTranslatorChooser();
}

function openTranslatorChooser() {
  const root = $('#translatorOverlayRoot');
  root.innerHTML = `
    <section class="translator-floating translator-mode-choice" role="dialog" aria-modal="false" aria-label="Elige el tipo de traductor">
      <header class="translator-floating-header">
        <h2>🌐 Elige un traductor</h2>
        <button type="button" class="btn btn-secondary translator-floating-close" aria-label="Cerrar opciones de traducción">✕</button>
      </header>
      <div class="translator-choice-list">
        <button type="button" class="translator-choice" data-translator-mode="offline">
          <strong>Traductor offline</strong>
          <span>Funciona sin internet. Usa el diccionario integrado.</span>
        </button>
        <button type="button" class="translator-choice" data-translator-mode="online">
          <strong>Traductor online</strong>
          <span>Usa Apertium por internet para traducir palabras y textos.</span>
        </button>
        <p class="translator-online-notice">Necesita internet. El texto se envía al servicio público por HTTPS; no envíes información confidencial. La disponibilidad y la calidad de traducción pueden variar.</p>
      </div>
    </section>
  `;
  $('.nav-link[data-route="translate"]').setAttribute('aria-expanded', 'true');
  $('.translator-floating-close', root).addEventListener('click', () => closeFloatingTranslator(true));
  $$('.translator-choice', root).forEach(button => {
    button.addEventListener('click', () => {
      renderTranslator(root, true, button.dataset.translatorMode);
      $('#translationSource', root).focus();
    });
  });
}

function closeFloatingTranslator(returnFocus = false) {
  $('#translatorOverlayRoot').replaceChildren();
  const trigger = $('.nav-link[data-route="translate"]');
  trigger.setAttribute('aria-expanded', 'false');
  if (returnFocus) trigger.focus();
}

// --- HOME ---
function renderHome() {
  const view = $('#mainView');
  const totalQuestions = Files.reduce((sum, f) => sum + f.lessons.reduce((s, l) => s + l.grammar.length + l.vocabulary.length + l.mixed.length, 0), 0);
  const totalLessons = Files.reduce((s, f) => s + f.lessons.length, 0);
  const completedLessons = Object.values(STATE.fileProgress).reduce((s, f) => s + Object.values(f).filter(l => l.completed).length, 0);
  const accuracy = STATE.totalAnswered > 0 ? Math.round((STATE.totalCorrect / STATE.totalAnswered) * 100) : 0;

  view.innerHTML = `
    <div class="hero">
      <h1>Practica inglés, un ejercicio a la vez <span class="hero-title-icon" aria-hidden="true">📚</span></h1>
      <p>Cuestionarios interactivos basados en el contenido de <em>English File Elementary 4th Edition</em>. Practica gramática, vocabulario y más.</p>
      <div class="hero-stats">
        <div class="hero-stat"><strong>${totalQuestions}</strong> preguntas</div>
        <div class="hero-stat"><strong>${Files.length}</strong> niveles</div>
        <div class="hero-stat"><strong>${totalLessons}</strong> lecciones</div>
        <div class="hero-stat"><strong>${accuracy}%</strong> tu precisión</div>
        <div class="hero-stat"><strong>${completedLessons}</strong> lecciones completadas</div>
      </div>
    </div>

    <h2 class="section-title">📂 Niveles (Files)</h2>
    <div class="files-grid">
      ${Files.map(f => {
        const progress = Storage.getFileProgress(STATE, f.id);
        const done = f.lessons.filter(l => STATE.fileProgress[f.id]?.[l.letter]?.completed).length;
        const total = f.lessons.length;
        const totalQ = f.lessons.reduce((s, l) => s + l.grammar.length + l.vocabulary.length + l.mixed.length, 0);
        return `
          <div class="file-card" data-file="${f.id}">
            <div class="file-header">
              <span class="file-num">File ${f.id}</span>
              <span class="file-status">${done}/${total} lecciones</span>
            </div>
            <div class="file-title">${escapeHTML(f.title)}</div>
            <div class="file-desc">${escapeHTML(f.description)}</div>
            <div class="file-progress">
              <div class="file-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="file-stats">
              <span>${totalQ} preguntas</span>
              <span>${progress}% completado</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  attachTheoryInteractions(view);
  $$('.file-card').forEach(card => {
    card.addEventListener('click', () => Router.navigate('file/' + card.dataset.file));
  });
}

function renderTheoryBody(topic) {
  return topic.sections.map(section => `
    <article class="theory-subsection">
      <h3>${escapeHTML(section.title)}</h3>
      <p>${escapeHTML(section.intro)}</p>
      <ul class="theory-rules">
        ${section.rules.map(rule => `<li>${escapeHTML(rule)}</li>`).join('')}
      </ul>
      <p class="theory-formula"><strong>Estructura:</strong> ${escapeHTML(section.formula)}</p>
      <div class="theory-example-list">
        ${section.examples.map(([english, spanish]) => `
          <div class="theory-example">
            <code>${escapeHTML(english)}</code>
            <span>${escapeHTML(spanish)}</span>
          </div>
        `).join('')}
      </div>
      ${section.note ? `<p class="theory-tip"><strong>Nota:</strong> ${escapeHTML(section.note)}</p>` : ''}
    </article>
  `).join('');
}

function renderTheorySection(showTheoryLink = false) {
  return `
    <section class="theory-section" aria-labelledby="theory-title">
      <div class="theory-heading">
        <div>
          <h2 class="section-title" id="theory-title">📘 Teoría · Grammar Bank</h2>
          <p class="text-muted">12 temas desarrollados por subtemas, con explicaciones, estructuras y ejemplos originales. Abre una tarjeta o amplía la lectura.</p>
        </div>
        ${showTheoryLink ? '<a class="btn btn-secondary theory-link" href="#theory" data-route="theory">Ver toda la teoría</a>' : ''}
      </div>
      <div class="theory-grid">
        ${GrammarTheory.map((topic, index) => `
          <details class="theory-topic">
            <summary>
              <span class="theory-topic-title">${escapeHTML(topic.title)}</span>
              <span class="theory-topic-focus">${escapeHTML(topic.focus)}</span>
            </summary>
            <div class="theory-content">
              <div class="theory-content-toolbar">
                <span>${topic.sections.length} subtemas · desplazamiento independiente</span>
                <button type="button" class="btn btn-secondary theory-expand" data-topic-index="${index}" aria-label="Ampliar ${escapeHTML(topic.title)}">⛶ Ampliar</button>
              </div>
              ${renderTheoryBody(topic)}
            </div>
          </details>
        `).join('')}
      </div>
      <p class="theory-note">Guía original en español organizada según los 12 bloques temáticos; consulta cada subtema y sus ejemplos.</p>
      <dialog class="theory-dialog" aria-labelledby="theoryDialogTitle">
        <div class="theory-dialog-shell">
          <header class="theory-dialog-heading">
            <h2 id="theoryDialogTitle"></h2>
            <button type="button" class="btn btn-secondary theory-dialog-close" aria-label="Cerrar teoría ampliada">✕ Cerrar</button>
          </header>
          <div class="theory-dialog-body"></div>
        </div>
      </dialog>
    </section>
  `;
}

function renderTheory() {
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#home" class="back-link">← Volver al inicio</a>
    ${renderTheorySection()}
  `;
  attachTheoryInteractions(view);
}

function attachTheoryInteractions(view) {
  const dialog = $('.theory-dialog', view);
  if (!dialog) return;
  const dialogTitle = $('#theoryDialogTitle', dialog);
  const dialogBody = $('.theory-dialog-body', dialog);

  $$('.theory-expand', view).forEach(button => {
    button.addEventListener('click', () => {
      const topic = GrammarTheory[Number(button.dataset.topicIndex)];
      if (!topic) return;
      dialogTitle.textContent = topic.title;
      dialogBody.innerHTML = renderTheoryBody(topic);
      document.documentElement.classList.add('theory-dialog-open');
      dialog.showModal();
      $('.theory-dialog-close', dialog).focus();
    });
  });

  $('.theory-dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('theory-dialog-open');
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

// --- FILE (LESSON LIST) ---
function renderFile(params) {
  const fileId = params[0];
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#home" class="back-link">← Volver a niveles</a>
    <div class="lesson-header">
      <span class="file-num">File ${file.id}</span>
      <h1 style="margin-top:0.5rem">${escapeHTML(file.title)}</h1>
      <p class="topics">${escapeHTML(file.description)}</p>
      <div class="section-tabs" style="margin-top:1rem">
        <button class="tab-btn" id="startReview">📝 Practicar todo el File</button>
        <button class="tab-btn" id="startExam">🎯 Examen del File</button>
      </div>
    </div>
    <h2 class="section-title">📖 Lecciones</h2>
    <div class="lesson-list">
      ${file.lessons.map(l => {
        const lp = STATE.fileProgress[fileId]?.[l.letter] || { answered: 0, correct: 0, completed: false };
        const total = l.grammar.length + l.vocabulary.length + l.mixed.length;
        const acc = lp.answered > 0 ? Math.round((lp.correct / lp.answered) * 100) : null;
        return `
          <div class="lesson-card" data-lesson="${l.letter}">
            <div>
              <span class="lesson-letter">${l.letter}</span>
              <strong>${escapeHTML(l.title)}</strong>
            </div>
            <div class="lesson-topics">${escapeHTML(l.grammar_topic)} · ${escapeHTML(l.vocab_topic)}</div>
            <div class="lesson-meta">
              <span>${total} preguntas</span>
              <span>${lp.completed ? '✅ Completada' : (lp.answered > 0 ? `${lp.answered}/${total} respondidas · ${acc ?? 0}%` : 'Sin iniciar')}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  $$('.lesson-card').forEach(card => {
    card.addEventListener('click', () => Router.navigate('lesson/' + fileId + '/' + card.dataset.lesson));
  });
  $('#startReview').addEventListener('click', () => Router.navigate('practice/file/' + fileId));
  $('#startExam').addEventListener('click', () => Router.navigate('exam/' + fileId));
}

// --- LESSON DETAIL ---
function renderLesson(params) {
  const [fileId, lessonLetter] = params;
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  const lesson = file.lessons.find(l => l.letter === lessonLetter);
  if (!lesson) { Router.navigate('file/' + fileId); return; }
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#file/${fileId}" class="back-link">← Volver a File ${fileId}</a>
    <div class="lesson-header">
      <span class="file-num">File ${fileId} · Lección ${lesson.letter}</span>
      <h1 style="margin-top:0.5rem">${escapeHTML(lesson.title)}</h1>
      <p class="topics"><strong>Gramática:</strong> ${escapeHTML(lesson.grammar_topic)}<br><strong>Vocabulario:</strong> ${escapeHTML(lesson.vocab_topic)}</p>
      <div class="section-tabs" id="sectionTabs">
        <button class="tab-btn active" data-section="grammar">📐 Gramática <span class="count">${lesson.grammar.length}</span></button>
        <button class="tab-btn" data-section="vocabulary">📚 Vocabulario <span class="count">${lesson.vocabulary.length}</span></button>
        <button class="tab-btn" data-section="mixed">🎲 Tipo libro <span class="count">${lesson.mixed.length}</span></button>
        <button class="tab-btn" data-section="all">📋 Todo <span class="count">${lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length}</span></button>
      </div>
    </div>
    <div id="exerciseContainer"></div>
    <div class="text-center mt-3" id="completionArea" style="display:none">
      <p class="text-muted">¡Has terminado esta lección! 🎉</p>
      <button class="btn btn-success" id="markComplete">Marcar como completada</button>
      <a href="#file/${fileId}" class="btn btn-secondary" style="margin-left:0.5rem">Volver al File</a>
    </div>
  `;

  let answered = 0;
  const total = lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length;
  const showCompletion = () => {
    if (answered >= total) $('#completionArea').style.display = 'block';
  };

  const renderSection = (section) => {
    const c = $('#exerciseContainer');
    c.innerHTML = '';
    answered = 0;
    $('#completionArea').style.display = 'none';
    const items = section === 'all'
      ? [
          ...lesson.grammar.map(q => ({ ...q, _section: 'grammar' })),
          ...lesson.vocabulary.map(q => ({ ...q, _section: 'vocabulary' })),
          ...lesson.mixed.map(q => ({ ...q, _section: 'mixed' })),
        ]
      : lesson[section].map(q => ({ ...q, _section: section }));
    items.forEach((q, idx) => {
      Exercises.render(q, idx, c);
    });
    // Listen for answers
    c.addEventListener('answered', e => {
      answered++;
      const { correct, qIdx } = e.detail;
      const item = items[qIdx];
      const sectionKey = item._section;
      STATE = Storage.recordAnswer(STATE, fileId, lessonLetter, sectionKey, qIdx, correct);
      updateHeaderStats();
      if (correct) showToast('+10 puntos ⭐', 'success');
      showCompletion();
    });
  };

  $$('.tab-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn[data-section]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSection(btn.dataset.section);
    });
  });

  $('#markComplete')?.addEventListener('click', () => {
    STATE = Storage.markCompleted(STATE, fileId, lessonLetter);
    showToast('Lección marcada como completada ✅', 'success');
    Router.navigate('file/' + fileId);
  });

  renderSection('grammar');
}

// --- PRACTICE HUB ---
function renderPractice(params) {
  const view = $('#mainView');
  if (params[0] === 'file') {
    const fileId = params[1];
    const file = Files.find(f => f.id === fileId);
    if (!file) { Router.navigate('home'); return; }
    return startMixedPractice(file, 'file');
  }
  if (params[0] === 'review' || params[0] === 'wrong') {
    return startWrongReview();
  }
  if (params[0] === 'all') {
    return startAllPractice();
  }
  // Hub
  view.innerHTML = `
    <h1 class="section-title">🎯 Modos de práctica</h1>
    <p class="text-muted">Elige cómo quieres practicar hoy.</p>
    <div class="practice-modes">
      <div class="practice-mode" data-mode="all">
        <div class="practice-mode-icon">🌍</div>
        <h3>Práctica global</h3>
        <p>60 preguntas distintas y aleatorias de todos los Files. Ideal para repaso general.</p>
      </div>
      <div class="practice-mode" data-mode="wrong">
        <div class="practice-mode-icon">🔁</div>
        <h3>Repaso de errores (${STATE.wrongQuestions.length})</h3>
        <p>Las preguntas que has fallado antes. Cuanto más falles, más las verás.</p>
      </div>
      ${Files.map(f => `
        <div class="practice-mode" data-mode="file" data-file="${f.id}">
          <div class="practice-mode-icon">📘</div>
          <h3>File ${f.id}: ${escapeHTML(f.title)}</h3>
          <p>Solo las preguntas de este File. Recomendado para terminar un nivel.</p>
        </div>
      `).join('')}
    </div>
  `;
  $$('.practice-mode').forEach(el => {
    el.addEventListener('click', () => {
      const mode = el.dataset.mode;
      if (mode === 'all') Router.navigate('practice/all');
      else if (mode === 'wrong') Router.navigate('practice/wrong');
      else if (mode === 'file') Router.navigate('practice/file/' + el.dataset.file);
    });
  });
}

function startAllPractice() {
  const all = [];
  Files.forEach(f => f.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      all.push({ ...q, _ref: { file: f.id, lesson: l.letter, section: 'all', qIdx: i } });
    });
  }));
  const uniqueQuestions = new Map();
  all.forEach(question => {
    const content = { ...question };
    delete content._ref;
    const key = JSON.stringify(content);
    if (!uniqueQuestions.has(key)) uniqueQuestions.set(key, question);
  });
  const shuffled = [...uniqueQuestions.values()].sort(() => Math.random() - 0.5).slice(0, 60);
  startSession('Práctica global', shuffled, { mode: 'global' });
}

function startWrongReview() {
  if (STATE.wrongQuestions.length === 0) {
    const view = $('#mainView');
    view.innerHTML = `
      <h1 class="section-title">🔁 Repaso de errores</h1>
      <div class="lesson-header" style="text-align:center">
        <p style="font-size:1.2rem">🎉 ¡No tienes preguntas falladas pendientes!</p>
        <p class="text-muted">Sigue practicando y las que falles aparecerán aquí.</p>
        <a href="#home" class="btn mt-2">Volver al inicio</a>
      </div>
    `;
    return;
  }
  const items = [];
  STATE.wrongQuestions.forEach(w => {
    const file = Files.find(f => f.id === w.file);
    if (!file) return;
    const lesson = file.lessons.find(l => l.letter === w.lesson);
    if (!lesson) return;
    const pool = lesson[w.section] || lesson.grammar;
    if (pool[w.qIdx]) items.push({ ...pool[w.qIdx], _ref: w });
  });
  startSession('Repaso de errores', items, { mode: 'review' });
}

function startMixedPractice(file, mode) {
  const items = [];
  file.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      items.push({ ...q, _ref: { file: file.id, lesson: l.letter, section: 'all', qIdx: i } });
    });
  });
  items.sort(() => Math.random() - 0.5);
  startSession(`File ${file.id} — Práctica`, items, { mode });
}

function startSession(title, items, opts = {}) {
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#home" class="back-link">← Volver al inicio</a>
    <div class="lesson-header">
      <h1>${escapeHTML(title)}</h1>
      <p class="topics">${items.length} preguntas · Responde con calma, tu progreso se guarda automáticamente.</p>
      <div class="mt-2">
        <button class="btn btn-secondary" id="restartBtn">🔀 Reiniciar barajando</button>
        <button class="btn btn-ghost" id="exitBtn">Salir</button>
      </div>
    </div>
    <div id="exerciseContainer"></div>
    <div id="endSummary" style="display:none"></div>
  `;
  const c = $('#exerciseContainer');
  const results = [];
  items.forEach((q, idx) => {
    const exEl = document.createElement('div');
    exEl.dataset.idx = idx;
    c.appendChild(exEl);
    Exercises.render(q, idx, exEl);
  });
  c.addEventListener('answered', e => {
    const { correct, qIdx } = e.detail;
    const item = items[qIdx];
    const r = item._ref;
    STATE = Storage.recordAnswer(STATE, r.file, r.lesson, r.section, qIdx, correct);
    updateHeaderStats();
    if (correct) showToast('+10 puntos ⭐', 'success');
    results[qIdx] = correct;
  });
  // Summary at end: scroll watcher
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && entries[0].boundingClientRect.top > 0) {
      const allAnswered = results.filter(r => r !== undefined).length === items.length;
      if (allAnswered) {
        observer.disconnect();
        const correct = results.filter(Boolean).length;
        $('#endSummary').style.display = 'block';
        $('#endSummary').innerHTML = `
          <div class="lesson-header text-center">
            <h2>🎉 ¡Sesión completada!</h2>
            <p style="font-size:1.5rem; color:var(--primary); font-weight:700;">${correct} / ${items.length} correctas (${Math.round(correct/items.length*100)}%)</p>
            <p class="text-muted">Puntos ganados: <strong>+${correct * 10}</strong></p>
            <div class="mt-2">
              <a href="#home" class="btn">Volver al inicio</a>
              <button class="btn btn-secondary" id="repeatBtn">🔁 Repetir</button>
            </div>
          </div>
        `;
        $('#repeatBtn').addEventListener('click', () => {
          if (opts.mode === 'global') startAllPractice();
          else if (opts.mode === 'review') startWrongReview();
          else if (opts.mode === 'file') {
            const file = Files.find(f => f.id === items[0]?._ref?.file);
            if (file) startMixedPractice(file, 'file');
          } else location.reload();
        });
      }
    }
  });
  observer.observe($('#endSummary'));

  $('#restartBtn').addEventListener('click', () => {
    if (opts.mode === 'global') startAllPractice();
    else if (opts.mode === 'review') startWrongReview();
    else if (opts.mode === 'file') {
      const file = Files.find(f => f.id === items[0]?._ref?.file);
      if (file) startMixedPractice(file, 'file');
    }
  });
  $('#exitBtn').addEventListener('click', () => Router.navigate('home'));
}

// --- REVIEW PAGE ---
function renderReview() {
  const view = $('#mainView');
  const wrong = STATE.wrongQuestions;
  view.innerHTML = `
    <h1 class="section-title">🔁 Repaso de errores (${wrong.length})</h1>
    ${wrong.length === 0 ? `
      <div class="lesson-header text-center">
        <p style="font-size:1.2rem">🎉 No tienes errores pendientes.</p>
        <p class="text-muted">Las preguntas que falles se guardan aquí automáticamente para que puedas repasarlas.</p>
        <a href="#practice" class="btn mt-2">Ir a practicar</a>
      </div>
    ` : `
      <p class="text-muted mb-2">Estas son las preguntas que has fallado. Practícalas hasta dominarlas.</p>
      <button class="btn mb-2" id="practiceWrong">🎯 Practicar ahora</button>
      <button class="btn btn-ghost mb-2" id="clearWrong">🗑️ Borrar lista</button>
      <div class="review-list">
        ${wrong.map(w => {
          const file = Files.find(f => f.id === w.file);
          const lesson = file?.lessons.find(l => l.letter === w.lesson);
          const pool = lesson?.[w.section] || lesson?.grammar || [];
          const q = pool[w.qIdx];
          if (!q) return '';
          return `
            <div class="review-item">
              <div class="meta">
                <span>File ${w.file} · Lección ${w.lesson} · ${w.section === 'grammar' ? 'Gramática' : w.section === 'vocabulary' ? 'Vocabulario' : 'Tipo libro'}</span>
                <span>${new Date(w.ts).toLocaleDateString()}</span>
              </div>
              <div class="q">${q.prompt}</div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
  $('#practiceWrong')?.addEventListener('click', () => Router.navigate('practice/wrong'));
  $('#clearWrong')?.addEventListener('click', () => {
    if (confirm('¿Borrar toda la lista de errores?')) {
      STATE.wrongQuestions = [];
      Storage.save(STATE);
      renderReview();
    }
  });
}

// --- STATS PAGE ---
function renderStats() {
  const view = $('#mainView');
  const totalAnswered = STATE.totalAnswered;
  const accuracy = totalAnswered > 0 ? Math.round((STATE.totalCorrect / totalAnswered) * 100) : 0;
  // Per-file accuracy
  const fileStats = Files.map(f => {
    const lp = STATE.fileProgress[f.id] || {};
    const answered = Object.values(lp).reduce((s, l) => s + l.answered, 0);
    const correct = Object.values(lp).reduce((s, l) => s + l.correct, 0);
    const totalQuestions = f.lessons.reduce(
      (sum, lesson) => sum + lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length,
      0
    );
    return {
      file: f,
      answered,
      correct,
      totalQuestions,
      completion: totalQuestions > 0 ? Math.round(answered / totalQuestions * 100) : 0,
      accuracy: answered > 0 ? Math.round(correct / answered * 100) : 0
    };
  });

  view.innerHTML = `
    <h1 class="section-title">📊 Tu progreso</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Racha actual</div>
        <div class="value">${STATE.streak} 🔥</div>
        <div class="sub">días seguidos</div>
      </div>
      <div class="stat-card">
        <div class="label">Puntos totales</div>
        <div class="value">${STATE.points} ⭐</div>
        <div class="sub">+10 por acierto, -2 por error</div>
      </div>
      <div class="stat-card">
        <div class="label">Preguntas respondidas</div>
        <div class="value">${totalAnswered}</div>
        <div class="sub">en total</div>
      </div>
      <div class="stat-card">
        <div class="label">Precisión global</div>
        <div class="value">${accuracy}%</div>
        <div class="sub">${STATE.totalCorrect} correctas de ${totalAnswered}</div>
      </div>
      <div class="stat-card">
        <div class="label">Errores pendientes</div>
        <div class="value">${STATE.wrongQuestions.length} 🔁</div>
        <div class="sub">para repasar</div>
      </div>
      <div class="stat-card">
        <div class="label">Exámenes hechos</div>
        <div class="value">${STATE.examHistory.length} 🎯</div>
      </div>
    </div>
    <div class="chart">
      <h3>📈 Actividad por File</h3>
      <div class="bar-chart">
        ${fileStats.map(s => `
          <div class="bar-row">
            <div class="bar-label">File ${s.file.id}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${s.completion}%"></div>
            </div>
            <div class="bar-value" title="${s.accuracy}% de precisión">${s.answered}/${s.totalQuestions} (${s.completion}%)</div>
          </div>
        `).join('')}
      </div>
    </div>
    ${STATE.examHistory.length > 0 ? `
      <div class="chart">
        <h3>🎯 Historial de exámenes</h3>
        <div class="bar-chart">
          ${STATE.examHistory.slice().reverse().slice(0, 10).map(e => {
            const pct = Math.round(e.score / e.total * 100);
            return `
              <div class="bar-row">
                <div class="bar-label">${new Date(e.date).toLocaleDateString()}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width: ${pct}%; background: ${pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)'}"></div>
                </div>
                <div class="bar-value">${e.score}/${e.total} (${pct}%)</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
    <div class="text-center mt-3">
      <button class="btn btn-ghost" id="resetBtn">🗑️ Reiniciar todo mi progreso</button>
    </div>
  `;
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('¿Seguro? Esto borrará TODOS tus puntos, rachas, errores y progreso.')) {
      Storage.reset();
      STATE = Storage.load();
      updateHeaderStats();
      showToast('Progreso reiniciado', 'success');
      renderStats();
    }
  });
}

// --- EXAM MODE ---
function renderExam(params) {
  stopExamTimer();
  const fileId = params[0];
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  // Build a 15-question random exam
  const all = [];
  file.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      all.push({ ...q, _ref: { file: file.id, lesson: l.letter, section: 'exam', qIdx: i } });
    });
  });
  const questions = all.sort(() => Math.random() - 0.5).slice(0, Math.min(15, all.length));
  EXAM = {
    fileId,
    questions,
    idx: 0,
    score: 0,
    answers: [],
    started: false,
    startTime: null,
    intervalId: null,
  };
  renderExamIntro();
}

function renderExamIntro() {
  const view = $('#mainView');
  view.innerHTML = `
    <div class="lesson-header text-center exam-intro">
      <div style="font-size:3rem">🎯</div>
      <h1>Examen — File ${escapeHTML(EXAM.fileId)}</h1>
      <p class="topics">${EXAM.questions.length} preguntas. El cronómetro empezará cuando pulses «Iniciar examen».</p>
      <div class="mt-3">
        <button class="btn" id="startExamNow">▶ Iniciar examen</button>
        <a href="#file/${encodeURIComponent(EXAM.fileId)}" class="btn btn-secondary">Volver al File</a>
      </div>
    </div>
  `;
  $('#startExamNow').addEventListener('click', () => {
    EXAM.started = true;
    EXAM.startTime = Date.now();
    renderExamQuestion();
    EXAM.intervalId = setInterval(updateExamTimer, 1000);
  });
}

function updateExamTimer() {
  if (!EXAM || !EXAM.started || !EXAM.startTime) return;
  if (Router.current !== 'exam') {
    clearInterval(EXAM.intervalId);
    EXAM.intervalId = null;
    return;
  }
  const elapsed = Math.floor((Date.now() - EXAM.startTime) / 1000);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');
  const timer = $('#examTimer');
  if (timer) timer.textContent = `⏱ ${mins}:${secs}`;
}

function stopExamTimer() {
  if (EXAM && EXAM.intervalId) {
    clearInterval(EXAM.intervalId);
    EXAM.intervalId = null;
  }
}

function renderExamQuestion() {
  if (!EXAM || !EXAM.started) return;
  const view = $('#mainView');
  const q = EXAM.questions[EXAM.idx];
  const total = EXAM.questions.length;
  const elapsed = Math.floor((Date.now() - EXAM.startTime) / 1000);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  view.innerHTML = `
    <div class="exam-banner">
      <div>
        <strong>🎯 Examen — File ${EXAM.fileId}</strong>
        <div style="font-size:0.85rem; opacity:0.9">Pregunta ${EXAM.idx + 1} de ${total}</div>
        <div class="exam-progress"><div class="exam-progress-fill" style="width: ${(EXAM.idx / total) * 100}%"></div></div>
      </div>
      <div class="timer" id="examTimer">⏱ ${mins}:${secs}</div>
    </div>
    <div id="examQuestion"></div>
    <div class="text-center mt-2">
      <button class="btn btn-ghost" id="exitExam">Salir del examen</button>
    </div>
  `;
  const container = $('#examQuestion');
  Exercises.render(q, EXAM.idx, container);
  container.addEventListener('answered', e => {
    const correct = e.detail.correct;
    EXAM.answers.push(correct);
    if (correct) EXAM.score++;
    setTimeout(() => {
      EXAM.idx++;
      if (EXAM.idx >= EXAM.questions.length) {
        // Finish
        stopExamTimer();
        STATE = Storage.recordExam(STATE, EXAM.score, EXAM.questions.length, 'file-' + EXAM.fileId, [EXAM.fileId]);
        STATE = Storage.updateStreak(STATE);
        STATE.points += EXAM.score * 5; // bonus for exam
        Storage.save(STATE);
        Router.navigate('exam-result');
      } else {
        renderExamQuestion();
      }
    }, 1200);
  });
  $('#exitExam').addEventListener('click', () => {
    if (confirm('¿Salir del examen? Perderás el progreso actual.')) {
      stopExamTimer();
      Router.navigate('home');
    }
  });
}

function renderExamResult() {
  const view = $('#mainView');
  const { score, questions } = EXAM;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  let msg = '', emoji = '';
  if (pct >= 90) { msg = '¡Excelente! Dominas este nivel.'; emoji = '🏆'; }
  else if (pct >= 70) { msg = '¡Muy bien! Casi perfecto.'; emoji = '🎉'; }
  else if (pct >= 50) { msg = 'Bien, pero hay que repasar un poco más.'; emoji = '👍'; }
  else { msg = 'Necesitas practicar más este File.'; emoji = '💪'; }

  view.innerHTML = `
    <div class="lesson-header text-center">
      <div style="font-size:4rem">${emoji}</div>
      <h1>Resultado del examen</h1>
      <p style="font-size:2rem; color:var(--primary); font-weight:700;">${score} / ${total} (${pct}%)</p>
      <p class="text-muted">${msg}</p>
      <p class="text-muted">Bonus de puntos: +${score * 5} ⭐</p>
      <div class="mt-3">
        <a href="#home" class="btn">Volver al inicio</a>
        <button class="btn btn-secondary" id="retakeBtn">🔁 Repetir examen</button>
        <a href="#file/${EXAM.fileId}" class="btn btn-secondary">📖 Repasar File</a>
      </div>
    </div>
  `;
  $('#retakeBtn').addEventListener('click', () => Router.navigate('exam/' + EXAM.fileId));
  updateHeaderStats();
}

// Start
document.addEventListener('DOMContentLoaded', init);
