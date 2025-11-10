let questions = [];
let currentQuestion = 0;
let correctCount = 0;

// Load test JSON and select random questions
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
            // Shuffle and pick random 20 questions
            questions = getRandomQuestions(data, 20);
            showQuestion();
        })
        .catch(err => console.error("Error loading test:", err));
}

// Show current question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        goToResult();
        return;
    }

    const q = questions[currentQuestion];
    const qContainer = document.getElementById('question-container');
    const aContainer = document.getElementById('answers-container');

    qContainer.innerHTML = `<h2>${currentQuestion + 1}. ${q.question}</h2>`;
    aContainer.innerHTML = '';

    // Randomize options order
    const optionIndexes = shuffleArray(q.options.map((_, i) => i));

    optionIndexes.forEach(i => {
        const btn = document.createElement('button');
        btn.textContent = q.options[i];
        btn.dataset.answer = i;
        btn.addEventListener('click', selectAnswer);
        aContainer.appendChild(btn);
    });
}
document.getElementById('next-btn').addEventListener('click', function() {
  // Change the path below to your actual home page
  window.location.href = 'index.html';  
});

// Handle answer selection
function selectAnswer(e) {
    const selected = parseInt(e.target.dataset.answer);
    const q = questions[currentQuestion];

    if (selected === q.answer) correctCount++;

    currentQuestion++;
    showQuestion();
}

// Navigate to result page
function goToResult() {
    const total = questions.length;
    const percentage = (correctCount / total) * 100;
    let rank = '';

    if (percentage >= 90) rank = 'C2';
    else if (percentage >= 75) rank = 'C1';
    else if (percentage >= 60) rank = 'B2';
    else if (percentage >= 45) rank = 'B1';
    else if (percentage >= 30) rank = 'A2';
    else rank = 'A1';

    localStorage.setItem('rank', rank);
    window.location.href = 'result.html';
}

// Utility: shuffle array
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Utility: pick N random questions
function getRandomQuestions(arr, n) {
    const shuffled = shuffleArray([...arr]);
    return shuffled.slice(0, Math.min(n, shuffled.length));
}



// Start test when page loads
window.addEventListener('DOMContentLoaded', loadTest);
