// test.js

let questions = [];
let currentQuestion = 0;
let score = 0;

// Load the JSON based on URL param ?test=english or ?test=japanese etc.
function loadTest() {
    const urlParams = new URLSearchParams(window.location.search);
    const testName = urlParams.get('test') || 'english';

    // ✅ FIXED: removed leading slash
    const path = `data/${testName}.json`; 
    console.log(`Attempting to load test file: ${path}`);

    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`File not found: ${path}`);
            }
            return response.json();
        })
        .then(data => {
            questions = data;
            console.log(`Loaded ${questions.length} questions for test "${testName}"`);
            showQuestion();
        })
        .catch(err => console.error("Error loading test:", err));
}

// Display current question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        // Save score and go to result page
        localStorage.setItem('score', score);
        localStorage.setItem('total', questions.length);
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

// Handle answer selection
function selectAnswer(e) {
    const selected = e.target.dataset.answer;
    const q = questions[currentQuestion];

    // Score using mapping (0,1,3)
    score += q.scores[selected] || 0;

    currentQuestion++;
    showQuestion();
}

// Optional: "Next" button (if you have one)
const nextBtn = document.getElementById('next-btn');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        showQuestion();
    });
}

// Start test
window.addEventListener('DOMContentLoaded', loadTest);
