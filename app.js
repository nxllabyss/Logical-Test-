// =============================================
// STATE MANAGEMENT
// =============================================

const appState = {
    currentPage: 'welcome',
    selectedLanguage: 'en',
    selectedDifficulty: 'easy',
    numQuestions: 10,
    timePerQuestion: 30,
    currentQuestionIndex: 0,
    questions: [],
    answers: [], // Store user answers
    score: 0,
    testStarted: false,
};

// =============================================
// LANGUAGE SYSTEM
// =============================================

const translations = {
    en: {
        welcome_title: 'Welcome to Logic Test',
        welcome_subtitle: 'Challenge your mind with strategic logic puzzles. Test your reasoning, pattern recognition, and analytical thinking.',
        btn_start: 'Start',
        select_language: 'Select Language',
        select_difficulty: 'Select Difficulty',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        test_settings: 'Test Settings',
        num_questions: 'Number of Questions',
        time_per_question: 'Time per Question',
        btn_start_test: 'Start Test',
        question: 'Question',
        test_completed: 'Test Completed!',
        correct_answers: 'Correct Answers:',
        performance: 'Performance:',
        btn_back_home: 'Back to Home',
    },
    uz: {
        welcome_title: 'Mantiq Testiga Xush Kelibsiz',
        welcome_subtitle: 'Strategik mantiq boshqotirmalariga yo\'n nazaringizni buling. Mantiqiy fikrlash, naqsh tanish va analitik fikrlashni sinovdan o\'tkazing.',
        btn_start: 'Boshlash',
        select_language: 'Tilni Tanlang',
        select_difficulty: 'Qiyinlik Darajasini Tanlang',
        easy: 'Oson',
        medium: 'O\'rtacha',
        hard: 'Qiyin',
        test_settings: 'Test Sozlamalari',
        num_questions: 'Savol Soni',
        time_per_question: 'Savol Uchun Vaqt',
        btn_start_test: 'Testni Boshlash',
        question: 'Savol',
        test_completed: 'Test Yakunlandi!',
        correct_answers: 'To\'g\'ri Javoblar:',
        performance: 'Natija:',
        btn_back_home: 'Asosiy Sahifaga Qaytish',
    },
    ru: {
        welcome_title: 'Добро пожаловать в Логический Тест',
        welcome_subtitle: 'Проверьте свой ум с помощью стратегических логических головоломок. Протестируйте свое рассуждение, распознавание закономерностей и аналитическое мышление.',
        btn_start: 'Начать',
        select_language: 'Выберите язык',
        select_difficulty: 'Выберите уровень сложности',
        easy: 'Легко',
        medium: 'Средне',
        hard: 'Сложно',
        test_settings: 'Параметры теста',
        num_questions: 'Количество вопросов',
        time_per_question: 'Время на вопрос',
        btn_start_test: 'Начать тест',
        question: 'Вопрос',
        test_completed: 'Тест завершен!',
        correct_answers: 'Правильные ответы:',
        performance: 'Производительность:',
        btn_back_home: 'Вернуться на главную',
    },
};

// =============================================
// DOM ELEMENTS
// =============================================

const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('themeToggle');
const startBtn = document.getElementById('startBtn');
const languageButtons = document.querySelectorAll('.language-btn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const settingsButtons = document.querySelectorAll('.settings-btn');
const startTestBtn = document.getElementById('startTestBtn');
const answerButtons = document.querySelectorAll('.answer-btn');
const backHomeBtn = document.getElementById('backHomeBtn');

// =============================================
// INITIALIZATION
// =============================================

function initializeApp() {
    loadThemePreference();
    loadLanguagePreference();
    updateUILanguage();
    attachEventListeners();
}

// =============================================
// PAGE NAVIGATION
// =============================================

function goToPage(pageName) {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));

    // Show target page
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageName;
    }
}

// =============================================
// THEME SYSTEM
// =============================================

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    saveThemePreference();
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (document.body.classList.contains('light-mode')) {
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
}

function loadThemePreference() {
    const savedTheme = StorageManager.getTheme();
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeIcon();
}

function saveThemePreference() {
    const isDarkMode = !document.body.classList.contains('light-mode');
    StorageManager.setTheme(isDarkMode ? 'dark' : 'light');
}

// =============================================
// LANGUAGE SYSTEM
// =============================================

function setLanguage(lang) {
    appState.selectedLanguage = lang;
    updateUILanguage();
    saveLanguagePreference();
    goToPage('difficulty');
}

function updateUILanguage() {
    const currentTranslations = translations[appState.selectedLanguage];
    const i18nElements = document.querySelectorAll('[data-i18n]');

    i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (currentTranslations[key]) {
            el.textContent = currentTranslations[key];
        }
    });
}

function loadLanguagePreference() {
    const savedLanguage = StorageManager.getLanguage();
    if (savedLanguage) {
        appState.selectedLanguage = savedLanguage;
    }
}

function saveLanguagePreference() {
    StorageManager.setLanguage(appState.selectedLanguage);
}

// =============================================
// DIFFICULTY & SETTINGS
// =============================================

function setDifficulty(difficulty) {
    appState.selectedDifficulty = difficulty;
    goToPage('settings');
}

function setTestSetting(setting, value) {
    if (setting === 'questions') {
        appState.numQuestions = parseInt(value);
    } else if (setting === 'time') {
        appState.timePerQuestion = parseInt(value);
    }

    // Update button states
    const buttons = document.querySelectorAll(`[data-setting="${setting}"]`);
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// =============================================
// TEST LOGIC
// =============================================

function initializeTest() {
    appState.testStarted = true;
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.answers = [];

    // Load questions based on selected difficulty and language
    const allQuestions = getQuestionsByLanguageAndDifficulty(
        appState.selectedLanguage,
        appState.selectedDifficulty
    );

    // Shuffle questions and select required number
    appState.questions = shuffleArray(allQuestions).slice(0, appState.numQuestions);

    // Update UI
    updateTestUI();
    goToPage('test');
    startTimer();
}

function updateTestUI() {
    const currentQuestion = appState.questions[appState.currentQuestionIndex];
    const questionNumber = appState.currentQuestionIndex + 1;
    const totalQuestions = appState.questions.length;

    // Update progress
    document.getElementById('currentQuestion').textContent = questionNumber;
    document.getElementById('totalQuestions').textContent = totalQuestions;

    const progressPercent = (questionNumber / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    // Update question
    document.getElementById('questionText').textContent = currentQuestion.question;

    // Shuffle and display answers
    const shuffledAnswers = shuffleArray([...currentQuestion.answers]);
    const answerBtns = document.querySelectorAll('.answer-btn');

    answerBtns.forEach((btn, index) => {
        btn.textContent = shuffledAnswers[index];
        btn.classList.remove('selected', 'correct', 'incorrect', 'disabled');
        btn.setAttribute('data-answer-text', shuffledAnswers[index]);

        // Store correct answer index for validation
        if (shuffledAnswers[index] === currentQuestion.correct) {
            btn.setAttribute('data-correct', 'true');
        } else {
            btn.removeAttribute('data-correct');
        }
    });

    // Reset timer display
    updateTimerDisplay(appState.timePerQuestion);
}

function submitAnswer(selectedButtonElement) {
    const currentQuestion = appState.questions[appState.currentQuestionIndex];
    const selectedAnswer = selectedButtonElement.getAttribute('data-answer-text');
    const isCorrect = selectedButtonElement.getAttribute('data-correct') === 'true';

    // Store answer
    appState.answers.push({
        questionIndex: appState.currentQuestionIndex,
        selected: selectedAnswer,
        correct: currentQuestion.correct,
        isCorrect: isCorrect,
    });

    // Update score
    if (isCorrect) {
        appState.score++;
    }

    // Visual feedback
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.add('disabled');
        if (btn.getAttribute('data-correct') === 'true') {
            btn.classList.add('correct');
        } else if (btn === selectedButtonElement && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Move to next question after delay
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function nextQuestion() {
    appState.currentQuestionIndex++;

    if (appState.currentQuestionIndex < appState.questions.length) {
        updateTestUI();
        startTimer();
    } else {
        endTest();
    }
}

function endTest() {
    appState.testStarted = false;
    showResults();
}

// =============================================
// RESULTS
// =============================================

function showResults() {
    const correctCount = appState.score;
    const totalCount = appState.questions.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    // Determine performance level
    let performance = 'Low';
    if (percentage >= 70) performance = 'High';
    else if (percentage >= 50) performance = 'Medium';

    // Update results page
    document.getElementById('scorePercentage').textContent = `${percentage}%`;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('totalCount').textContent = totalCount;

    const performanceEl = document.getElementById('performanceLevel');
    performanceEl.textContent = performance;
    performanceEl.className = `performance-level ${performance.toLowerCase()}`;

    // Save score
    StorageManager.saveScore({
        score: percentage,
        correct: correctCount,
        total: totalCount,
        difficulty: appState.selectedDifficulty,
        language: appState.selectedLanguage,
        date: new Date().toISOString(),
    });

    goToPage('results');
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function getQuestionsByLanguageAndDifficulty(lang, difficulty) {
    if (lang === 'en') {
        return questionsEN[difficulty] || [];
    } else if (lang === 'uz') {
        return questionsUZ[difficulty] || [];
    } else if (lang === 'ru') {
        return questionsRU[difficulty] || [];
    }
    return [];
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateTimerDisplay(seconds) {
    const display = `${seconds}s`;
    document.getElementById('timerDisplay').textContent = display;
}

// =============================================
// EVENT LISTENERS
// =============================================

function attachEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Welcome page
    startBtn.addEventListener('click', () => goToPage('language'));

    // Language selection
    languageButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            setLanguage(e.currentTarget.getAttribute('data-lang'));
        });
    });

    // Difficulty selection
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            setDifficulty(e.currentTarget.getAttribute('data-difficulty'));
        });
    });

    // Settings buttons
    settingsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const setting = e.currentTarget.getAttribute('data-setting');
            const value = e.currentTarget.getAttribute('data-value');
            setTestSetting(setting, value);
        });
    });

    // Start test
    startTestBtn.addEventListener('click', initializeTest);

    // Answer buttons
    answerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!appState.testStarted) return;
            if (e.currentTarget.classList.contains('disabled')) return;
            submitAnswer(e.currentTarget);
        });
    });

    // Back to home
    backHomeBtn.addEventListener('click', () => {
        appState.currentQuestionIndex = 0;
        appState.score = 0;
        appState.answers = [];
        goToPage('welcome');
    });
}

// =============================================
// START APP
// =============================================

document.addEventListener('DOMContentLoaded', initializeApp);
