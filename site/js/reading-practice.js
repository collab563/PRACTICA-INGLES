// Reading practice views
const READING_LEVELS = [
  { key: 'easy', title: 'Easy', description: 'Clear, everyday English with familiar situations and direct details.', emoji: '🌱' },
  { key: 'medium', title: 'Medium', description: 'Longer texts with connected ideas, explanations, and practical vocabulary.', emoji: '🌿' },
  { key: 'hard', title: 'Difficult', description: 'Detailed reading with more complex ideas, evidence, and careful reasoning.', emoji: '🌳' },
];

function renderReadingPractice(params = []) {
  const view = $('#mainView');
  const level = READING_LEVELS.find(item => item.key === params[0]);
  if (!params.length) {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header">
        <span class="file-num">Reading practice</span>
        <h1 style="margin-top:0.5rem">Reading</h1>
        <p class="topics">Choose a level. Each level has ten extended readings, ten multiple-choice questions, and one matching activity per passage.</p>
      </div>
      <div class="grammar-practice-grid">
        ${READING_LEVELS.map(item => `
          <button class="grammar-practice-card" type="button" data-reading-level="${item.key}">
            <span class="vocabulary-emoji" aria-hidden="true">${item.emoji}</span>
            <strong>${item.title}</strong>
            <small>${item.description}</small>
            <span>10 readings · Start →</span>
          </button>
        `).join('')}
      </div>
    `;
    $$('.grammar-practice-card[data-reading-level]', view).forEach(button => {
      button.addEventListener('click', () => Router.navigate(`reading/${button.dataset.readingLevel}`));
    });
    return;
  }

  if (!level) {
    Router.navigate('reading');
    return;
  }
  const passages = ReadingPassages[level.key];
  if (!Array.isArray(passages) || passages.length !== 10) {
    console.error(`Reading level ${level.key} must have exactly ten passages.`);
    showToast('This reading level is not available yet.', 'error');
    Router.navigate('reading');
    return;
  }

  const route = `#reading/${level.key}`;
  let passageIndex = 0;
  let totalCorrect = 0;
  let advanceTimeout = null;
  const cancelAdvanceOnNavigation = () => {
    if (window.location.hash !== route) {
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      window.removeEventListener('hashchange', cancelAdvanceOnNavigation);
    }
  };
  window.addEventListener('hashchange', cancelAdvanceOnNavigation);

  const renderSummary = () => {
    window.removeEventListener('hashchange', cancelAdvanceOnNavigation);
    view.innerHTML = `
      <a href="#reading" class="back-link">← Back to Reading levels</a>
      <div class="lesson-header text-center reading-summary">
        <div style="font-size:3rem">🎉</div>
        <h1>${level.title} Reading complete!</h1>
        <p class="topics">You finished all ten readings and scored ${totalCorrect} out of 110 possible questions.</p>
        <div class="mt-2">
          <button class="btn" type="button" id="restartReadingLevel">🔁 Practise this level again</button>
          <a href="#reading" class="btn btn-secondary">Choose another level</a>
        </div>
      </div>
    `;
    $('#restartReadingLevel').addEventListener('click', () => renderReadingPractice([level.key]));
  };

  const renderPassage = () => {
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
    if (passageIndex >= passages.length) {
      renderSummary();
      return;
    }
    const passage = passages[passageIndex];
    const extension = ReadingExtensions[level.key]?.[passageIndex];
    const furtherDetails = ReadingFurtherDetails[level.key]?.[passageIndex];
    if (!Array.isArray(passage.questions) || passage.questions.length !== 10 ||
        !extension || typeof extension.continuation !== 'string' || !extension.continuation.trim() ||
        typeof furtherDetails !== 'string' || !furtherDetails.trim() ||
        !Array.isArray(extension.matching) || extension.matching.length < 3) {
      console.error(`Reading ${passage.title} needs ten comprehension questions, extended text, and at least three matching pairs.`);
      showToast('A reading is missing its questions or matching activity.', 'error');
      Router.navigate('reading');
      return;
    }
    const totalQuestions = passage.questions.length + 1;
    const matchingActions = extension.matching.map(([, action], index) => ({ action, index }));
    for (let index = matchingActions.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [matchingActions[index], matchingActions[swapIndex]] = [matchingActions[swapIndex], matchingActions[index]];
    }
    const matchingLetters = extension.matching.map((_, index) => String.fromCharCode(65 + index));
    let answeredCount = 0;
    const questionCards = passage.questions.map(([prompt, correctAnswer], questionIndex) => {
      const alternatives = [];
      for (let offset = 1; offset < passage.questions.length && alternatives.length < 3; offset += 1) {
        const answer = passage.questions[(questionIndex + offset) % passage.questions.length][1];
        if (answer.toLowerCase() !== correctAnswer.toLowerCase() &&
            !alternatives.some(item => item.toLowerCase() === answer.toLowerCase())) alternatives.push(answer);
      }
      const options = [correctAnswer, ...alternatives];
      const correctOption = Math.floor(Math.random() * options.length);
      [options[0], options[correctOption]] = [options[correctOption], options[0]];
      const correctIndex = options.indexOf(correctAnswer);
      return `
        <section class="reading-question" data-question-index="${questionIndex}">
          <h3><span>${questionIndex + 1}.</span> ${escapeHTML(prompt)}</h3>
          <div class="reading-options">
            ${options.map((option, optionIndex) => `
              <button class="reading-option" type="button" data-option-index="${optionIndex}">
                <span class="reading-option-letter">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHTML(option)}</span>
              </button>
            `).join('')}
          </div>
          <div class="reading-question-feedback hidden" data-correct-index="${correctIndex}" aria-live="polite"></div>
        </section>
      `;
    }).join('');

    view.innerHTML = `
      <a href="#reading" class="back-link">← Back to Reading levels</a>
      <div class="lesson-header">
        <span class="file-num">Reading · ${level.title}</span>
        <h1 style="margin-top:0.5rem">${escapeHTML(passage.title)}</h1>
      </div>
      <div class="reading-progress">
        <span>${level.title} · Reading ${passageIndex + 1} of ${passages.length}</span>
        <strong id="readingQuestionProgress">0 / ${totalQuestions} questions answered</strong>
      </div>
      <article class="reading-passage">
        <h2>${escapeHTML(passage.title)}</h2>
        <p>${escapeHTML(`${passage.text} ${extension.continuation} ${furtherDetails}`)}</p>
      </article>
      <div class="reading-questions">
        <h2>Comprehension questions</h2>
        ${questionCards}
      </div>
      <section class="reading-match-question" id="readingMatchQuestion">
        <h2><span>11.</span> Match each person, group, or place with its action</h2>
        <p class="reading-match-instructions">Choose the action that matches each person or group in the reading.</p>
        <div class="reading-match-table">
          <div class="reading-match-header"><strong>Person / group</strong><strong>Action completed</strong></div>
          ${extension.matching.map(([subject], index) => `
            <label class="reading-match-row" data-match-index="${index}">
              <span class="reading-match-subject">${matchingLetters[index].toLowerCase()}) ${escapeHTML(subject)}</span>
              <span class="reading-match-answer">
                <input class="reading-match-letter" type="text" maxlength="1" autocomplete="off" autocapitalize="off" aria-label="Letter for action belonging to ${escapeHTML(subject)}">
                <span class="reading-match-action">${escapeHTML(matchingActions[index].action)}</span>
                <span class="reading-match-feedback hidden" aria-live="polite"></span>
              </span>
            </label>
          `).join('')}
        </div>
        <button class="btn btn-secondary" type="button" id="checkReadingMatches">Check matches</button>
      </section>
      <div class="reading-navigation">
        <button class="btn btn-secondary" type="button" id="nextReadingPassage">${passageIndex === passages.length - 1 ? 'Finish level' : 'Next reading'}</button>
      </div>
      <p class="reading-advance-message hidden" id="readingAdvanceMessage" role="status">Great work! Moving to the next reading…</p>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    $$('.reading-question', view).forEach(questionCard => {
      const feedback = $('.reading-question-feedback', questionCard);
      const correctIndex = Number(feedback.dataset.correctIndex);
      $$('.reading-option', questionCard).forEach((button, optionIndex) => {
        button.addEventListener('click', () => {
          if (questionCard.dataset.answered) return;
          questionCard.dataset.answered = 'true';
          const correct = optionIndex === correctIndex;
          $$('.reading-option', questionCard).forEach((option, index) => {
            option.disabled = true;
            if (index === correctIndex) option.classList.add('correct');
            else if (index === optionIndex) option.classList.add('wrong');
          });
          answeredCount += 1;
          totalCorrect += correct ? 1 : 0;
          STATE = Storage.recordActivity(STATE, correct);
          updateHeaderStats();
          feedback.classList.remove('hidden');
          feedback.classList.add(correct ? 'correct' : 'wrong');
          feedback.textContent = correct ? 'Correct!' : `Not quite. Correct answer: ${passage.questions[Number(questionCard.dataset.questionIndex)][1]}`;
          $('#readingQuestionProgress').textContent = `${answeredCount} / ${totalQuestions} questions answered`;
          if (answeredCount === totalQuestions) {
            $('#readingAdvanceMessage').classList.remove('hidden');
            $('#nextReadingPassage').disabled = true;
            advanceTimeout = setTimeout(() => {
              advanceTimeout = null;
              if (window.location.hash !== route) return;
              passageIndex += 1;
              renderPassage();
            }, 1100);
          }
        });
      });
    });

    $('#checkReadingMatches').addEventListener('click', () => {
      const rows = $$('.reading-match-row', view);
      if (rows.some(row => !$('.reading-match-letter', row).value.trim())) {
        showToast('Write a letter in every action box first.', 'error');
        return;
      }
      let allCorrect = true;
      rows.forEach((row, index) => {
        const input = $('.reading-match-letter', row);
        const feedback = $('.reading-match-feedback', row);
        const enteredLetter = input.value.trim().toUpperCase();
        const correct = enteredLetter === matchingLetters[matchingActions[index].index];
        allCorrect = allCorrect && correct;
        input.disabled = true;
        row.classList.add(correct ? 'correct' : 'wrong');
        feedback.classList.remove('hidden');
        feedback.textContent = correct
          ? 'Correct'
          : `Correct letter: ${matchingLetters[matchingActions[index].index].toLowerCase()})`;
      });
      $('#checkReadingMatches').disabled = true;
      answeredCount += 1;
      totalCorrect += allCorrect ? 1 : 0;
      STATE = Storage.recordActivity(STATE, allCorrect);
      updateHeaderStats();
      $('#readingQuestionProgress').textContent = `${answeredCount} / ${totalQuestions} questions answered`;
      if (answeredCount === totalQuestions) {
        $('#readingAdvanceMessage').classList.remove('hidden');
        $('#nextReadingPassage').disabled = true;
        advanceTimeout = setTimeout(() => {
          advanceTimeout = null;
          if (window.location.hash !== route) return;
          passageIndex += 1;
          renderPassage();
        }, 1100);
      }
    });

    $('#nextReadingPassage').addEventListener('click', () => {
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      passageIndex += 1;
      renderPassage();
    });
  };

  renderPassage();
}
