// Learning Lab: saved words, spaced review, mixed practice, and local video lessons.
const LEARNING_LAB_KEY = 'englishPractice_learningLab_v1';

function readLearningLabData() {
  try {
    const data = JSON.parse(localStorage.getItem(LEARNING_LAB_KEY) || '{}');
    return {
      words: data.words && typeof data.words === 'object' ? data.words : {},
      schedule: data.schedule && typeof data.schedule === 'object' ? data.schedule : {},
    };
  } catch (_) { return { words: {}, schedule: {} }; }
}

function saveLearningLabData(data) {
  localStorage.setItem(LEARNING_LAB_KEY, JSON.stringify(data));
}

function normalizeLearningAnswer(value) {
  return String(value || '').toLowerCase().trim().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[.!?,'"¿¡]/g, '').replace(/\s+/g, ' ');
}

function learningWordId(word) {
  return String(word || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getLearningVocabulary() {
  const entries = [];
  const add = (en, es, extras = {}) => {
    if (typeof en !== 'string' || !en.trim()) return;
    const english = en.trim();
    const translations = (Array.isArray(es) ? es : String(es || '').split(/\s*\/\s*/))
      .map(value => String(value).trim()).filter(Boolean);
    if (!translations.length) return;
    entries.push({ id: learningWordId(english), en: english, es: [...new Set(translations)], ...extras });
  };

  (globalThis.VocabularyWords || []).forEach(item => add(item.en, item.es));
  Object.entries(globalThis.VocabularyTranslationSets || {}).forEach(([setKey, set]) => {
    (set.items || []).forEach(item => add(item.en, item.es, { setTitle: set.title, setKey }));
  });
  const localFoodWords = typeof FILE_10_VOCABULARY !== 'undefined' ? FILE_10_VOCABULARY.food : [];
  (localFoodWords || []).forEach(item => add(item.word, item.translation, { aliases: item.aliases || [] }));

  const unique = new Map();
  entries.forEach(entry => {
    const key = normalizeLearningAnswer(entry.en);
    const existing = unique.get(key);
    if (existing) {
      existing.es = [...new Set([...existing.es, ...entry.es])];
      existing.aliases = [...new Set([...(existing.aliases || []), ...(entry.aliases || [])])];
    } else unique.set(key, entry);
  });
  return [...unique.values()];
}

const LEARNING_VOCABULARY = getLearningVocabulary();
const LEARNING_VOCABULARY_BY_ID = new Map(LEARNING_VOCABULARY.map(item => [item.id, item]));

function addLearningWord(word, details = {}) {
  const english = String(word || '').trim().toLowerCase();
  if (!/^[a-z]+(?:['’][a-z]+)?(?:[\s-]+[a-z]+(?:['’][a-z]+)?)*$/i.test(english)) return false;
  const id = learningWordId(english);
  const data = readLearningLabData();
  const known = LEARNING_VOCABULARY_BY_ID.get(id);
  const old = data.words[id] || {};
  data.words[id] = {
    id,
    en: known?.en || english,
    es: old.es || known?.es?.join(' / ') || '',
    example: details.example || old.example || '',
    source: details.source || old.source || 'Personal vocabulary',
    addedAt: old.addedAt || Date.now(),
  };
  data.schedule[id] = data.schedule[id] || { intervalDays: 0, dueAt: 0, repetitions: 0, lapses: 0 };
  saveLearningLabData(data);
  return true;
}

function updateLearningWordSchedule(word, correct) {
  const data = readLearningLabData();
  const schedule = data.schedule[word.id] || { intervalDays: 0, dueAt: 0, repetitions: 0, lapses: 0 };
  if (correct) {
    const steps = [1, 3, 7, 14, 30];
    schedule.intervalDays = steps[Math.min(schedule.repetitions, steps.length - 1)];
    schedule.repetitions += 1;
    schedule.dueAt = Date.now() + schedule.intervalDays * 24 * 60 * 60 * 1000;
  } else {
    schedule.intervalDays = 0;
    schedule.repetitions = 0;
    schedule.lapses += 1;
    schedule.dueAt = Date.now() + 10 * 60 * 1000;
  }
  data.schedule[word.id] = schedule;
  saveLearningLabData(data);
  return schedule;
}

globalThis.addLearningWord = addLearningWord;

function renderLearningLabPractice(params = []) {
  const view = $('#mainView');
  const section = params[0] || 'home';
  const data = readLearningLabData();
  const savedWords = Object.values(data.words);
  const now = Date.now();
  const dueCount = savedWords.filter(word => word.es?.trim() && (data.schedule[word.id]?.dueAt || 0) <= now).length;

  if (section === 'home') {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header"><span class="file-num">Practice · Learning Lab</span><h1 style="margin-top:0.5rem">Learning Lab</h1><p class="topics">Review words over time, practise older and newer material together, and learn from context.</p></div>
      <div class="grammar-practice-grid">
        <button class="grammar-practice-card" type="button" data-lab="review"><span class="vocabulary-emoji">🧠</span><strong>Daily spaced review</strong><small>${dueCount} saved words due now · recall English and Spanish before checking.</small><span>Review due words →</span></button>
        <button class="grammar-practice-card" type="button" data-lab="words"><span class="vocabulary-emoji">📚</span><strong>Word bank</strong><small>Search the project's vocabulary and add words to your personal review list.</small><span>Browse vocabulary →</span></button>
        <button class="grammar-practice-card" type="button" data-lab="notebook"><span class="vocabulary-emoji">📖</span><strong>My word notebook</strong><small>${savedWords.length} saved words. Add or edit meanings and examples from Reading.</small><span>Open notebook →</span></button>
        <button class="grammar-practice-card" type="button" data-lab="mixed"><span class="vocabulary-emoji">🔀</span><strong>Mixed cumulative practice</strong><small>12 questions per round: vocabulary, irregular verbs, and grammar from across the project.</small><span>Start a mixed round →</span></button>
        <button class="grammar-practice-card" type="button" data-lab="videos"><span class="vocabulary-emoji">🎬</span><strong>Video lessons</strong><small>Watch local English videos with English captions and practise their vocabulary.</small><span>Open video library →</span></button>
      </div>`;
    $$('[data-lab]', view).forEach(button => button.addEventListener('click', () => Router.navigate(`learning-lab/${button.dataset.lab}`)));
    return;
  }

  if (section === 'words') {
    view.innerHTML = `
      <a href="#learning-lab" class="back-link">← Back to Learning Lab</a>
      <div class="lesson-header"><span class="file-num">Learning Lab · Word bank</span><h1 style="margin-top:0.5rem">Choose words to learn</h1><p class="topics">Search the vocabulary already in the project and save useful words for spaced review.</p></div>
      <label class="learning-search-label" for="learningWordSearch">Search in English or Spanish</label><input id="learningWordSearch" class="vocabulary-input" type="search" autocomplete="off" placeholder="For example: garden or jardín">
      <p class="text-muted" id="learningWordCount"></p><div class="learning-word-list" id="learningWordList"></div>`;
    const search = $('#learningWordSearch', view);
    const list = $('#learningWordList', view);
    const renderWords = () => {
      const query = normalizeLearningAnswer(search.value);
      const current = readLearningLabData().words;
      const matches = LEARNING_VOCABULARY.filter(item => !query || normalizeLearningAnswer(`${item.en} ${item.es.join(' ')} ${item.setTitle || ''}`).includes(query)).slice(0, 60);
      $('#learningWordCount', view).textContent = query
        ? `${matches.length} results shown (up to 60).`
        : `Showing the first ${matches.length} words. Search to find more.`;
      list.innerHTML = matches.map(item => `
        <article class="learning-word-row"><div><strong>${escapeHTML(item.en)}</strong><span>${escapeHTML(item.es.join(' / '))}</span><small>${escapeHTML(item.setTitle || 'Project vocabulary')}</small></div>
        <button class="btn btn-secondary" type="button" data-add-word="${escapeHTML(item.id)}" ${current[item.id] ? 'disabled' : ''}>${current[item.id] ? 'Saved' : 'Add to review'}</button></article>`).join('') || '<p class="text-muted">No words found. Try another search.</p>';
      $$('[data-add-word]', list).forEach(button => button.addEventListener('click', () => {
        const item = LEARNING_VOCABULARY_BY_ID.get(button.dataset.addWord);
        if (!item) return;
        addLearningWord(item.en, { source: item.setTitle || 'Project vocabulary' });
        renderWords();
      }));
    };
    search.addEventListener('input', renderWords);
    renderWords();
    return;
  }

  if (section === 'notebook') {
    view.innerHTML = `
      <a href="#learning-lab" class="back-link">← Back to Learning Lab</a>
      <div class="lesson-header"><span class="file-num">Learning Lab · Notebook</span><h1 style="margin-top:0.5rem">My word notebook</h1><p class="topics">Edit meanings or add a short example. Changes to your notebook are saved on this device.</p></div>
      <p class="text-muted">${savedWords.length} saved words</p><div class="learning-word-list" id="learningNotebookList"></div>`;
    const list = $('#learningNotebookList', view);
    if (!savedWords.length) list.innerHTML = '<p class="text-muted">Your notebook is empty. Save a word from Reading or add one from the word bank.</p><a class="btn" href="#learning-lab/words">Browse word bank</a>';
    else list.innerHTML = savedWords.sort((a, b) => a.en.localeCompare(b.en)).map(word => `
      <article class="learning-notebook-row" data-notebook-id="${escapeHTML(word.id)}"><div><strong>${escapeHTML(word.en)}</strong><small>${escapeHTML(word.source || '')}</small>${word.example ? `<p class="learning-word-example">${escapeHTML(word.example)}</p>` : ''}</div>
      <label>Spanish meaning<input class="vocabulary-input" data-field="es" value="${escapeHTML(word.es || '')}" placeholder="Add translation" autocomplete="off"></label>
      <label>Example<input class="vocabulary-input" data-field="example" value="${escapeHTML(word.example || '')}" placeholder="Add an example sentence" autocomplete="off"></label>
      <button class="btn btn-secondary" type="button" data-remove-word>Remove</button></article>`).join('');
    $$('[data-notebook-id]', list).forEach(row => {
      $$('[data-field]', row).forEach(input => input.addEventListener('change', () => {
        const latest = readLearningLabData();
        latest.words[row.dataset.notebookId][input.dataset.field] = input.value.trim();
        saveLearningLabData(latest);
      }));
      $('[data-remove-word]', row).addEventListener('click', () => {
        const latest = readLearningLabData();
        delete latest.words[row.dataset.notebookId];
        delete latest.schedule[row.dataset.notebookId];
        saveLearningLabData(latest);
        renderLearningLabPractice(['notebook']);
      });
    });
    return;
  }

  if (section === 'review') {
    const dueWords = savedWords.filter(word => word.es?.trim() && (data.schedule[word.id]?.dueAt || 0) <= now);
    if (!dueWords.length) {
      view.innerHTML = `<a href="#learning-lab" class="back-link">← Back to Learning Lab</a><div class="lesson-header"><span class="file-num">Learning Lab · Daily review</span><h1 style="margin-top:0.5rem">You are up to date</h1><p class="topics">No saved words are due. Add a few words to start building your review schedule.</p><a href="#learning-lab/words" class="btn">Choose words</a></div>`;
      return;
    }
    for (let i = dueWords.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [dueWords[i], dueWords[j]] = [dueWords[j], dueWords[i]];
    }
    const queue = dueWords.slice(0, 10);
    const reviewRoute = '#learning-lab/review';
    let index = 0;
    let correctCount = 0;
    let advanceTimeout = null;
    const renderReview = () => {
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      if (index >= queue.length) {
        view.innerHTML = `<a href="#learning-lab" class="back-link">← Back to Learning Lab</a><div class="lesson-header text-center writing-summary"><div style="font-size:3rem">🎉</div><h1>Review complete</h1><p class="topics">You recalled ${correctCount} of ${queue.length} words.</p><p class="writing-score">${correctCount} / ${queue.length} correct</p><a href="#learning-lab/review" class="btn">Review more due words</a></div>`;
        return;
      }
      const word = queue[index];
      const englishToSpanish = Math.random() < 0.5;
      const answers = englishToSpanish ? word.es.split(/\s*\/\s*/) : [word.en];
      const prompt = englishToSpanish ? word.en : (word.es || '').split(/\s*\/\s*/)[0] || word.en;
      view.innerHTML = `
        <a href="#learning-lab" class="back-link">← Back to Learning Lab</a>
        <div class="lesson-header"><span class="file-num">Learning Lab · Daily spaced review</span><h1 style="margin-top:0.5rem">Recall the ${englishToSpanish ? 'Spanish meaning' : 'English word'}</h1><p class="topics">Card ${index + 1} of ${queue.length} due words · intervals grow when you remember a word.</p><button class="btn btn-secondary" type="button" id="shuffleDueWords">🔀 Shuffle remaining cards</button></div>
        <section class="writing-exercise"><p class="writing-prompt">${escapeHTML(prompt)}</p><label class="writing-answer-label" for="learningReviewAnswer">Your answer</label><input id="learningReviewAnswer" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none"><div id="learningReviewFeedback" class="writing-feedback hidden" role="status" aria-live="polite"></div><div class="writing-actions"><button class="btn" type="button" id="checkLearningReview">Check answer</button><button class="btn btn-secondary" type="button" id="showLearningReviewAnswer">Show answer</button><button class="btn btn-secondary" type="button" id="nextLearningReview">Next card</button></div></section>`;
      const input = $('#learningReviewAnswer', view);
      const feedback = $('#learningReviewFeedback', view);
      let checked = false;
      const grade = correct => {
        if (checked) return;
        checked = true;
        const schedule = updateLearningWordSchedule(word, correct);
        if (correct) {
          correctCount += 1;
          feedback.className = 'writing-feedback correct';
          feedback.innerHTML = '<strong>Correct! Next review in ' + schedule.intervalDays + ' day' + (schedule.intervalDays === 1 ? '' : 's') + '.</strong>';
        } else {
          feedback.className = 'writing-feedback incorrect';
          feedback.innerHTML = `<strong>Not quite.</strong><span>Answer: <strong>${escapeHTML(answers.join(' / '))}</strong></span>`;
        }
        STATE = Storage.recordActivity(STATE, correct);
        updateHeaderStats();
        input.disabled = true;
        $('#checkLearningReview', view).disabled = true;
        if (correct) advanceTimeout = setTimeout(() => {
          advanceTimeout = null;
          if (window.location.hash !== reviewRoute) return;
          index += 1;
          renderReview();
        }, 850);
      };
      const checkAnswer = () => {
        if (!input.value.trim()) { showToast('Write an answer before checking it.', 'error'); input.focus(); return; }
        grade(answers.some(answer => normalizeLearningAnswer(answer) === normalizeLearningAnswer(input.value)));
      };
      $('#checkLearningReview', view).addEventListener('click', checkAnswer);
      $('#showLearningReviewAnswer', view).addEventListener('click', () => {
        if (!checked) grade(false);
      });
      $('#nextLearningReview', view).addEventListener('click', () => { index += 1; renderReview(); });
      $('#shuffleDueWords', view).addEventListener('click', () => {
        const remaining = queue.slice(index);
        for (let i = remaining.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        queue.splice(index, queue.length - index, ...remaining);
        renderReview();
      });
      input.addEventListener('input', () => {
        if (answers.some(answer => normalizeLearningAnswer(answer) === normalizeLearningAnswer(input.value))) grade(true);
      });
      input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.isComposing) checkAnswer(); });
      focusAnswerFieldOnDesktop(input);
    };
    renderReview();
    return;
  }

  if (section === 'videos') {
    const videos = Array.isArray(globalThis.VideoLessons) ? globalThis.VideoLessons : [];
    view.innerHTML = `
      <a href="#learning-lab" class="back-link">← Back to Learning Lab</a>
      <div class="lesson-header"><span class="file-num">Learning Lab · Video lessons</span><h1 style="margin-top:0.5rem">Watch, listen, and learn</h1><p class="topics">Use English audio and English captions together. Pause to notice useful phrases, then save them to your notebook.</p></div>
      ${videos.length ? `<div class="learning-video-grid">${videos.map((video, index) => `
        <article class="learning-video-card"><h2>${escapeHTML(video.title || `Video ${index + 1}`)}</h2>${video.description ? `<p>${escapeHTML(video.description)}</p>` : ''}
          <video controls preload="metadata" playsinline aria-label="${escapeHTML(video.title || 'English lesson video')}"><source src="${escapeHTML(video.src)}" type="${video.type === 'webm' ? 'video/webm' : 'video/mp4'}">${video.captions ? `<track src="${escapeHTML(video.captions)}" kind="captions" srclang="en" label="English captions" default>` : ''}Your browser does not support HTML video.</video>
          ${video.transcript ? `<details><summary>Read transcript</summary><p>${escapeHTML(video.transcript)}</p></details>` : ''}
          ${video.vocabulary?.length ? `<div class="learning-video-vocab"><h3>Words from this video</h3>${video.vocabulary.map(item => `<button type="button" class="btn btn-secondary" data-video-word="${escapeHTML(item.en)}">Save ${escapeHTML(item.en)}</button>`).join(' ')}</div>` : ''}</article>`).join('')}</div>`
        : '<section class="learning-video-empty"><h2>Your video library is ready</h2><p>Add MP4 or WebM files to <code>site/videos/</code>, create English subtitle files in WebVTT format, and list each lesson in <code>site/data/video-lessons.js</code>.</p><p>That data file contains copyable examples for the video path, subtitle path, transcript, and vocabulary. See <code>site/videos/README.md</code> for the steps.</p></section>'}`;
    $$('[data-video-word]', view).forEach(button => button.addEventListener('click', () => {
      addLearningWord(button.dataset.videoWord, { source: 'Video lesson' });
      button.textContent = `Saved: ${button.dataset.videoWord}`;
      button.disabled = true;
    }));
    return;
  }

  if (section === 'mixed') {
    const saved = Object.values(readLearningLabData().words).filter(word => word.es && word.es.trim());
    const vocabularyById = new Map(LEARNING_VOCABULARY.map(word => [word.id, word]));
    saved.forEach(word => vocabularyById.set(word.id, {
      ...vocabularyById.get(word.id),
      ...word,
      es: (Array.isArray(word.es) ? word.es : String(word.es || '').split(/\s*\/\s*/)).filter(Boolean),
    }));
    const grammar = [];
    const courseFiles = typeof Files !== 'undefined' ? Files : (globalThis.Files || []);
    courseFiles.forEach(file => file.lessons.forEach(lesson => {
      ['grammar', 'vocabulary', 'mixed'].forEach(group => lesson[group].forEach(question => {
        if (['mc', 'fill', 'reorder', 'conversation', 'match', 'tf'].includes(question.type)) grammar.push(question);
      }));
    }));
    const sample = (items, count) => {
      const pool = [...items];
      for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, count);
    };
    const sentenceWords = sample(saved.filter(word => word.example?.trim()), 1);
    const vocabulary = [...vocabularyById.values()].filter(word => !sentenceWords.some(savedWord => savedWord.id === word.id));
    const irregularQuestions = sample(IRREGULAR_VERBS.filter(verb => verb[1].length || verb[2].length), 4)
      .map(verb => {
        const validForms = [1, 2].filter(formIndex => verb[formIndex].length);
        return { verb, formIndex: validForms[Math.floor(Math.random() * validForms.length)] };
      });
    const questions = [
      ...sample(vocabulary, sentenceWords.length ? 3 : 4).map(word => ({ kind: 'vocabulary', word })),
      ...sentenceWords.map(word => ({ kind: 'sentence', word })),
      ...irregularQuestions.map(item => ({ kind: 'irregular', verb: item.verb, formIndex: item.formIndex })),
      ...sample(grammar, 4).map(question => ({ kind: 'grammar', question })),
    ].sort(() => Math.random() - 0.5);
    const mixedRoute = '#learning-lab/mixed';
    let index = 0;
    let correctCount = 0;
    let advanceTimeout = null;
    const renderMixedQuestion = () => {
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      if (index >= questions.length) {
        view.innerHTML = `<a href="#learning-lab" class="back-link">← Back to Learning Lab</a><div class="lesson-header text-center writing-summary"><div style="font-size:3rem">🎉</div><h1>Mixed round complete</h1><p class="topics">${correctCount} of ${questions.length} correct</p><p class="writing-score">${correctCount} / ${questions.length}</p><button class="btn" id="newMixedRound" type="button">🔀 New mixed round</button></div>`;
        $('#newMixedRound', view).addEventListener('click', () => renderLearningLabPractice(['mixed']));
        return;
      }
      const item = questions[index];
      const isGrammar = item.kind === 'grammar';
      const header = item.kind === 'vocabulary' ? 'Vocabulary' : item.kind === 'irregular' ? 'Irregular verbs' : 'Grammar';
      view.innerHTML = `<a href="#learning-lab" class="back-link">← Back to Learning Lab</a><div class="lesson-header"><span class="file-num">Mixed practice · ${header}</span><h1 style="margin-top:0.5rem">Question ${index + 1} of ${questions.length}</h1><p class="topics">12 questions per round: vocabulary, irregular verbs, and grammar.</p><button class="btn btn-secondary" id="shuffleMixedRound" type="button">🔀 Shuffle and restart</button></div><div class="vocabulary-progress-bar"><span>Score</span><strong>${correctCount} / ${questions.length}</strong></div><div id="mixedQuestionBody"></div><div id="mixedQuestionFeedback" class="writing-feedback hidden" role="status" aria-live="polite"></div><div class="exercise-actions"><button class="btn btn-secondary" type="button" id="nextMixedQuestion">Next question</button></div>`;
      const body = $('#mixedQuestionBody', view);
      const feedback = $('#mixedQuestionFeedback', view);
      let answered = false;
      const record = correct => {
        if (answered) return;
        answered = true;
        correctCount += correct ? 1 : 0;
        STATE = Storage.recordActivity(STATE, correct);
        updateHeaderStats();
        $('.vocabulary-progress-bar strong', view).textContent = `${correctCount} / ${questions.length}`;
        if (correct) {
          feedback.className = 'writing-feedback correct';
          feedback.textContent = 'Correct!';
          advanceTimeout = setTimeout(() => {
            advanceTimeout = null;
            if (window.location.hash !== mixedRoute) return;
            index += 1;
            renderMixedQuestion();
          }, 850);
        } else {
          feedback.className = 'writing-feedback incorrect';
          feedback.textContent = 'Answer recorded. Check the correction in the exercise, then continue.';
        }
      };
      if (isGrammar) {
        const container = document.createElement('div');
        container.className = 'grammar-practice-question';
        body.appendChild(container);
        Exercises.render(item.question, index, container);
        container.addEventListener('answered', event => record(event.detail.correct), { once: true });
      } else if (item.kind === 'sentence') {
        body.innerHTML = `<section class="writing-exercise"><h2>Use this word in your own sentence</h2><p class="writing-prompt">${escapeHTML(item.word.en)}</p><label class="writing-answer-label" for="mixedSentenceAnswer">Write a new sentence with this word</label><textarea id="mixedSentenceAnswer" class="writing-answer-input" rows="3" placeholder="Write your sentence here..."></textarea><details><summary>Compare with the sentence from Reading</summary><p class="learning-word-example">${escapeHTML(item.word.example)}</p></details><p class="text-muted">After writing, check whether you used the word with the meaning you intended.</p><div class="writing-actions"><button class="btn" type="button" id="sentenceUsedCorrectly">I used it correctly</button><button class="btn btn-secondary" type="button" id="sentenceNeedsPractice">I need more practice</button></div></section>`;
        const sentenceInput = $('#mixedSentenceAnswer', view);
        const rateSentence = correct => {
          if (!sentenceInput.value.trim()) { showToast('Write your sentence before rating it.', 'error'); sentenceInput.focus(); return; }
          updateLearningWordSchedule(item.word, correct);
          record(correct);
          if (!correct) feedback.textContent = `Review the example: ${item.word.example}`;
          sentenceInput.disabled = true;
          $('#sentenceUsedCorrectly', view).disabled = true;
          $('#sentenceNeedsPractice', view).disabled = true;
        };
        $('#sentenceUsedCorrectly', view).addEventListener('click', () => rateSentence(true));
        $('#sentenceNeedsPractice', view).addEventListener('click', () => rateSentence(false));
        focusAnswerFieldOnDesktop(sentenceInput);
      } else {
        const isVocab = item.kind === 'vocabulary';
        const verb = item.verb;
        const prompt = isVocab ? item.word.en : verb[0];
        const accepted = isVocab
          ? (Array.isArray(item.word.es) ? item.word.es : String(item.word.es || '').split(/\s*\/\s*/)).flatMap(text => String(text).split(/\s*\/\s*/)).filter(Boolean)
          : verb[item.formIndex];
        const label = isVocab ? 'Write the Spanish meaning' : `Write the ${item.formIndex === 1 ? 'past simple' : 'past participle'}`;
        body.innerHTML = `<section class="writing-exercise"><h2>${label}</h2><p class="writing-prompt">${escapeHTML(prompt)}</p>${isVocab ? '' : '<div id="mixedPhonetic"></div>'}<label class="writing-answer-label" for="mixedAnswer">Your answer</label><input id="mixedAnswer" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none"><div class="writing-actions"><button class="btn" type="button" id="checkMixedAnswer">Check answer</button><button class="btn btn-secondary" type="button" id="showMixedAnswer">Show answer</button></div></section>`;
        const input = $('#mixedAnswer', view);
        if (!isVocab) $('#mixedPhonetic', view).appendChild(createPhoneticControl(() => verb[0]));
        const check = () => {
          if (answered) return;
          if (!input.value.trim()) { showToast('Write an answer before checking it.', 'error'); input.focus(); return; }
          const correct = accepted.some(answer => normalizeLearningAnswer(answer) === normalizeLearningAnswer(input.value));
          input.disabled = true;
          if (isVocab && readLearningLabData().words[item.word.id]) updateLearningWordSchedule(item.word, correct);
          record(correct);
          if (!correct) feedback.innerHTML = `Not quite. Correct answer: <strong>${escapeHTML(accepted.join(' / '))}</strong>`;
        };
        $('#checkMixedAnswer', view).addEventListener('click', check);
        $('#showMixedAnswer', view).addEventListener('click', () => {
          if (answered) return;
          record(false);
          input.disabled = true;
          feedback.innerHTML = `Answer: <strong>${escapeHTML(accepted.join(' / '))}</strong>`;
        });
        input.addEventListener('input', () => {
          if (accepted.some(answer => normalizeLearningAnswer(answer) === normalizeLearningAnswer(input.value))) check();
        });
        input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.isComposing) check(); });
        focusAnswerFieldOnDesktop(input);
      }
      $('#nextMixedQuestion', view).addEventListener('click', () => { index += 1; renderMixedQuestion(); });
      $('#shuffleMixedRound', view).addEventListener('click', () => {
        if (advanceTimeout) clearTimeout(advanceTimeout);
        advanceTimeout = null;
        questions.sort(() => Math.random() - 0.5);
        index = 0;
        correctCount = 0;
        renderMixedQuestion();
      });
    };
    renderMixedQuestion();
    return;
  }

  Router.navigate('learning-lab');
}
