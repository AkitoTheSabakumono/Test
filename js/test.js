let questions = [];
let currentQuestion = 0;
let correctCount = 0; // count of correct answers for rank

function loadTest() {
    const urlParams = new URLSearchParams(window.location.search);
    const testName = urlParams.get('test') || 'english';
    const path = `data/${testName}.json`;

    fetch(path)
        .then(response => {
            if (!response.ok) throw new Error(`File not found: ${path}`);
            return response.json();
        })
        .then(data => {
            // Shuffle and pick up to 20 questions
            questions = shuffleArray(data).slice(0, 20);
            showQuestion();
        })
        .catch(err => console.error("Error loading test:", err));
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        // save result as rank
        const percentage = (correctCount / questions.length) * 100;
        let rank = '';
        if(percentage >= 90) rank = 'C2';
        else if(percentage >= 75) rank = 'C1';
        else if(percentage >= 60) rank = 'B2';
        else if(percentage >= 45) rank = 'B1';
        else if(percentage >= 30) rank = 'A2';
        else rank = 'A1';

        localStorage.setItem('rank', rank);
        window.location.href = 'result.html';
        return;
    }

    const q = questions[currentQuestion];
    const qContainer = document.getElementById('question-container');
    const aContainer = document.getElementById('answers-container');

    qContainer.innerHTML = `<h2>${currentQuestion + 1}. ${q.question}</h2>`;
    aContainer.innerHTML = '';

    for (let key in q.answers) {
        const btn = document.createElement('button');
        btn.textContent = q.answers[key];
        btn.dataset.answer = key;
        btn.addEventListener('click', selectAnswer);
        aContainer.appendChild(btn);
    }
}

function selectAnswer(e) {
    const selected = e.target.dataset.answer;
    const q = questions[currentQuestion];

    if(q.correct === selected) correctCount++; // assuming JSON has `correct` key
    currentQuestion++;
    showQuestion();
}

// Shuffle helper
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

window.addEventListener('DOMContentLoaded', loadTest);
