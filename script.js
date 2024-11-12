let currentCategory = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let isEnglish = true;
let timer;
let timeLeft;
let gameInterval;

const wordsQuestions = [
    {
        question: "What is 'Elma' in English?",
        questionTr: "'Elma' İngilizce ne demek?",
        options: ["Apple", "Banana", "Orange", "Grape"],
        optionsTr: ["Elma", "Muz", "Portakal", "Üzüm"],
        correct: 0
    },
    // Diğer kelime soruları buraya eklenecek
];

const spellingQuestions = [
    {
        question: "Which one is correctly spelled?",
        questionTr: "Hangisi doğru yazılmıştır?",
        options: ["Teacher", "Techer", "Teachr", "Teecher"],
        optionsTr: ["Teacher", "Techer", "Teachr", "Teecher"],
        correct: 0
    },
    // Diğer yazım soruları buraya eklenecek
];

const speakingQuestions = [
    {
        question: "How do you say 'Merhaba'?",
        questionTr: "'Merhaba' nasıl söylenir?",
        options: ["Hello", "Goodbye", "Thank you", "Please"],
        optionsTr: ["Merhaba", "Hoşçakal", "Teşekkürler", "Lütfen"],
        correct: 0
    },
    // Diğer konuşma soruları buraya eklenecek
];

function startCategory(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    
    switch(category) {
        case 'words':
            questions = wordsQuestions;
            break;
        case 'spelling':
            questions = spellingQuestions;
            break;
        case 'speaking':
            questions = speakingQuestions;
            break;
    }
    
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('totalQuestions').textContent = questions.length;
    updateProgressBar();
    showQuestion();
}

function showQuestion() {
    clearInterval(gameInterval);
    timeLeft = 15;
    updateTimer();
    
    gameInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            handleAnswer(-1); // Zaman dolduğunda yanlış cevap olarak işle
        }
    }, 1000);

    const questionElem = document.getElementById('question');
    const optionsElem = document.getElementById('options');
    const currentQ = questions[currentQuestionIndex];
    
    questionElem.textContent = isEnglish ? currentQ.question : currentQ.questionTr;
    optionsElem.innerHTML = '';
    
    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = isEnglish ? currentQ.options[index] : currentQ.optionsTr[index];
        button.onclick = () => handleAnswer(index);
        optionsElem.appendChild(button);
    });
    
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    updateProgressBar();
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 5) {
        document.getElementById('timer').style.color = '#ff0000';
    } else {
        document.getElementById('timer').style.color = '#E31837';
    }
}

function handleAnswer(selectedIndex) {
    clearInterval(gameInterval);
    const currentQ = questions[currentQuestionIndex];
    const optionsButtons = document.getElementById('options').children;
    
    // Doğru cevabı göster
    optionsButtons[currentQ.correct].classList.add('correct');
    
    if (selectedIndex === currentQ.correct) {
        score++;
        document.getElementById('currentScore').textContent = score;
    } else if (selectedIndex !== -1) {
        optionsButtons[selectedIndex].classList.add('wrong');
    }
    
    // Bütün butonları devre dışı bırak
    Array.from(optionsButtons).forEach(button => {
        button.disabled = true;
    });
    
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function toggleLanguage() {
    isEnglish = !isEnglish;
    document.getElementById('languageBtn').textContent = isEnglish ? "Türkçe'ye Çevir" : "Switch to English";
    showQuestion();
}

function endGame() {
    clearInterval(gameInterval);
    
    // Skoru kaydet
    saveScore(score);
    
    // Ana menüye dön
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('categorySelection').style.display = 'block';
    
    // Sonucu göster
    alert(`Oyun bitti! Skorunuz: ${score}/${questions.length}`);
    
    // Değişkenleri sıfırla
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('currentScore').textContent = '0';
}

function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    const newScore = {
        category: currentCategory,
        score: score,
        date: new Date().toLocaleDateString()
    };
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10); // Sadece en yüksek 10 skoru sakla
    localStorage.setItem('scores', JSON.stringify(scores));
}

function showScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    const scoreList = document.getElementById('scoreList');
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    
    scoreList.innerHTML = '';
    scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span>#${index + 1} ${score.category}</span>
            <span>${score.score} points</span>
            <span>${score.date}</span>
        `;
        scoreList.appendChild(scoreItem);
    });
    
    scoreboard.style.display = 'block';
    document.getElementById('categorySelection').style.display = 'none';
}

function hideScoreboard() {
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('categorySelection').style.display = 'block';
}

// Sayfa yüklendiğinde yüksek skorları yükle
window.onload = () => {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    localStorage.setItem('scores', JSON.stringify(scores));
};