/* ========================================
   KUIS SYSTEM - INTERACTIVE QUIZ
   With Auto Feedback & Explanations
======================================== */

// Quiz Questions Database
const quizDatabase = {
    segitiga: {
        title: 'Kuis Segitiga',
        questions: [
            {
                id: 1,
                question: 'Berapa jumlah sisi yang dimiliki segitiga?',
                options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'],
                correct: 1,
                explanation: 'Segitiga memiliki 3 sisi. Nama "segitiga" berasal dari kata "tiga" yang berarti bangun ini memiliki 3 sisi dan 3 sudut.'
            },
            {
                id: 2,
                question: 'Segitiga yang ketiga sisinya sama panjang disebut...',
                options: ['Segitiga sembarang', 'Segitiga sama kaki', 'Segitiga sama sisi', 'Segitiga siku-siku'],
                correct: 2,
                explanation: 'Segitiga sama sisi adalah segitiga yang ketiga sisinya memiliki panjang yang sama.'
            },
            {
                id: 3,
                question: 'Rumus luas segitiga adalah...',
                options: ['sisi × sisi', '½ × alas × tinggi', '4 × sisi', 'π × r²'],
                correct: 1,
                explanation: 'Luas segitiga = ½ × alas × tinggi. Rumus ini berlaku untuk semua jenis segitiga.'
            },
            {
                id: 4,
                question: 'Jika segitiga memiliki alas 6 cm dan tinggi 4 cm, berapakah luasnya?',
                options: ['10 cm²', '12 cm²', '24 cm²', '6 cm²'],
                correct: 1,
                explanation: 'L = ½ × alas × tinggi = ½ × 6 × 4 = ½ × 24 = 12 cm²'
            },
            {
                id: 5,
                question: 'Segitiga yang memiliki satu sudut 90° disebut...',
                options: ['Segitiga lancip', 'Segitiga tumpul', 'Segitiga siku-siku', 'Segitiga sama sisi'],
                correct: 2,
                explanation: 'Segitiga siku-siku adalah segitiga yang memiliki satu sudut sebesar 90° (sudut siku-siku).'
            },
            {
                id: 6,
                question: 'Keliling segitiga dengan sisi 5 cm, 6 cm, dan 7 cm adalah...',
                options: ['15 cm', '16 cm', '17 cm', '18 cm'],
                correct: 3,
                explanation: 'Keliling = sisi A + sisi B + sisi C = 5 + 6 + 7 = 18 cm'
            },
            {
                id: 7,
                question: 'Segitiga yang memiliki dua sisi sama panjang disebut...',
                options: ['Segitiga sama sisi', 'Segitiga sama kaki', 'Segitiga sembarang', 'Segitiga tumpul'],
                correct: 1,
                explanation: 'Segitiga sama kaki adalah segitiga yang memiliki dua sisi dengan panjang yang sama.'
            },
            {
                id: 8,
                question: 'Berapa jumlah sudut dalam segitiga?',
                options: ['2 sudut', '3 sudut', '4 sudut', '5 sudut'],
                correct: 1,
                explanation: 'Segitiga memiliki 3 sudut. Jumlah ketiga sudut dalam segitiga selalu 180°.'
            },
            {
                id: 9,
                question: 'Jika luas segitiga 20 cm² dan alasnya 8 cm, berapakah tingginya?',
                options: ['3 cm', '4 cm', '5 cm', '6 cm'],
                correct: 2,
                explanation: 'L = ½ × alas × tinggi, maka tinggi = (L × 2) ÷ alas = (20 × 2) ÷ 8 = 40 ÷ 8 = 5 cm'
            },
            {
                id: 10,
                question: 'Manakah yang bukan jenis segitiga berdasarkan panjang sisinya?',
                options: ['Segitiga sama sisi', 'Segitiga sama kaki', 'Segitiga sembarang', 'Segitiga siku-siku'],
                correct: 3,
                explanation: 'Segitiga siku-siku adalah klasifikasi berdasarkan sudut, bukan panjang sisi. Berdasarkan panjang sisi: sama sisi, sama kaki, dan sembarang.'
            }
        ]
    },
    persegi: {
        title: 'Kuis Persegi',
        questions: [
            {
                id: 1,
                question: 'Berapa jumlah sisi persegi?',
                options: ['3 sisi', '4 sisi', '5 sisi', '6 sisi'],
                correct: 1,
                explanation: 'Persegi memiliki 4 sisi yang semuanya sama panjang.'
            },
            {
                id: 2,
                question: 'Rumus luas persegi adalah...',
                options: ['sisi × sisi', '4 × sisi', '½ × alas × tinggi', 'π × r²'],
                correct: 0,
                explanation: 'Luas persegi = sisi × sisi atau s². Semua sisi persegi memiliki panjang yang sama.'
            },
            {
                id: 3,
                question: 'Jika sisi persegi 8 cm, berapakah luasnya?',
                options: ['32 cm²', '48 cm²', '64 cm²', '72 cm²'],
                correct: 2,
                explanation: 'L = sisi × sisi = 8 × 8 = 64 cm²'
            },
            {
                id: 4,
                question: 'Rumus keliling persegi adalah...',
                options: ['sisi × sisi', '2 × sisi', '3 × sisi', '4 × sisi'],
                correct: 3,
                explanation: 'Keliling persegi = 4 × sisi, karena persegi memiliki 4 sisi yang sama panjang.'
            },
            {
                id: 5,
                question: 'Berapa derajat setiap sudut persegi?',
                options: ['45°', '60°', '90°', '120°'],
                correct: 2,
                explanation: 'Setiap sudut persegi adalah 90° (sudut siku-siku). Persegi memiliki 4 sudut siku-siku.'
            },
            {
                id: 6,
                question: 'Jika keliling persegi 36 cm, berapakah panjang sisinya?',
                options: ['6 cm', '8 cm', '9 cm', '12 cm'],
                correct: 2,
                explanation: 'Keliling = 4 × sisi, maka sisi = Keliling ÷ 4 = 36 ÷ 4 = 9 cm'
            },
            {
                id: 7,
                question: 'Berapa jumlah diagonal persegi?',
                options: ['1', '2', '3', '4'],
                correct: 1,
                explanation: 'Persegi memiliki 2 diagonal yang berpotongan di tengah dengan panjang yang sama.'
            },
            {
                id: 8,
                question: 'Jika luas persegi 144 cm², berapakah panjang sisinya?',
                options: ['10 cm', '11 cm', '12 cm', '13 cm'],
                correct: 2,
                explanation: 'L = sisi × sisi, maka sisi = √L = √144 = 12 cm'
            },
            {
                id: 9,
                question: 'Sifat persegi yang benar adalah...',
                options: ['Memiliki 3 sudut', 'Semua sisi berbeda panjang', 'Memiliki 4 sudut siku-siku', 'Tidak memiliki diagonal'],
                correct: 2,
                explanation: 'Persegi memiliki 4 sudut siku-siku (90°), 4 sisi sama panjang, dan 2 diagonal sama panjang.'
            },
            {
                id: 10,
                question: 'Sebuah lapangan berbentuk persegi dengan sisi 25 m. Berapa kelilingnya?',
                options: ['75 m', '100 m', '125 m', '150 m'],
                correct: 1,
                explanation: 'Keliling = 4 × sisi = 4 × 25 = 100 m'
            }
        ]
    },
    lingkaran: {
        title: 'Kuis Lingkaran',
        questions: [
            {
                id: 1,
                question: 'Jarak dari pusat lingkaran ke tepi disebut...',
                options: ['Diameter', 'Jari-jari', 'Keliling', 'Busur'],
                correct: 1,
                explanation: 'Jari-jari (radius) adalah jarak dari pusat lingkaran ke tepi lingkaran.'
            },
            {
                id: 2,
                question: 'Nilai π (pi) yang sering digunakan adalah...',
                options: ['2,14', '3,14', '4,14', '5,14'],
                correct: 1,
                explanation: 'Nilai π (pi) yang sering digunakan adalah 3,14 atau 22/7.'
            },
            {
                id: 3,
                question: 'Rumus keliling lingkaran adalah...',
                options: ['π × r', '2 × π × r', 'π × r²', '4 × π × r'],
                correct: 1,
                explanation: 'Keliling lingkaran = 2 × π × r atau π × d (diameter).'
            },
            {
                id: 4,
                question: 'Jika jari-jari lingkaran 7 cm, berapakah diameternya?',
                options: ['7 cm', '14 cm', '21 cm', '28 cm'],
                correct: 1,
                explanation: 'Diameter = 2 × jari-jari = 2 × 7 = 14 cm'
            },
            {
                id: 5,
                question: 'Rumus luas lingkaran adalah...',
                options: ['π × r', '2 × π × r', 'π × r²', '4 × π × r'],
                correct: 2,
                explanation: 'Luas lingkaran = π × r² (π dikali jari-jari kuadrat).'
            },
            {
                id: 6,
                question: 'Jika jari-jari 7 cm, berapakah keliling lingkaran? (π = 22/7)',
                options: ['22 cm', '44 cm', '66 cm', '88 cm'],
                correct: 1,
                explanation: 'K = 2 × π × r = 2 × (22/7) × 7 = 2 × 22 = 44 cm'
            },
            {
                id: 7,
                question: 'Garis yang menghubungkan dua titik pada tepi lingkaran melalui pusat disebut...',
                options: ['Jari-jari', 'Diameter', 'Busur', 'Tali busur'],
                correct: 1,
                explanation: 'Diameter adalah garis yang menghubungkan dua titik di tepi lingkaran dan melalui pusat.'
            },
            {
                id: 8,
                question: 'Jika diameter lingkaran 20 cm, berapakah jari-jarinya?',
                options: ['5 cm', '10 cm', '15 cm', '20 cm'],
                correct: 1,
                explanation: 'Jari-jari = diameter ÷ 2 = 20 ÷ 2 = 10 cm'
            },
            {
                id: 9,
                question: 'Jika jari-jari 14 cm, berapakah luas lingkaran? (π = 22/7)',
                options: ['308 cm²', '440 cm²', '616 cm²', '880 cm²'],
                correct: 2,
                explanation: 'L = π × r² = (22/7) × 14 × 14 = (22/7) × 196 = 22 × 28 = 616 cm²'
            },
            {
                id: 10,
                question: 'Berapa derajat satu putaran penuh lingkaran?',
                options: ['90°', '180°', '270°', '360°'],
                correct: 3,
                explanation: 'Satu putaran penuh lingkaran adalah 360°.'
            }
        ]
    },
    kubus: {
        title: 'Kuis Kubus',
        questions: [
            {
                id: 1,
                question: 'Berapa jumlah sisi kubus?',
                options: ['4 sisi', '6 sisi', '8 sisi', '12 sisi'],
                correct: 1,
                explanation: 'Kubus memiliki 6 sisi yang berbentuk persegi dan sama besar.'
            },
            {
                id: 2,
                question: 'Rumus volume kubus adalah...',
                options: ['sisi × sisi', 'sisi × sisi × sisi', '6 × sisi × sisi', '4 × sisi'],
                correct: 1,
                explanation: 'Volume kubus = sisi × sisi × sisi = s³'
            },
            {
                id: 3,
                question: 'Jika rusuk kubus 5 cm, berapakah volumenya?',
                options: ['25 cm³', '75 cm³', '125 cm³', '150 cm³'],
                correct: 2,
                explanation: 'V = s × s × s = 5 × 5 × 5 = 125 cm³'
            },
            {
                id: 4,
                question: 'Berapa jumlah rusuk kubus?',
                options: ['8', '10', '12', '14'],
                correct: 2,
                explanation: 'Kubus memiliki 12 rusuk yang semuanya sama panjang.'
            },
            {
                id: 5,
                question: 'Rumus luas permukaan kubus adalah...',
                options: ['sisi × sisi', '4 × sisi × sisi', '6 × sisi × sisi', '8 × sisi × sisi'],
                correct: 2,
                explanation: 'Luas permukaan kubus = 6 × sisi × sisi, karena kubus memiliki 6 sisi persegi.'
            },
            {
                id: 6,
                question: 'Berapa jumlah titik sudut kubus?',
                options: ['4', '6', '8', '12'],
                correct: 2,
                explanation: 'Kubus memiliki 8 titik sudut.'
            },
            {
                id: 7,
                question: 'Jika rusuk kubus 4 cm, berapakah luas permukaannya?',
                options: ['64 cm²', '84 cm²', '96 cm²', '120 cm²'],
                correct: 2,
                explanation: 'Luas permukaan = 6 × s × s = 6 × 4 × 4 = 6 × 16 = 96 cm²'
            },
            {
                id: 8,
                question: 'Bentuk setiap sisi kubus adalah...',
                options: ['Segitiga', 'Persegi', 'Persegi panjang', 'Lingkaran'],
                correct: 1,
                explanation: 'Setiap sisi kubus berbentuk persegi yang sama besar.'
            },
            {
                id: 9,
                question: 'Jika volume kubus 216 cm³, berapakah panjang rusuknya?',
                options: ['4 cm', '5 cm', '6 cm', '7 cm'],
                correct: 2,
                explanation: 'V = s³, maka s = ∛V = ∛216 = 6 cm'
            },
            {
                id: 10,
                question: 'Benda berikut yang berbentuk kubus adalah...',
                options: ['Bola', 'Dadu', 'Kaleng', 'Kerucut'],
                correct: 1,
                explanation: 'Dadu adalah contoh benda yang berbentuk kubus.'
            }
        ]
    }
};

// Quiz State
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;
let timerInterval = null;

// Start Quiz
function startQuiz(quizId) {
    if (!quizId) {
        showError('ID kuis tidak valid!');
        return;
    }
    
    currentQuiz = quizDatabase[quizId];
    if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        showError('Kuis belum tersedia atau data kuis tidak valid!');
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    startTime = Date.now();
    
    // Hide selection, show quiz container
    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    
    // Set title
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // Start timer (15 minutes)
    startTimer(15 * 60);
    
    // Show first question
    showQuestion(0);
}

// Show Question
function showQuestion(index) {
    const question = currentQuiz.questions[index];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-card slide-up">
            <h3 class="question-number">Soal ${index + 1}</h3>
            <p class="question-text">${question.question}</p>
            <div class="options-list">
                ${question.options.map((option, i) => `
                    <div class="option-item" onclick="selectAnswer(${i})">
                        <input type="radio" name="answer" id="option${i}" value="${i}">
                        <label for="option${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="feedback-${index}" class="feedback-container"></div>
        </div>
    `;
    
    // Update progress
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('quizProgressBar').style.width = `${((index + 1) / currentQuiz.questions.length) * 100}%`;
    
    // Update buttons
    document.getElementById('prevBtn').disabled = index === 0;
    
    if (index === currentQuiz.questions.length - 1) {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'inline-block';
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').style.display = 'none';
    }
    
    // Restore previous answer if exists
    if (userAnswers[index] !== undefined) {
        const radio = document.querySelector(`input[value="${userAnswers[index]}"]`);
        if (radio) radio.checked = true;
    }
}

// Select Answer
function selectAnswer(optionIndex) {
    const question = currentQuiz.questions[currentQuestionIndex];
    const feedbackContainer = document.getElementById(`feedback-${currentQuestionIndex}`);
    
    // Save answer
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Show feedback immediately
    const isCorrect = optionIndex === question.correct;
    
    feedbackContainer.innerHTML = `
        <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="feedback-header">
                <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
                <span class="feedback-text">${isCorrect ? 'BENAR!' : 'SALAH!'}</span>
            </div>
            <div class="feedback-explanation">
                <strong>Penjelasan:</strong><br>
                ${question.explanation}
            </div>
        </div>
    `;
}

// Navigation
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// Timer
function startTimer(seconds) {
    let timeLeft = seconds;
    
    updateTimerDisplay(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    document.getElementById('timer').textContent = formatTime(seconds);
}

// Submit Quiz
async function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    let correctCount = 0;
    currentQuiz.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) correctCount++;
    });
    
    const score = Math.round((correctCount / currentQuiz.questions.length) * 100);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Save to Firebase
    const userId = getCurrentUserId();
    if (userId) {
        await saveQuizResult(userId, {
            quizId: Object.keys(quizDatabase).find(key => quizDatabase[key] === currentQuiz),
            score: score,
            correctCount: correctCount,
            totalQuestions: currentQuiz.questions.length,
            timeSpent: timeSpent,
            answers: userAnswers
        });
    }
    
    // Show result
    showResult(score, correctCount, currentQuiz.questions.length - correctCount, timeSpent);
}

// Show Result
function showResult(score, correct, wrong, timeSpent) {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    // Set result data
    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;
    
    document.getElementById('timeSpent').textContent = formatTime(timeSpent);
    
    // Result message based on score
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (score >= 80) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = 'Luar Biasa!';
        resultMessage.innerHTML = '<p>Kamu hebat! Pertahankan terus ya! 🌟</p>';
    } else if (score >= 60) {
        resultIcon.textContent = '👍';
        resultTitle.textContent = 'Bagus!';
        resultMessage.innerHTML = '<p>Hasil yang baik! Terus belajar ya! 💪</p>';
    } else {
        resultIcon.textContent = '📚';
        resultTitle.textContent = 'Tetap Semangat!';
        resultMessage.innerHTML = '<p>Jangan menyerah! Coba belajar lagi dan ulangi kuis ini. 💪</p>';
    }
}

// Review Answers
function reviewAnswers() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('reviewContainer').style.display = 'block';
    
    const reviewContent = document.getElementById('reviewContent');
    
    reviewContent.innerHTML = currentQuiz.questions.map((q, i) => {
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === q.correct;
        
        return `
            <div class="review-item ${isCorrect ? 'correct-answer' : 'wrong-answer'}">
                <h4>Soal ${i + 1}: ${q.question}</h4>
                <p><strong>Jawabanmu:</strong> ${userAnswer !== undefined ? q.options[userAnswer] : 'Tidak dijawab'} 
                   ${isCorrect ? '✅' : '❌'}</p>
                ${!isCorrect ? `<p><strong>Jawaban Benar:</strong> ${q.options[q.correct]} ✓</p>` : ''}
                <div class="explanation-box">
                    <strong>Penjelasan:</strong><br>
                    ${q.explanation}
                </div>
            </div>
        `;
    }).join('');
}

// Back to Quiz List
function backToQuizList() {
    location.reload();
}

// Load Best Scores on page load
async function loadBestScores() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        const snapshot = await quizzesRef.child(userId).once('value');
        const quizzes = snapshot.val() || {};
        
        // Calculate best score for each quiz type
        const bestScores = {};
        Object.values(quizzes).forEach(quiz => {
            const quizId = quiz.quizId;
            if (!bestScores[quizId] || quiz.score > bestScores[quizId]) {
                bestScores[quizId] = quiz.score;
            }
        });
        
        // Update UI
        Object.keys(bestScores).forEach(quizId => {
            const scoreEl = document.querySelector(`#score-${quizId} .score-value`);
            if (scoreEl) {
                scoreEl.textContent = bestScores[quizId];
            }
        });
    } catch (error) {
        console.error('Error loading best scores:', error);
    }
}

// Initialize on page load
if (window.location.pathname.includes('kuis.html')) {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadBestScores();
        }
    });
}

// Kuis module initialized