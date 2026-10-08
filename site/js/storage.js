// ============== STORAGE MODULE ==============
// Manages localStorage for user progress, streak, points, theme, wrong answers

const STORAGE_KEY = 'englishPractice_v1';

const defaultState = {
  points: 0,
  streak: 0,
  lastActiveDate: null,
  totalAnswered: 0,
  totalCorrect: 0,
  fileProgress: {}, // { '1': { 'A': { answered: 0, correct: 0, completed: false } } }
  wrongQuestions: [], // [{ file, lesson, section, qIndex, ts }]
  examHistory: [],   // [{ date, score, total, mode, fileIds }]
  theme: 'light',
  soundEnabled: true,
  lastVisited: null,
};

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch (e) {
      console.warn('Storage load failed', e);
      return { ...defaultState };
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  },
  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },
  // Streak management: increment if user came back within a day, reset if more than 1 day gap
  updateStreak(state) {
    const today = new Date().toDateString();
    if (state.lastActiveDate === today) return state; // already counted
    if (!state.lastActiveDate) {
      state.streak = 1;
    } else {
      const last = new Date(state.lastActiveDate);
      const diff = (new Date(today) - last) / (1000 * 60 * 60 * 24);
      if (diff <= 1) state.streak += 1;
      else state.streak = 1;
    }
    state.lastActiveDate = today;
    return state;
  },
  // Update progress for a question
  recordAnswer(state, file, lesson, section, qIndex, correct) {
    const key = `${file}-${lesson}-${section}`;
    if (!state.fileProgress[file]) state.fileProgress[file] = {};
    if (!state.fileProgress[file][lesson]) state.fileProgress[file][lesson] = { answered: 0, correct: 0, completed: false };
    const lessonProgress = state.fileProgress[file][lesson];
    lessonProgress.answered++;
    if (correct) {
      lessonProgress.correct++;
      state.points += 10;
    } else {
      state.points = Math.max(0, state.points - 2);
    }
    state.totalAnswered++;
    if (correct) state.totalCorrect++;
    // Track wrong questions for review
    if (!correct) {
      const existing = state.wrongQuestions.find(w => w.file === file && w.lesson === lesson && w.section === section && w.qIndex === qIndex);
      if (!existing) {
        state.wrongQuestions.push({ file, lesson, section, qIndex, ts: Date.now() });
      }
    } else {
      // Remove from wrong list when answered correctly
      state.wrongQuestions = state.wrongQuestions.filter(w => !(w.file === file && w.lesson === lesson && w.section === section && w.qIndex === qIndex));
    }
    Storage.updateStreak(state);
    Storage.save(state);
    return state;
  },
  markCompleted(state, file, lesson) {
    if (!state.fileProgress[file]) state.fileProgress[file] = {};
    if (!state.fileProgress[file][lesson]) state.fileProgress[file][lesson] = { answered: 0, correct: 0, completed: false };
    state.fileProgress[file][lesson].completed = true;
    Storage.save(state);
    return state;
  },
  recordExam(state, score, total, mode, fileIds) {
    state.examHistory.push({
      date: new Date().toISOString(),
      score, total, mode, fileIds
    });
    // Keep last 20
    state.examHistory = state.examHistory.slice(-20);
    Storage.save(state);
    return state;
  },
  // Compute file progress percentage (0-100) based on lessons completed
  getFileProgress(state, file) {
    const f = Files.find(x => x.id === file);
    if (!f) return 0;
    const lessons = ['A', 'B', 'C'];
    const total = lessons.length;
    const done = lessons.filter(l => state.fileProgress[file]?.[l]?.completed).length;
    return Math.round((done / total) * 100);
  }
};
