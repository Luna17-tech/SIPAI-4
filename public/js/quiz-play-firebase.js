/* ========================================
   QUIZ PLAY - LOAD DARI FIREBASE
   Data dari: kuis-kelas4/{quizId}
======================================== */

let currentUser = null;
let currentQuiz = null;
let currentQuizId = '';
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = Date.now();
let timerInterval = null;
let timeRemaining = 900;
let isSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initNavigation === 'function') {
        initNavigation('kuis');
    }

    const urlParams = new URLSearchParams(window.location.search);
    currentQuizId = urlParams.get('quiz') || '';

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        currentUser = user;
        loadQuizFromFirebase(currentQuizId);
    });
});

async function loadQuizFromFirebase(quizId) {
    if (!quizId) {
        tampilkanError('ID kuis tidak ditemukan.');
        setTimeout(() => {
            window.location.href = 'kuis.html';
        }, 1500);
        return;
    }

    try {
        const snapshot = await firebase.database()
            .ref('kuis-kelas4/' + quizId)
            .once('value');

        const data = snapshot.val();

        if (!data) {
            tampilkanError('Kuis tidak ditemukan di Firebase.');
            setTimeout(() => {
                window.location.href = 'kuis.html';
            }, 1500);
            return;
        }

        const questions = Array.isArray(data.questions)
            ? data.questions
            : Object.values(data.questions || {});

        if (questions.length === 0) {
            tampilkanError('Kuis ini belum memiliki soal.');
            setTimeout(() => {
                window.location.href = 'kuis.html';
            }, 1500);
            return;
        }

        currentQuiz = {
            id: quizId,
            title: data.judul || 'Kuis PAI',
            icon: data.materiIkon || '🎯',
            materiId: data.materiId || '',
            materiJudul: data.materiJudul || '',
            deskripsi: data.deskripsi || '',
            questions: questions,
            timeLimit: data.timeLimit || 900
        };

        userAnswers = new Array(currentQuiz.questions.length).fill(null);
        currentQuestionIndex = 0;
        startTime = Date.now();
        timeRemaining = currentQuiz.timeLimit;

        document.getElementById('quizTitle').innerHTML =
            `${escapeHTML(currentQuiz.icon)} ${escapeHTML(currentQuiz.title)}`;

        document.getElementById('difficultyBadge').textContent =
            getDifficultyText(currentQuiz.questions.length);

        document.getElementById('totalQuestions').textContent =
            `${currentQuiz.questions.length} Soal`;

        startTimer();
        showQuestion(0);

        tampilkanSukses('Kuis dimulai! Semangat! 🚀');

    } catch (error) {
        console.error('Gagal memuat kuis:', error);
        tampilkanError('Gagal memuat kuis: ' + error.message);
    }
}

function showQuestion(index) {
    if (!currentQuiz || !currentQuiz.questions[index]) return;

    const question = currentQuiz.questions[index];
    currentQuestionIndex = index;

    const totalQuestions = currentQuiz.questions.length;
    const progress = ((index + 1) / totalQuestions) * 100;

    document.getElementById('quizProgress').style.width = progress + '%';
    document.getElementById('questionNumber').textContent =
        `Soal ${index + 1}/${totalQuestions}`;

    document.getElementById('questionText').textContent =
        question.soal || question.question || 'Soal belum tersedia';

    const options = question.pilihan || question.options || [];
    const optionsContainer = document.getElementById('optionsContainer');

    optionsContainer.innerHTML = '';

    options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
        btn.onclick = () => selectOption(i);

        if (userAnswers[index] === i) {
            btn.classList.add('selected');
        }

        optionsContainer.appendChild(btn);
    });

    const explanationBox = document.getElementById('explanationBox');
    if (explanationBox) {
        explanationBox.classList.remove('show');
    }

    document.getElementById('prevBtn').disabled = index === 0;

    document.getElementById('nextBtn').style.display =
        index === totalQuestions - 1 ? 'none' : 'inline-flex';

    document.getElementById('submitBtn').style.display =
        index === totalQuestions - 1 ? 'inline-flex' : 'none';

    document.getElementById('nextBtn').disabled =
        userAnswers[index] === null;

    document.getElementById('submitBtn').disabled =
        !isAllAnswered();
}

function selectOption(optionIndex) {
    if (isSubmitted) return;

    userAnswers[currentQuestionIndex] = optionIndex;

    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach((btn, i) => {
        btn.classList.remove('selected');

        if (i === optionIndex) {
            btn.classList.add('selected');
        }
    });

    document.getElementById('nextBtn').disabled = false;
    document.getElementById('submitBtn').disabled = !isAllAnswered();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

function isAllAnswered() {
    return userAnswers.every(answer => answer !== null);
}

function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 60) {
            document.getElementById('timer').classList.add('warning');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            tampilkanPeringatan('Waktu habis!');
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    document.getElementById('timeDisplay').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ========================================
// XP BERDASARKAN NILAI KUIS
// ========================================
async function awardQuizXP(userId, quizId, score) {

    if (!userId || !quizId) {
        return {
            xpAdded: 0,
            totalXP: 0
        };
    }

    const nilai = Number(score) || 0;

    let targetXP = 0;

    if (nilai >= 100) {
        targetXP = 40;
    } else if (nilai >= 90) {
        targetXP = 30;
    } else if (nilai >= 80) {
        targetXP = 20;
    } else if (nilai >= 70) {
        targetXP = 10;
    } else if (nilai >= 60) {
        targetXP = 5;
    }

    const safeQuizId = String(quizId)
        .replace(/[.#$\[\]\/]/g, '_');

    const xpRef =
        firebase.database().ref(
            'xp/' + userId
        );

    let xpSebelumnya = 0;

    const transaction =
        await xpRef.transaction(current => {

            const data =
                current &&
                typeof current === 'object'
                    ? current
                    : {};

            data.total =
                Number(data.total) || 0;

            if (
                !data.quizRewards ||
                typeof data.quizRewards !== 'object'
            ) {
                data.quizRewards = {};
            }

            const rewardLama =
                data.quizRewards[safeQuizId] || {};

            xpSebelumnya =
                Number(
                    rewardLama.xpAwarded
                ) || 0;

            const nilaiTerbaikLama =
                Number(
                    rewardLama.bestScore
                ) || 0;

            const tambahanXP =
                Math.max(
                    0,
                    targetXP - xpSebelumnya
                );

            if (tambahanXP > 0) {
                data.total += tambahanXP;
            }

            data.quizRewards[safeQuizId] = {

                bestScore:
                    Math.max(
                        nilaiTerbaikLama,
                        nilai
                    ),

                xpAwarded:
                    Math.max(
                        xpSebelumnya,
                        targetXP
                    ),

                updatedAt:
                    Date.now()

            };

            return data;
        });

    const hasil =
        transaction.snapshot.val() || {};

    const rewardBaru =
        hasil.quizRewards?.[safeQuizId] || {};

    const totalRewardSekarang =
        Number(
            rewardBaru.xpAwarded
        ) || 0;

    const xpAdded =
        Math.max(
            0,
            totalRewardSekarang -
            xpSebelumnya
        );

    return {

        xpAdded: xpAdded,

        totalXP:
            Number(hasil.total) || 0

    };
}


async function submitQuiz() {
    if (isSubmitted) return;

    if (!isAllAnswered()) {
        tampilkanPeringatan('Jawab semua soal terlebih dahulu.');
        return;
    }

    isSubmitted = true;
    clearInterval(timerInterval);

    let correct = 0;

    currentQuiz.questions.forEach((question, index) => {
        const correctAnswer = Number(
            question.jawaban !== undefined
                ? question.jawaban
                : question.correct
        );

        if (userAnswers[index] === correctAnswer) {
            correct++;
        }
    });

    const total = currentQuiz.questions.length;
    const wrong = total - correct;
    const score = Math.round((correct / total) * 100);
    const timeTaken = currentQuiz.timeLimit - timeRemaining;

    showResult(score, correct, wrong, timeTaken);

    try {
        await firebase.database()
            .ref('quiz-results/' + currentUser.uid)
            .push({
                quizId: currentQuiz.id,
                quizType: currentQuiz.title,
                materiId: currentQuiz.materiId,
                materiJudul: currentQuiz.materiJudul,
                score: score,
                correct: correct,
                total: total,
                timeTaken: timeTaken,
                answers: userAnswers,
                timestamp: Date.now()
            });

            // ========================================
            // BERIKAN XP BERDASARKAN NILAI
            // ========================================
            const xpReward =
                await awardQuizXP(
                    currentUser.uid,
                    currentQuiz.id,
                    score
                );

            console.log(
                '⭐ XP Kuis:',
                xpReward
            );

        if (xpReward.xpAdded > 0) {

            tampilkanSukses(
                `Hebat! Nilai ${score} 🎉 +${xpReward.xpAdded} XP`
            );

        } else if (score >= 80) {

            tampilkanSukses(
                `Hebat! Nilai kamu ${score}. XP terbaik untuk kuis ini sudah diperoleh.`
            );

        } else {

            tampilkanSukses(
                `Kuis selesai! Nilai: ${score}`
            );

        }

    } catch (error) {
        console.error('Gagal menyimpan hasil kuis:', error);
        tampilkanError('Gagal menyimpan hasil kuis: ' + error.message);
    }
}

function showResult(score, correct, wrong, timeTaken) {
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('resultCard').style.display = 'block';

    document.getElementById('resultScore').textContent = score;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;

    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    document.getElementById('timeTaken').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;

    let grade = '';

    if (score >= 90) grade = '🏆 Luar Biasa!';
    else if (score >= 80) grade = '🎉 Bagus Sekali!';
    else if (score >= 70) grade = '👍 Bagus!';
    else if (score >= 60) grade = '😊 Cukup Baik!';
    else grade = '💪 Terus Belajar!';

    document.getElementById('resultGrade').textContent = grade;

    window.scrollTo(0, 0);
}

function retakeQuiz() {
    location.reload();
}

function getDifficultyText(totalSoal) {
    if (totalSoal <= 5) return '⭐ Mudah';
    if (totalSoal <= 10) return '🔥 Sedang';
    return '💪 Sulit';
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function tampilkanError(message) {
    if (typeof showError === 'function') {
        showError(message);
    } else {
        alert(message);
    }
}

function tampilkanSukses(message) {
    if (typeof showSuccess === 'function') {
        showSuccess(message);
    } else {
        alert(message);
    }
}

function tampilkanPeringatan(message) {
    if (typeof showWarning === 'function') {
        showWarning(message);
    } else {
        alert(message);
    }
}