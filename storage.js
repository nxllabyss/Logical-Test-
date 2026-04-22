// =============================================
// LOCAL STORAGE MANAGER
// =============================================

const StorageManager = {
    // Keys
    KEYS: {
        THEME: 'logic_test_theme',
        LANGUAGE: 'logic_test_language',
        LAST_SCORE: 'logic_test_last_score',
        SCORE_HISTORY: 'logic_test_score_history',
    },

    // Theme
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'dark';
    },

    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    // Language
    getLanguage() {
        return localStorage.getItem(this.KEYS.LANGUAGE) || 'en';
    },

    setLanguage(lang) {
        localStorage.setItem(this.KEYS.LANGUAGE, lang);
    },

    // Score
    saveScore(scoreData) {
        // Save last score
        localStorage.setItem(this.KEYS.LAST_SCORE, JSON.stringify(scoreData));

        // Add to history
        const history = this.getScoreHistory();
        history.push(scoreData);
        localStorage.setItem(this.KEYS.SCORE_HISTORY, JSON.stringify(history));
    },

    getLastScore() {
        const score = localStorage.getItem(this.KEYS.LAST_SCORE);
        return score ? JSON.parse(score) : null;
    },

    getScoreHistory() {
        const history = localStorage.getItem(this.KEYS.SCORE_HISTORY);
        return history ? JSON.parse(history) : [];
    },

    clearHistory() {
        localStorage.removeItem(this.KEYS.SCORE_HISTORY);
    },
};
