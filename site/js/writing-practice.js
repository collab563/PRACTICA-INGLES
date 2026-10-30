// Writing practice views
const IRREGULAR_VERB_UNLOCK_BATCH_SIZE = 5;
const IRREGULAR_VERB_REPETITIONS_PER_GROUP = 50;
const IRREGULAR_VERBS = [
  ['be', ['was', 'were'], ['been']], ['become', ['became'], ['become']], ['begin', ['began'], ['begun']],
  ['break', ['broke'], ['broken']], ['bring', ['brought'], ['brought']], ['build', ['built'], ['built']],
  ['buy', ['bought'], ['bought']], ['can', ['could'], []], ['catch', ['caught'], ['caught']],
  ['come', ['came'], ['come']], ['cost', ['cost'], ['cost']], ['do', ['did'], ['done']],
  ['drink', ['drank'], ['drunk']], ['drive', ['drove'], ['driven']], ['eat', ['ate'], ['eaten']],
  ['fall', ['fell'], ['fallen']], ['feel', ['felt'], ['felt']], ['find', ['found'], ['found']],
  ['fly', ['flew'], ['flown']], ['forget', ['forgot'], ['forgotten']], ['get', ['got'], ['got']],
  ['give', ['gave'], ['given']], ['go', ['went'], ['gone']], ['have', ['had'], ['had']],
  ['hear', ['heard'], ['heard']], ['know', ['knew'], ['known']], ['leave', ['left'], ['left']],
  ['lose', ['lost'], ['lost']], ['make', ['made'], ['made']], ['meet', ['met'], ['met']],
  ['pay', ['paid'], ['paid']], ['put', ['put'], ['put']], ['read', ['read'], ['read']],
  ['run', ['ran'], ['run']], ['say', ['said'], ['said']], ['see', ['saw'], ['seen']],
  ['send', ['sent'], ['sent']], ['sing', ['sang'], ['sung']], ['sit', ['sat'], ['sat']],
  ['sleep', ['slept'], ['slept']], ['speak', ['spoke'], ['spoken']], ['spend', ['spent'], ['spent']],
  ['stand', ['stood'], ['stood']], ['swim', ['swam'], ['swum']], ['teach', ['taught'], ['taught']],
  ['take', ['took'], ['taken']], ['tell', ['told'], ['told']], ['think', ['thought'], ['thought']],
  ['understand', ['understood'], ['understood']], ['wake', ['woke'], ['woken']],
  ['wear', ['wore'], ['worn']], ['win', ['won'], ['won']], ['write', ['wrote'], ['written']],
];
const IRREGULAR_VERB_TRANSLATIONS = {
  be: ['ser', 'estar'],
  become: ['convertirse', 'llegar a ser'],
  begin: ['empezar', 'comenzar'],
  break: ['romper'],
  bring: ['traer'],
  build: ['construir'],
  buy: ['comprar'],
  can: ['poder'],
  catch: ['atrapar', 'capturar'],
  come: ['venir'],
  cost: ['costar'],
  do: ['hacer'],
  drink: ['beber', 'tomar'],
  drive: ['conducir', 'manejar'],
  eat: ['comer'],
  fall: ['caer'],
  feel: ['sentir', 'sentirse'],
  find: ['encontrar', 'hallar'],
  fly: ['volar'],
  forget: ['olvidar'],
  get: ['obtener', 'conseguir', 'recibir'],
  give: ['dar'],
  go: ['ir'],
  have: ['tener', 'haber'],
  hear: ['oír', 'escuchar'],
  know: ['saber', 'conocer'],
  leave: ['salir', 'dejar'],
  lose: ['perder'],
  make: ['hacer', 'crear'],
  meet: ['conocer', 'reunirse', 'encontrarse'],
  pay: ['pagar'],
  put: ['poner', 'colocar'],
  read: ['leer'],
  run: ['correr'],
  say: ['decir'],
  see: ['ver'],
  send: ['enviar', 'mandar'],
  sing: ['cantar'],
  sit: ['sentarse'],
  sleep: ['dormir'],
  speak: ['hablar'],
  spend: ['gastar', 'pasar'],
  stand: ['estar de pie', 'pararse'],
  swim: ['nadar'],
  teach: ['enseñar'],
  take: ['tomar', 'llevar'],
  tell: ['decir', 'contar'],
  think: ['pensar', 'creer'],
  understand: ['entender', 'comprender'],
  wake: ['despertar', 'despertarse'],
  wear: ['llevar', 'vestir', 'usar'],
  win: ['ganar'],
  write: ['escribir'],
};
const IRREGULAR_VERB_FORM_TRANSLATIONS = {
  be: { pastSimple: { was: ['era', 'estaba', 'fui', 'estuve', 'fue', 'estuvo'], were: ['eras', 'estabas', 'fuiste', 'estuviste', 'fuimos', 'estuvimos', 'fueron', 'estuvieron', 'eramos', 'estabamos', 'eran', 'estaban', 'fuisteis', 'estuvisteis', 'erais', 'estabais'] }, pastParticiple: ['sido', 'estado'] },
  become: { pastSimple: ['me convertí', 'se convirtió', 'llegué a ser', 'llegó a ser'], pastParticiple: ['convertido', 'convertida', 'vuelto', 'vuelta'] },
  begin: { pastSimple: ['empecé', 'comencé', 'empezó', 'comenzó'], pastParticiple: ['empezado', 'empezada', 'comenzado', 'comenzada'] },
  break: { pastSimple: ['rompí', 'rompió'], pastParticiple: ['roto', 'rota', 'quebrado', 'quebrada'] },
  bring: { pastSimple: ['traje', 'trajo'], pastParticiple: ['traído', 'traída'] },
  build: { pastSimple: ['construí', 'construyó'], pastParticiple: ['construido', 'construida', 'edificado', 'edificada'] },
  buy: { pastSimple: ['compré', 'compró'], pastParticiple: ['comprado', 'comprada'] },
  can: { pastSimple: ['pude', 'pudo', 'podía', 'podían'], pastParticiple: [] },
  catch: { pastSimple: ['atrapé', 'atrapó', 'capturé', 'capturó'], pastParticiple: ['atrapado', 'atrapada', 'capturado', 'capturada'] },
  come: { pastSimple: ['vine', 'vino'], pastParticiple: ['venido', 'venida'] },
  cost: { pastSimple: ['costó'], pastParticiple: ['costado', 'costada'] },
  do: { pastSimple: ['hice', 'hizo'], pastParticiple: ['hecho', 'hecha'] },
  drink: { pastSimple: ['bebí', 'bebió', 'tomé', 'tomó'], pastParticiple: ['bebido', 'bebida', 'tomado', 'tomada'] },
  drive: { pastSimple: ['conduje', 'condujo', 'manejé', 'manejó'], pastParticiple: ['conducido', 'conducida', 'manejado', 'manejada'] },
  eat: { pastSimple: ['comí', 'comió'], pastParticiple: ['comido', 'comida'] },
  fall: { pastSimple: ['caí', 'cayó'], pastParticiple: ['caído', 'caída'] },
  feel: { pastSimple: ['sentí', 'sintió', 'me sentí', 'se sintió'], pastParticiple: ['sentido', 'sentida'] },
  find: { pastSimple: ['encontré', 'encontró', 'hallé', 'halló'], pastParticiple: ['encontrado', 'encontrada', 'hallado', 'hallada'] },
  fly: { pastSimple: ['volé', 'voló'], pastParticiple: ['volado', 'volada'] },
  forget: { pastSimple: ['olvidé', 'olvidó'], pastParticiple: ['olvidado', 'olvidada'] },
  get: { pastSimple: ['obtuve', 'obtuvo', 'conseguí', 'consiguió', 'recibí', 'recibió'], pastParticiple: ['obtenido', 'obtenida', 'conseguido', 'conseguida', 'recibido', 'recibida'] },
  give: { pastSimple: ['di', 'dio'], pastParticiple: ['dado', 'dada'] },
  go: { pastSimple: ['fui', 'fue'], pastParticiple: ['ido'] },
  have: { pastSimple: ['tuve', 'tuvo', 'hube', 'hubo'], pastParticiple: ['tenido', 'tenida', 'habido', 'habida'] },
  hear: { pastSimple: ['oí', 'oyó', 'escuché', 'escuchó'], pastParticiple: ['oído', 'oída', 'escuchado', 'escuchada'] },
  know: { pastSimple: ['supe', 'supo', 'conocí', 'conoció'], pastParticiple: ['sabido', 'sabida', 'conocido', 'conocida'] },
  leave: { pastSimple: ['salí', 'salió', 'dejé', 'dejó'], pastParticiple: ['salido', 'salida', 'dejado', 'dejada'] },
  lose: { pastSimple: ['perdí', 'perdió'], pastParticiple: ['perdido', 'perdida'] },
  make: { pastSimple: ['hice', 'hizo', 'creé', 'creó'], pastParticiple: ['hecho', 'hecha', 'creado', 'creada'] },
  meet: { pastSimple: ['conocí', 'conoció', 'me reuní', 'se reunió', 'me encontré', 'se encontró'], pastParticiple: ['conocido', 'conocida', 'reunido', 'reunida', 'encontrado', 'encontrada'] },
  pay: { pastSimple: ['pagué', 'pagó'], pastParticiple: ['pagado', 'pagada'] },
  put: { pastSimple: ['puse', 'puso', 'coloqué', 'colocó'], pastParticiple: ['puesto', 'puesta', 'colocado', 'colocada'] },
  read: { pastSimple: ['leí', 'leyó'], pastParticiple: ['leído', 'leída'] },
  run: { pastSimple: ['corrí', 'corrió'], pastParticiple: ['corrido', 'corrida'] },
  say: { pastSimple: ['dije', 'dijo'], pastParticiple: ['dicho', 'dicha'] },
  see: { pastSimple: ['vi', 'vio'], pastParticiple: ['visto', 'vista'] },
  send: { pastSimple: ['envié', 'envió', 'mandé', 'mandó'], pastParticiple: ['enviado', 'enviada', 'mandado', 'mandada'] },
  sing: { pastSimple: ['canté', 'cantó'], pastParticiple: ['cantado', 'cantada'] },
  sit: { pastSimple: ['me senté', 'se sentó'], pastParticiple: ['sentado', 'sentada'] },
  sleep: { pastSimple: ['dormí', 'durmió'], pastParticiple: ['dormido', 'dormida'] },
  speak: { pastSimple: ['hablé', 'habló'], pastParticiple: ['hablado', 'hablada'] },
  spend: { pastSimple: ['gasté', 'gastó', 'pasé', 'pasó'], pastParticiple: ['gastado', 'gastada', 'pasado', 'pasada'] },
  stand: { pastSimple: ['estuve de pie', 'estuvo de pie', 'me paré', 'se paró'], pastParticiple: ['estado de pie', 'parado', 'parada'] },
  swim: { pastSimple: ['nadé', 'nadó'], pastParticiple: ['nadado', 'nadada'] },
  teach: { pastSimple: ['enseñé', 'enseñó'], pastParticiple: ['enseñado', 'enseñada'] },
  take: { pastSimple: ['tomé', 'tomó', 'llevé', 'llevó'], pastParticiple: ['tomado', 'tomada', 'llevado', 'llevada'] },
  tell: { pastSimple: ['dije', 'dijo', 'conté', 'contó'], pastParticiple: ['dicho', 'dicha', 'contado', 'contada'] },
  think: { pastSimple: ['pensé', 'pensó', 'creí', 'creyó'], pastParticiple: ['pensado', 'pensada', 'creído', 'creída'] },
  understand: { pastSimple: ['entendí', 'entendió', 'comprendí', 'comprendió'], pastParticiple: ['entendido', 'entendida', 'comprendido', 'comprendida'] },
  wake: { pastSimple: ['desperté', 'despertó', 'me desperté', 'se despertó'], pastParticiple: ['despertado', 'despertada'] },
  wear: { pastSimple: ['llevé', 'llevó', 'vestí', 'vistió', 'usé', 'usó'], pastParticiple: ['llevado', 'llevada', 'vestido', 'vestida', 'usado', 'usada'] },
  win: { pastSimple: ['gané', 'ganó'], pastParticiple: ['ganado', 'ganada'] },
  write: { pastSimple: ['escribí', 'escribió'], pastParticiple: ['escrito', 'escrita'] },
};

function renderIrregularVerbsPractice(params = []) {
  const view = $('#mainView');
  const mode = params[0];
  const modes = {
    'past-simple': { title: 'Present to past simple', formIndex: 1 },
    'past-participle': { title: 'Present to past participle', formIndex: 2 },
  };
  if (!mode) {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header"><span class="file-num">Practice · Irregular verbs</span><h1 style="margin-top:0.5rem">Irregular verbs</h1><p class="topics">Choose a verb form to practise. Each activity uses the verbs from your reference images.</p></div>
      <div class="grammar-practice-grid">
        <button class="grammar-practice-card" type="button" data-verb-mode="past-simple"><span class="vocabulary-emoji">✍️</span><strong>Present to past simple</strong><small>Write the past simple form of each verb.</small><span>Start practice →</span></button>
        <button class="grammar-practice-card" type="button" data-verb-mode="past-participle"><span class="vocabulary-emoji">✍️</span><strong>Present to past participle</strong><small>Write the past participle form of each verb.</small><span>Start practice →</span></button>
      </div>`;
    $$('[data-verb-mode]', view).forEach(button => button.addEventListener('click', () => Router.navigate(`irregular-verbs/${button.dataset.verbMode}`)));
    return;
  }
  const exercise = modes[mode];
  if (!exercise) { Router.navigate('irregular-verbs'); return; }
  const verbs = IRREGULAR_VERBS.filter(verb => verb[exercise.formIndex].length);
  const progressKey = `irregular-verbs-${mode}`;
  let progress;
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) || '{}');
    const savedRound = Math.max(0, Number(saved.round) || 0);
    const completedGroups = Math.floor(savedRound / IRREGULAR_VERB_REPETITIONS_PER_GROUP);
    const savedUnlocked = Math.min(verbs.length, Math.max(
      Math.min(IRREGULAR_VERB_UNLOCK_BATCH_SIZE, verbs.length),
      Math.ceil((Number(saved.unlocked) || IRREGULAR_VERB_UNLOCK_BATCH_SIZE) / IRREGULAR_VERB_UNLOCK_BATCH_SIZE) * IRREGULAR_VERB_UNLOCK_BATCH_SIZE,
    ));
    progress = {
      unlocked: Math.min(verbs.length, savedUnlocked + completedGroups * IRREGULAR_VERB_UNLOCK_BATCH_SIZE),
      round: savedRound % IRREGULAR_VERB_REPETITIONS_PER_GROUP,
      total: Math.max(0, Number(saved.total) || 0),
    };
  } catch (_) { progress = { unlocked: Math.min(IRREGULAR_VERB_UNLOCK_BATCH_SIZE, verbs.length), round: 0, total: 0 }; }
  const saveProgress = () => localStorage.setItem(progressKey, JSON.stringify(progress));
  const answerHistory = new Map();
  const shuffleQuestions = items => {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  };
  let questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
  let index = 0;
  let questionCycle = 0;
  let checked = false;
  let advanceTimeout = null;
  const advanceQuestion = () => {
    if (advanceTimeout) clearTimeout(advanceTimeout);
    advanceTimeout = null;
    if (index === questions.length - 1) {
      index = 0;
      questionCycle += 1;
    } else {
      index += 1;
    }
    renderQuestion();
  };
  const normalize = answer => answer.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalizeSpanish = answer => answer
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  const renderQuestion = () => {
    if (advanceTimeout) clearTimeout(advanceTimeout);
    advanceTimeout = null;
    const verb = questions[index];
    const answers = verb[exercise.formIndex];
    const formLabel = exercise.formIndex === 1 ? 'past simple' : 'past participle';
    const meanings = IRREGULAR_VERB_TRANSLATIONS[verb[0]] || [];
    const formTranslationSet = IRREGULAR_VERB_FORM_TRANSLATIONS[verb[0]]?.[exercise.formIndex === 1 ? 'pastSimple' : 'pastParticiple'];
    const meaningsForForm = form => Array.isArray(formTranslationSet) ? formTranslationSet : (formTranslationSet?.[form] || []);
    const formTranslationAnswers = answers.flatMap(meaningsForForm);
    const answerHistoryKey = `${questionCycle}:${index}`;
    const savedResponse = answerHistory.get(answerHistoryKey);
    const progressPercent = Math.min(100, Math.round((progress.round / IRREGULAR_VERB_REPETITIONS_PER_GROUP) * 100));
    checked = Boolean(savedResponse?.checked);
    view.innerHTML = `
      <a href="#irregular-verbs" class="back-link">← Back to verb forms</a>
      <div class="lesson-header"><span class="file-num">Irregular verbs · ${exercise.title}</span><h1 style="margin-top:0.5rem">Write the ${exercise.formIndex === 1 ? 'past simple' : 'past participle'}</h1><p class="topics">Write the ${formLabel} form, its Spanish meaning, and the present verb's meaning.</p><p class="topics">${progress.unlocked} of ${verbs.length} verbs unlocked · ${progress.round}/${IRREGULAR_VERB_REPETITIONS_PER_GROUP} repetitions in this group · ${progress.total} total</p><div class="vocabulary-progress-track"><span style="width:${progressPercent}%"></span></div><button class="btn btn-secondary" type="button" id="shuffleIrregularVerbs">🔀 Shuffle and restart</button> <button class="btn btn-secondary" type="button" id="resetIrregularVerbProgress">↺ Reset progress</button></div>
      <div class="reading-progress"><span>Question ${index + 1} of ${questions.length} unlocked verbs</span><strong>${progress.round}/${IRREGULAR_VERB_REPETITIONS_PER_GROUP} reps</strong></div>
      <section class="writing-exercise"><h2>Present</h2><p class="writing-prompt">${escapeHTML(verb[0])}</p><label class="writing-answer-label" for="irregularVerbTranslation">Spanish meaning of the present verb</label><input id="irregularVerbTranslation" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Translate the present verb into Spanish..."><div id="irregularVerbPhonetic"></div><label class="writing-answer-label" for="irregularVerbAnswer">Write the ${formLabel} form</label><input id="irregularVerbAnswer" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Write the ${formLabel} form here..."><label class="writing-answer-label" for="irregularVerbFormTranslation">Spanish meaning of the ${formLabel} form</label><input id="irregularVerbFormTranslation" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Translate the ${formLabel} form into Spanish..."><div id="irregularVerbFeedback" class="writing-feedback hidden" role="status" aria-live="polite"></div><div class="writing-actions"><button class="btn btn-secondary" type="button" id="previousIrregularVerb" ${index === 0 ? 'disabled' : ''}>← Previous question</button><button class="btn" type="button" id="checkIrregularVerb">Check answer</button><button class="btn btn-secondary" type="button" id="showIrregularVerbAnswer">Show answer</button><button class="btn btn-secondary" type="button" id="nextIrregularVerb">Next question</button></div></section>`;
    const input = $('#irregularVerbAnswer');
    const translationInput = $('#irregularVerbTranslation');
    const formTranslationInput = $('#irregularVerbFormTranslation');
    const feedback = $('#irregularVerbFeedback');
    const appendCorrectAnswerPhonetics = () => {
      const phoneticLine = document.createElement('span');
      phoneticLine.className = 'irregular-verb-answer-phonetic';
      const transcriptions = answers.map(answer => {
        const { transcription, missing } = transcribeEnglishIPA(answer);
        return missing.length ? `${answer}: IPA unavailable` : `${answer}: /${transcription}/`;
      });
      phoneticLine.textContent = `UK IPA of the correct form: ${transcriptions.join(' · ')}`;
      feedback.appendChild(phoneticLine);
    };
    const renderAnswerFeedback = response => {
      const answerText = answers.map(escapeHTML).join(' / ');
      const meaningText = meanings.map(escapeHTML).join(' / ');
      const submittedForm = answers.find(answer => normalize(answer) === normalize(response.value));
      const acceptedFormMeanings = submittedForm ? meaningsForForm(submittedForm) : formTranslationAnswers;
      const formMeaningText = acceptedFormMeanings.map(escapeHTML).join(' / ');
      feedback.className = response.revealed
        ? 'writing-feedback'
        : `writing-feedback ${response.correct ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = response.revealed
        ? `<strong>Answers:</strong><span>${formLabel}: <strong>${answerText}</strong></span><span>Present verb meaning in Spanish: <strong>${meaningText}</strong></span><span>${formLabel} meaning in Spanish: <strong>${formMeaningText}</strong></span>`
        : `<strong>${response.correct ? 'All three answers are correct!' : 'Not quite.'}</strong><span>${response.formCorrect ? `${formLabel}: correct.` : `${formLabel}: correct answer is <strong>${answerText}</strong>`}</span><span>${response.meaningCorrect ? 'Present verb meaning: correct.' : `Present verb meaning in Spanish: <strong>${meaningText}</strong>`}</span><span>${response.formMeaningCorrect ? `${formLabel} meaning: correct.` : `${formLabel} meaning in Spanish: <strong>${formMeaningText}</strong>`}</span>`;
      appendCorrectAnswerPhonetics();
    };
    if (savedResponse) {
      input.value = savedResponse.value || '';
      translationInput.value = savedResponse.translationValue || '';
      formTranslationInput.value = savedResponse.formTranslationValue || '';
    }
    if (savedResponse?.checked) {
      input.disabled = true;
      translationInput.disabled = true;
      formTranslationInput.disabled = true;
      $('#checkIrregularVerb').disabled = true;
      renderAnswerFeedback(savedResponse);
    }
    $('#irregularVerbPhonetic').appendChild(createPhoneticControl(() => verb[0]));
    $('#shuffleIrregularVerbs').addEventListener('click', () => {
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
      index = 0;
      questionCycle = 0;
      answerHistory.clear();
      renderQuestion();
    });
    $('#resetIrregularVerbProgress').addEventListener('click', () => {
      if (!window.confirm(`Reset progress for this irregular verb practice? You will start again with the first ${IRREGULAR_VERB_UNLOCK_BATCH_SIZE} verbs.`)) return;
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      progress = { unlocked: Math.min(IRREGULAR_VERB_UNLOCK_BATCH_SIZE, verbs.length), round: 0, total: 0 };
      saveProgress();
      questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
      index = 0;
      questionCycle = 0;
      answerHistory.clear();
      renderQuestion();
    });
    $('#showIrregularVerbAnswer').addEventListener('click', () => {
      if (checked) return;
      checked = true;
      const response = {
        value: input.value,
        translationValue: translationInput.value,
        formTranslationValue: formTranslationInput.value,
        checked: true,
        revealed: true,
        correct: false,
        formCorrect: false,
        meaningCorrect: false,
        formMeaningCorrect: false,
      };
      answerHistory.set(answerHistoryKey, response);
      input.disabled = true;
      translationInput.disabled = true;
      formTranslationInput.disabled = true;
      $('#checkIrregularVerb').disabled = true;
      renderAnswerFeedback(response);
    });
    const checkAnswer = () => {
      if (checked) return;
      const emptyInput = [translationInput, input, formTranslationInput].find(field => !field.value.trim());
      if (emptyInput) {
        showToast('Write all three answers before checking.', 'error');
        emptyInput.focus();
        return;
      }
      checked = true;
      const formCorrect = answers.includes(normalize(input.value));
      const meaningCorrect = meanings.some(meaning => normalizeSpanish(meaning) === normalizeSpanish(translationInput.value));
      const submittedForm = answers.find(answer => normalize(answer) === normalize(input.value));
      const acceptedFormMeanings = submittedForm ? meaningsForForm(submittedForm) : formTranslationAnswers;
      const formMeaningCorrect = acceptedFormMeanings.some(meaning => normalizeSpanish(meaning) === normalizeSpanish(formTranslationInput.value));
      const isCorrect = formCorrect && meaningCorrect && formMeaningCorrect;
      const response = {
        value: input.value,
        translationValue: translationInput.value,
        formTranslationValue: formTranslationInput.value,
        checked: true,
        revealed: false,
        correct: isCorrect,
        formCorrect,
        meaningCorrect,
        formMeaningCorrect,
      };
      answerHistory.set(answerHistoryKey, response);
      STATE = Storage.recordActivity(STATE, isCorrect);
      updateHeaderStats();
      input.disabled = true;
      translationInput.disabled = true;
      formTranslationInput.disabled = true;
      $('#checkIrregularVerb').disabled = true;
      renderAnswerFeedback(response);
      if (isCorrect) {
        progress.round += 1;
        progress.total += 1;
        let unlockedMore = false;
        if (progress.round >= IRREGULAR_VERB_REPETITIONS_PER_GROUP) {
          progress.round = 0;
          const previousUnlocked = progress.unlocked;
          progress.unlocked = Math.min(verbs.length, progress.unlocked + IRREGULAR_VERB_UNLOCK_BATCH_SIZE);
          unlockedMore = progress.unlocked > previousUnlocked;
          if (unlockedMore) {
            questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
            index = 0;
            questionCycle = 0;
            answerHistory.clear();
          }
        }
        saveProgress();
        $('.reading-progress strong').textContent = `${progress.round}/${IRREGULAR_VERB_REPETITIONS_PER_GROUP} reps`;
        advanceTimeout = setTimeout(() => {
          advanceTimeout = null;
          if (!unlockedMore) advanceQuestion();
          else {
            renderQuestion();
            showToast(`${progress.unlocked} verbs are now unlocked!`, 'success');
          }
        }, 900);
      }
    };
    $('#checkIrregularVerb').addEventListener('click', checkAnswer);
    $('#previousIrregularVerb').addEventListener('click', () => {
      if (index === 0) return;
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      index -= 1;
      renderQuestion();
    });
    $('#nextIrregularVerb').addEventListener('click', advanceQuestion);
    const saveDraft = () => {
      if (checked) return;
      answerHistory.set(answerHistoryKey, {
        value: input.value,
        translationValue: translationInput.value,
        formTranslationValue: formTranslationInput.value,
        checked: false,
        revealed: false,
        correct: false,
        formCorrect: false,
        meaningCorrect: false,
        formMeaningCorrect: false,
      });
    };
    const hasAllAnswers = () => Boolean(input.value.trim() && translationInput.value.trim() && formTranslationInput.value.trim());
    const autoCheckIfCorrect = () => {
      saveDraft();
      if (!hasAllAnswers()) return;
      const formCorrect = answers.includes(normalize(input.value));
      const meaningCorrect = meanings.some(meaning => normalizeSpanish(meaning) === normalizeSpanish(translationInput.value));
      const submittedForm = answers.find(answer => normalize(answer) === normalize(input.value));
      const acceptedFormMeanings = submittedForm ? meaningsForForm(submittedForm) : formTranslationAnswers;
      const formMeaningCorrect = acceptedFormMeanings.some(meaning => normalizeSpanish(meaning) === normalizeSpanish(formTranslationInput.value));
      if (formCorrect && meaningCorrect && formMeaningCorrect) checkAnswer();
    };
    const checkOnFieldCommit = () => {
      saveDraft();
      if (hasAllAnswers()) checkAnswer();
    };
    input.addEventListener('input', autoCheckIfCorrect);
    translationInput.addEventListener('input', autoCheckIfCorrect);
    formTranslationInput.addEventListener('input', autoCheckIfCorrect);
    input.addEventListener('change', checkOnFieldCommit);
    translationInput.addEventListener('change', checkOnFieldCommit);
    formTranslationInput.addEventListener('change', checkOnFieldCommit);
    input.addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
    translationInput.addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
    formTranslationInput.addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
    focusAnswerFieldOnDesktop(translationInput);
  };
  renderQuestion();
}

const WRITING_LEVELS = [
  { key: 'easy', title: 'Easy', description: 'Translate short sentences about familiar people and everyday situations.', emoji: '🌱' },
  { key: 'medium', title: 'Medium', description: 'Practise longer sentences with different tenses and connected ideas.', emoji: '🌿' },
  { key: 'hard', title: 'Difficult', description: 'Translate complex sentences with advanced grammar and detailed meaning.', emoji: '🌳' },
];

function renderWritingPractice(params = []) {
  const view = $('#mainView');
  if (params[0] === 'evaluate') {
    window.renderAIWritingEvaluator(view);
    return;
  }
  const level = WRITING_LEVELS.find(item => item.key === params[0]);
  if (!params.length) {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header">
        <span class="file-num">Writing practice</span>
        <h1 style="margin-top:0.5rem">Writing</h1>
        <p class="topics">Choose a level and translate each Spanish sentence into English. You can skip any sentence.</p>
      </div>
      <section class="writing-ai-entry" aria-labelledby="writingAiTitle">
        <div>
          <h2 id="writingAiTitle">AI Writing Evaluator</h2>
          <p>Write a longer text in English and get detailed feedback on grammar, spelling, redundancy, and word order.</p>
        </div>
        <button class="btn" id="openAIWritingEvaluator" type="button">Evaluate a text</button>
      </section>
      <div class="grammar-practice-grid">
        ${WRITING_LEVELS.map(item => `
          <button class="grammar-practice-card" type="button" data-writing-level="${item.key}">
            <span class="vocabulary-emoji" aria-hidden="true">${item.emoji}</span>
            <strong>${item.title}</strong>
            <small>${item.description}</small>
            <span>10 sentences · Start →</span>
          </button>
        `).join('')}
      </div>
    `;
    $$('[data-writing-level]', view).forEach(button => {
      button.addEventListener('click', () => Router.navigate(`writing/${button.dataset.writingLevel}`));
    });
    $('#openAIWritingEvaluator').addEventListener('click', () => Router.navigate('writing/evaluate'));
    return;
  }

  if (!level) {
    Router.navigate('writing');
    return;
  }
  const sentences = WritingExercises[level.key];
  if (!Array.isArray(sentences) || sentences.length !== 10 ||
      sentences.some(item => !Array.isArray(item) || item.length !== 2 ||
        typeof item[0] !== 'string' || !Array.isArray(item[1]) ||
        item[1].length === 0 || item[1].some(answer => typeof answer !== 'string'))) {
    console.error(`Writing level ${level.key} must contain exactly ten valid sentence exercises.`);
    showToast('This writing level is not available yet.', 'error');
    Router.navigate('writing');
    return;
  }

  let sentenceIndex = 0;
  let correctCount = 0;
  let answeredCount = 0;
  const answeredSentences = new Set();
  const normalizeTranslation = value => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const renderSummary = () => {
    view.innerHTML = `
      <a href="#writing" class="back-link">← Back to Writing levels</a>
      <div class="lesson-header text-center writing-summary">
        <div style="font-size:3rem">🎉</div>
        <h1>${level.title} Writing complete!</h1>
        <p class="topics">You answered ${answeredCount} of ${sentences.length} sentences and translated ${correctCount} correctly.</p>
        <p class="writing-score">${correctCount} / ${sentences.length} correct</p>
        <div class="mt-2">
          <button class="btn" type="button" id="restartWritingLevel">🔁 Practise this level again</button>
          <a href="#writing" class="btn btn-secondary">Choose another level</a>
        </div>
      </div>
    `;
    $('#restartWritingLevel').addEventListener('click', () => renderWritingPractice([level.key]));
  };

  const renderSentence = () => {
    if (sentenceIndex >= sentences.length) {
      renderSummary();
      return;
    }
    const [prompt] = sentences[sentenceIndex];
    view.innerHTML = `
      <a href="#writing" class="back-link">← Back to Writing levels</a>
      <div class="lesson-header">
        <span class="file-num">Writing · ${level.title}</span>
        <h1 style="margin-top:0.5rem">Translate the sentence</h1>
        <p class="topics">Write the English translation of the Spanish sentence.</p>
      </div>
      <div class="reading-progress">
        <span>${level.title} · Sentence ${sentenceIndex + 1} of ${sentences.length}</span>
        <strong>${correctCount} correct</strong>
      </div>
      <section class="writing-exercise">
        <h2>Translate into English</h2>
        <p class="writing-prompt" lang="es">${escapeHTML(prompt)}</p>
        <label class="writing-answer-label" for="writingAnswer">Your translation</label>
        <textarea id="writingAnswer" class="writing-answer-input" rows="3" placeholder="Write your English translation here..." autocomplete="off" spellcheck="true"></textarea>
        <div id="writingPhoneticControl"></div>
        <div id="writingFeedback" class="writing-feedback hidden" role="status" aria-live="polite"></div>
        <div class="writing-actions">
          <button class="btn" id="checkWritingAnswer" type="button">Check answer</button>
          <button class="btn btn-secondary" id="nextWritingSentence" type="button">${sentenceIndex === sentences.length - 1 ? 'Finish level' : 'Next sentence'}</button>
        </div>
      </section>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const answerInput = $('#writingAnswer');
    $('#writingPhoneticControl').appendChild(createPhoneticControl(() => answerInput.value, { watchInput: answerInput }));
    focusAnswerFieldOnDesktop(answerInput);
    const feedback = $('#writingFeedback');
    const checkButton = $('#checkWritingAnswer');
    checkButton.addEventListener('click', () => {
      const answer = normalizeTranslation(answerInput.value);
      if (!answer) {
        showToast('Write your translation before checking it.', 'error');
        answerInput.focus();
        return;
      }
      if (answeredSentences.has(sentenceIndex)) return;
      const acceptedAnswers = sentences[sentenceIndex][1].map(normalizeTranslation);
      const correct = acceptedAnswers.includes(answer);
      answeredSentences.add(sentenceIndex);
      answeredCount += 1;
      correctCount += correct ? 1 : 0;
      STATE = Storage.recordActivity(STATE, correct);
      updateHeaderStats();
      answerInput.disabled = true;
      checkButton.disabled = true;
      feedback.className = `writing-feedback ${correct ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = correct
        ? '<strong>Correct!</strong>'
        : `<strong>Not quite.</strong><span>One correct translation: <strong>${escapeHTML(sentences[sentenceIndex][1][0])}</strong></span>`;
    });

    $('#nextWritingSentence').addEventListener('click', () => {
      sentenceIndex += 1;
      renderSentence();
    });
  };

  renderSentence();
}
