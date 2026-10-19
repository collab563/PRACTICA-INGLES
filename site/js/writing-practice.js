// Writing practice views
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
