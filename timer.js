// =============================================
// COUNTDOWN TIMER SYSTEM
// =============================================

let currentTimer = null;
let timeRemaining = 0;

function startTimer() {
    // Clear any existing timer
    if (currentTimer) {
        clearInterval(currentTimer);
    }

    timeRemaining = appState.timePerQuestion;
    updateTimerDisplay(timeRemaining);

    currentTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay(timeRemaining);

        // Auto-advance when time runs out
        if (timeRemaining <= 0) {
            clearInterval(currentTimer);
            autoAdvanceQuestion();
        }
    }, 1000);
}

function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
    }
}

function autoAdvanceQuestion() {
    // Mark as unanswered and move to next
    if (appState.testStarted && appState.currentQuestionIndex < appState.questions.length) {
        const currentQuestion = appState.questions[appState.currentQuestionIndex];

        // Store unanswered
        appState.answers.push({
            questionIndex: appState.currentQuestionIndex,
            selected: null,
            correct: currentQuestion.correct,
            isCorrect: false,
        });

        // Show all answers briefly
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
            if (btn.getAttribute('data-correct') === 'true') {
                btn.classList.add('correct');
            }
        });

        setTimeout(() => {
            nextQuestion();
        }, 1000);
    }
}
