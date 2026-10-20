// Writing practice views
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
    progress = {
      unlocked: Math.min(verbs.length, Math.max(Math.min(5, verbs.length), Math.ceil((Number(saved.unlocked) || 5) / 5) * 5)),
      round: Math.max(0, Number(saved.round) || 0) % 100,
      total: Math.max(0, Number(saved.total) || 0),
    };
  } catch (_) { progress = { unlocked: Math.min(5, verbs.length), round: 0, total: 0 }; }
  const saveProgress = () => localStorage.setItem(progressKey, JSON.stringify(progress));
  const shuffleQuestions = items => {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  };
  let questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
  let index = 0;
  let checked = false;
  let advanceTimeout = null;
  const advanceQuestion = () => {
    if (advanceTimeout) clearTimeout(advanceTimeout);
    advanceTimeout = null;
    index = (index + 1) % questions.length;
    renderQuestion();
  };
  const normalize = answer => answer.trim().toLowerCase().replace(/\s+/g, ' ');
  const renderQuestion = () => {
    if (advanceTimeout) clearTimeout(advanceTimeout);
    advanceTimeout = null;
    const verb = questions[index];
    const answers = verb[exercise.formIndex];
    checked = false;
    view.innerHTML = `
      <a href="#irregular-verbs" class="back-link">← Back to verb forms</a>
      <div class="lesson-header"><span class="file-num">Irregular verbs · ${exercise.title}</span><h1 style="margin-top:0.5rem">Write the ${exercise.formIndex === 1 ? 'past simple' : 'past participle'}</h1><p class="topics">Write the form of the present verb below.</p><p class="topics">${progress.unlocked} of ${verbs.length} verbs unlocked · ${progress.round}/100 repetitions in this group · ${progress.total} total</p><div class="vocabulary-progress-track"><span style="width:${progress.round}%"></span></div><button class="btn btn-secondary" type="button" id="shuffleIrregularVerbs">🔀 Shuffle and restart</button> <button class="btn btn-secondary" type="button" id="resetIrregularVerbProgress">↺ Reset progress</button></div>
      <div class="reading-progress"><span>Question ${index + 1} of ${questions.length} unlocked verbs</span><strong>${progress.round}/100 reps</strong></div>
      <section class="writing-exercise"><h2>Present</h2><p class="writing-prompt">${escapeHTML(verb[0])}</p><div id="irregularVerbPhonetic"></div><label class="writing-answer-label" for="irregularVerbAnswer">Your answer</label><input id="irregularVerbAnswer" class="writing-answer-input" style="min-height:0" autocomplete="off" autocapitalize="none" spellcheck="false"><div id="irregularVerbFeedback" class="writing-feedback hidden" role="status" aria-live="polite"></div><div class="writing-actions"><button class="btn" type="button" id="checkIrregularVerb">Check answer</button><button class="btn btn-secondary" type="button" id="showIrregularVerbAnswer">Show answer</button><button class="btn btn-secondary" type="button" id="nextIrregularVerb">Next question</button></div></section>`;
    const input = $('#irregularVerbAnswer');
    const feedback = $('#irregularVerbFeedback');
    $('#irregularVerbPhonetic').appendChild(createPhoneticControl(() => verb[0]));
    $('#shuffleIrregularVerbs').addEventListener('click', () => {
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
      index = 0;
      renderQuestion();
    });
    $('#resetIrregularVerbProgress').addEventListener('click', () => {
      if (!window.confirm('Reset progress for this irregular verb practice? You will start again with the first 5 verbs.')) return;
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = null;
      progress = { unlocked: Math.min(5, verbs.length), round: 0, total: 0 };
      saveProgress();
      questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
      index = 0;
      renderQuestion();
    });
    $('#showIrregularVerbAnswer').addEventListener('click', () => {
      if (checked) return;
      checked = true;
      input.disabled = true;
      $('#checkIrregularVerb').disabled = true;
      feedback.className = 'writing-feedback';
      feedback.innerHTML = `<strong>Answer: ${answers.map(escapeHTML).join(' / ')}</strong>`;
    });
    const checkAnswer = () => {
      if (checked) return;
      if (!input.value.trim()) { showToast('Write an answer before checking it.', 'error'); input.focus(); return; }
      checked = true;
      const isCorrect = answers.includes(normalize(input.value));
      STATE = Storage.recordActivity(STATE, isCorrect);
      updateHeaderStats();
      input.disabled = true;
      $('#checkIrregularVerb').disabled = true;
      feedback.className = `writing-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = isCorrect ? '<strong>Correct!</strong>' : `<strong>Not quite.</strong><span>Correct answer: <strong>${answers.map(escapeHTML).join(' / ')}</strong></span>`;
      if (isCorrect) {
        progress.round += 1;
        progress.total += 1;
        let unlockedMore = false;
        if (progress.round >= 100) {
          progress.round = 0;
          const previousUnlocked = progress.unlocked;
          progress.unlocked = Math.min(verbs.length, progress.unlocked + 5);
          unlockedMore = progress.unlocked > previousUnlocked;
          if (unlockedMore) {
            questions = shuffleQuestions(verbs.slice(0, progress.unlocked));
            index = 0;
          }
        }
        saveProgress();
        $('.reading-progress strong').textContent = `${progress.round}/100 reps`;
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
    $('#nextIrregularVerb').addEventListener('click', advanceQuestion);
    input.addEventListener('input', () => {
      if (answers.includes(normalize(input.value))) checkAnswer();
    });
    input.addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
    focusAnswerFieldOnDesktop(input);
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
