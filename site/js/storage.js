// ============== STORAGE MODULE ==============
// Manages localStorage for user progress, streak, points, and theme

const STORAGE_KEY = 'englishPractice_v1';

const defaultState = {
  points: 0,
  streak: 0,
  lastActiveDate: null,
  totalAnswered: 0,
  totalCorrect: 0,
  theme: 'dark',
  soundEnabled: true,
  lastVisited: null,
};

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        delete parsed.wrongQuestions;
        delete parsed.fileProgress;
        delete parsed.examHistory;
      }
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
  recordActivity(state, correct) {
    state.totalAnswered += 1;
    if (correct) {
      state.totalCorrect += 1;
      state.points += 10;
    } else {
      state.points = Math.max(0, state.points - 2);
    }
    Storage.updateStreak(state);
    Storage.save(state);
    return state;
  },
};
