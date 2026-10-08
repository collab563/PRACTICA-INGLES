// ============== EXERCISE ENGINE ==============
// Renders and grades all exercise types

const Exercises = {
  // Normalize text for answer comparison
  normalize(s) {
    return String(s).trim().toLowerCase().replace(/[.!?,'"]/g, '').replace(/\s+/g, ' ');
  },
  acceptVariants(user, accepted) {
    if (Array.isArray(accepted)) {
      return accepted.some(a => this.normalize(a) === this.normalize(user));
    }
    return this.normalize(user) === this.normalize(accepted);
  },

  // Render a single exercise
  render(ex, qIdx, container) {
    const el = document.createElement('div');
    el.className = 'exercise';
    el.dataset.qidx = qIdx;
    const numEl = document.createElement('div');
    numEl.className = 'exercise-num';
    numEl.textContent = `Pregunta ${qIdx + 1}`;
    el.appendChild(numEl);

    const promptEl = document.createElement('div');
    promptEl.className = 'exercise-prompt';
    promptEl.innerHTML = ex.prompt;
    el.appendChild(promptEl);

    if (ex.hint) {
      const hintEl = document.createElement('div');
      hintEl.className = 'exercise-hint';
      hintEl.textContent = `💡 ${ex.hint}`;
      el.appendChild(hintEl);
    }

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback hidden';
    el.appendChild(feedbackEl);

    // Body depends on type
    const body = document.createElement('div');
    body.className = 'exercise-body';
    el.appendChild(body);

    if (ex.type === 'mc') body.appendChild(this.renderMC(ex, el, feedbackEl));
    else if (ex.type === 'fill') body.appendChild(this.renderFill(ex, el, feedbackEl));
    else if (ex.type === 'reorder') body.appendChild(this.renderReorder(ex, el, feedbackEl));
    else if (ex.type === 'match') body.appendChild(this.renderMatch(ex, el, feedbackEl));
    else if (ex.type === 'tf') body.appendChild(this.renderTF(ex, el, feedbackEl));

    container.appendChild(el);
  },

  // --- Multiple Choice ---
  renderMC(ex, exEl, fbEl) {
    const wrap = document.createElement('div');
    wrap.className = 'options';
    let selected = null;
    let locked = false;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    ex.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.type = 'button';
      btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => {
        if (locked) return;
        // If already graded, allow change? No, lock first answer
        if (selected !== null) return;
        selected = i;
        wrap.querySelectorAll('.option').forEach((b, j) => {
          if (j === i) b.classList.add('selected');
        });
        const correct = i === ex.answer;
        if (correct) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          // Also highlight the correct one
          wrap.querySelectorAll('.option')[ex.answer]?.classList.add('correct');
        }
        locked = true;
        wrap.classList.add('locked');
        wrap.querySelectorAll('.option').forEach(b => b.classList.add('locked'));
        this.showFeedback(fbEl, correct, ex.explanation, ex.answerText || ex.options[ex.answer]);
        exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct, qIdx: +exEl.dataset.qidx }, bubbles: true }));
      });
      wrap.appendChild(btn);
    });
    return wrap;
  },

  // --- Fill in the blank ---
  renderFill(ex, exEl, fbEl) {
    const wrap = document.createElement('div');
    // Split prompt by ___ into segments
    const parts = ex.prompt.split('___');
    const row = document.createElement('div');
    row.className = 'fill-blank-row';
    const inputs = [];
    parts.forEach((part, i) => {
      if (i > 0) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-input';
        input.autocomplete = 'off';
        input.spellcheck = false;
        inputs.push(input);
        row.appendChild(input);
      }
      const span = document.createElement('span');
      span.innerHTML = part;
      row.appendChild(span);
    });
    wrap.appendChild(row);

    const actions = document.createElement('div');
    actions.className = 'exercise-actions';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn';
    checkBtn.textContent = 'Comprobar';
    checkBtn.type = 'button';
    checkBtn.addEventListener('click', () => {
      let allCorrect = true;
      inputs.forEach((inp, i) => {
        const ans = Array.isArray(ex.answer) ? ex.answer[i] : ex.answer;
        const ok = this.acceptVariants(inp.value, ans);
        inp.disabled = true;
        inp.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) allCorrect = false;
      });
      checkBtn.disabled = true;
      const correctAnswerText = Array.isArray(ex.answer) ? ex.answer.join(', ') : ex.answer;
      this.showFeedback(fbEl, allCorrect, ex.explanation, correctAnswerText);
      exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct: allCorrect, qIdx: +exEl.dataset.qidx }, bubbles: true }));
    });
    const revealBtn = document.createElement('button');
    revealBtn.className = 'btn btn-ghost';
    revealBtn.textContent = 'Mostrar respuesta';
    revealBtn.type = 'button';
    revealBtn.addEventListener('click', () => {
      inputs.forEach((inp, i) => {
        const ans = Array.isArray(ex.answer) ? ex.answer[i] : ex.answer;
        if (!inp.value) inp.value = ans;
        inp.disabled = true;
        inp.classList.add('correct');
      });
      checkBtn.disabled = true;
      revealBtn.disabled = true;
      const correctAnswerText = Array.isArray(ex.answer) ? ex.answer.join(', ') : ex.answer;
      this.showFeedback(fbEl, false, ex.explanation || 'Esta era la respuesta correcta.', correctAnswerText);
      exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct: false, qIdx: +exEl.dataset.qidx }, bubbles: true }));
    });
    actions.appendChild(checkBtn);
    actions.appendChild(revealBtn);
    wrap.appendChild(actions);
    return wrap;
  },

  // --- Reorder words ---
  renderReorder(ex, exEl, fbEl) {
    const wrap = document.createElement('div');
    // Shuffle the words
    const shuffled = [...ex.words].sort(() => Math.random() - 0.5);
    const pool = document.createElement('div');
    pool.className = 'word-pool';
    const answer = document.createElement('div');
    answer.className = 'answer-line';

    const makeChip = (word, isPlaced) => {
      const c = document.createElement('button');
      c.className = 'word-chip';
      c.type = 'button';
      c.textContent = word + (isPlaced ? ' ✕' : '');
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        if (c.classList.contains('placed')) {
          // move back to pool
          c.classList.remove('placed');
          c.textContent = word;
          pool.appendChild(c);
        } else {
          c.classList.add('placed');
          c.textContent = word + ' ✕';
          answer.appendChild(c);
        }
        answer.classList.remove('correct', 'wrong');
      });
      return c;
    };

    shuffled.forEach(w => pool.appendChild(makeChip(w, false)));
    wrap.appendChild(pool);
    wrap.appendChild(answer);

    const actions = document.createElement('div');
    actions.className = 'exercise-actions';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn';
    checkBtn.textContent = 'Comprobar';
    checkBtn.type = 'button';
    checkBtn.addEventListener('click', () => {
      const got = Array.from(answer.querySelectorAll('.word-chip')).map(c => c.textContent.replace(' ✕', ''));
      const want = ex.words;
      const ok = got.length === want.length && got.every((w, i) => this.normalize(w) === this.normalize(want[i]));
      answer.classList.add(ok ? 'correct' : 'wrong');
      // Lock chips
      wrap.querySelectorAll('.word-chip').forEach(c => c.classList.add('locked'));
      checkBtn.disabled = true;
      this.showFeedback(fbEl, ok, ex.explanation, want.join(' '));
      exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct: ok, qIdx: +exEl.dataset.qidx }, bubbles: true }));
    });
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-ghost';
    resetBtn.textContent = 'Reiniciar';
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', () => {
      // Move all back
      const placed = Array.from(answer.querySelectorAll('.word-chip'));
      placed.forEach(c => {
        c.classList.remove('placed', 'locked');
        c.textContent = c.textContent.replace(' ✕', '');
        pool.appendChild(c);
      });
      answer.classList.remove('correct', 'wrong');
    });
    actions.appendChild(checkBtn);
    actions.appendChild(resetBtn);
    wrap.appendChild(actions);
    return wrap;
  },

  // --- Match pairs ---
  renderMatch(ex, exEl, fbEl) {
    const wrap = document.createElement('div');
    const left = [...ex.pairs.map((p, i) => ({ text: p[0], matchIdx: i, side: 'L' }))].sort(() => Math.random() - 0.5);
    const right = [...ex.pairs.map((p, i) => ({ text: p[1], matchIdx: i, side: 'R' }))].sort(() => Math.random() - 0.5);
    const grid = document.createElement('div');
    grid.className = 'match-grid';
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.gap = '0.5rem';
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.gap = '0.5rem';

    let selected = null;
    let matched = 0;
    let locked = false;

    const items = [...left, ...right];
    items.forEach((item, idx) => {
      const el = document.createElement('button');
      el.className = 'match-item';
      el.type = 'button';
      el.textContent = item.text;
      el.dataset.matchIdx = item.matchIdx;
      el.dataset.side = item.side;
      el.addEventListener('click', () => {
        if (locked || el.classList.contains('matched')) return;
        if (selected === el) {
          el.classList.remove('selected');
          selected = null;
          return;
        }
        if (selected) {
          if (selected.dataset.matchIdx === el.dataset.matchIdx && selected.dataset.side !== el.dataset.side) {
            // match!
            selected.classList.add('matched');
            el.classList.add('matched');
            selected = null;
            matched++;
            if (matched === ex.pairs.length) {
              locked = true;
              this.showFeedback(fbEl, true, ex.explanation, '');
              exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct: true, qIdx: +exEl.dataset.qidx }, bubbles: true }));
            }
          } else {
            // wrong
            const prev = selected;
            prev.classList.add('wrong');
            el.classList.add('wrong');
            setTimeout(() => {
              prev.classList.remove('wrong', 'selected');
              el.classList.remove('wrong');
            }, 500);
            selected = null;
          }
        } else {
          document.querySelectorAll('.match-item.selected').forEach(s => s.classList.remove('selected'));
          el.classList.add('selected');
          selected = el;
        }
      });
      if (item.side === 'L') leftCol.appendChild(el);
      else rightCol.appendChild(el);
    });
    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    wrap.appendChild(grid);

    // Reset/auto button to give up
    const actions = document.createElement('div');
    actions.className = 'exercise-actions';
    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'btn btn-ghost';
    giveUpBtn.textContent = 'Mostrar respuestas';
    giveUpBtn.type = 'button';
    giveUpBtn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      document.querySelectorAll('.match-item').forEach(el => {
        el.classList.add('locked');
        el.classList.remove('selected', 'wrong');
      });
      this.showFeedback(fbEl, false, '', '');
      exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct: false, qIdx: +exEl.dataset.qidx }, bubbles: true }));
    });
    actions.appendChild(giveUpBtn);
    wrap.appendChild(actions);
    return wrap;
  },

  // --- True / False ---
  renderTF(ex, exEl, fbEl) {
    const wrap = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'tf-row';
    let selected = null;
    let locked = false;
    const tfTrue = document.createElement('button');
    tfTrue.className = 'tf-btn';
    tfTrue.type = 'button';
    tfTrue.textContent = '✓ True (Verdadero)';
    const tfFalse = document.createElement('button');
    tfFalse.className = 'tf-btn';
    tfFalse.type = 'button';
    tfFalse.textContent = '✗ False (Falso)';
    const onClick = (val) => {
      if (locked) return;
      if (selected !== null) return;
      selected = val;
      const correct = val === ex.answer;
      const btn = val ? tfTrue : tfFalse;
      btn.classList.add(correct ? 'correct' : 'wrong');
      btn.classList.add(selected ? 'true' : 'false');
      // Highlight correct
      if (!correct) {
        (ex.answer ? tfTrue : tfFalse).classList.add('correct');
      }
      locked = true;
      this.showFeedback(fbEl, correct, ex.explanation, ex.answer ? 'Verdadero' : 'Falso');
      exEl.dispatchEvent(new CustomEvent('answered', { detail: { correct, qIdx: +exEl.dataset.qidx }, bubbles: true }));
    };
    tfTrue.addEventListener('click', () => onClick(true));
    tfFalse.addEventListener('click', () => onClick(false));
    row.appendChild(tfTrue);
    row.appendChild(tfFalse);
    wrap.appendChild(row);
    return wrap;
  },

  showFeedback(fbEl, correct, explanation, answerText) {
    fbEl.classList.remove('hidden', 'correct', 'wrong');
    fbEl.classList.add(correct ? 'correct' : 'wrong');
    let html = `<span class="ico">${correct ? '✅' : '❌'}</span><div class="msg">`;
    html += `<strong>${correct ? '¡Correcto! ¡Bien hecho!' : 'No del todo.'}</strong>`;
    if (!correct && answerText) html += `<div>Respuesta correcta: <strong>${answerText}</strong></div>`;
    if (explanation) html += `<div style="margin-top:0.4rem; color: var(--text-muted);">${explanation}</div>`;
    html += '</div>';
    fbEl.innerHTML = html;
  }
};
