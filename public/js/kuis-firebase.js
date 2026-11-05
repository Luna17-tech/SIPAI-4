/* ========================================
   KUIS SISWA - LOAD DARI FIREBASE
   Data dari: kuis-kelas4
======================================== */

console.log('🎯 Kuis Firebase page loaded!');

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initNavigation === 'function') {
        initNavigation('kuis');
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadQuizStats(user.uid);
    loadQuizListFirebase();
});

// Load statistik kuis siswa
async function loadQuizStats(userId) {
    try {
        const quizMasterSnapshot = await firebase.database()
            .ref('kuis-kelas4')
            .once('value');

        const resultSnapshot = await firebase.database()
            .ref('quiz-results/' + userId)
            .once('value');

        const quizMaster = quizMasterSnapshot.val() || {};
        const results = resultSnapshot.val() || {};

        const validQuizIds = Object.keys(quizMaster);

        const resultsArray = Object.values(results).filter(result => {
            return result.quizId && validQuizIds.includes(result.quizId);
        });

        if (resultsArray.length === 0) {
            document.getElementById('avgScore').textContent = 0;
            document.getElementById('quizCompleted').textContent = 0;
            document.getElementById('correctAnswers').textContent = 0;
            document.getElementById('totalQuestions').textContent = 0;
            return;
        }

        const totalQuizzes = resultsArray.length;
        const totalCorrect = resultsArray.reduce((sum, r) => sum + (r.correct || 0), 0);
        const totalQuestions = resultsArray.reduce((sum, r) => sum + (r.total || 0), 0);

        const avgScore = Math.round(
            resultsArray.reduce((sum, r) => sum + (r.score || 0), 0) / totalQuizzes
        );

        document.getElementById('avgScore').textContent = avgScore;
        document.getElementById('quizCompleted').textContent = totalQuizzes;
        document.getElementById('correctAnswers').textContent = totalCorrect;
        document.getElementById('totalQuestions').textContent = totalQuestions;

    } catch (error) {
        console.error('Gagal memuat statistik kuis:', error);
    }
}

// Load daftar kuis dari Firebase
async function loadQuizListFirebase() {
    const container = document.getElementById('quizList');
    if (!container) return;

    container.innerHTML = `
        <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:40px;">
            <p style="color:#718096;">Memuat kuis dari Firebase...</p>
        </div>
    `;

    try {
        const snapshot = await firebase.database()
            .ref('kuis-kelas4')
            .once('value');

        const kuisData = snapshot.val() || {};
        const kuisEntries = Object.entries(kuisData);

        if (kuisEntries.length === 0) {
            container.innerHTML = `
                <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:50px;">
                    <div style="font-size:70px; margin-bottom:20px;">🎯</div>
                    <h3 style="font-family:'Fredoka',sans-serif; color:#2d3748; margin-bottom:8px;">
                        Belum Ada Kuis
                    </h3>
                    <p style="color:#718096;">
                        Kuis belum ditambahkan oleh guru.
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = kuisEntries.map(([id, kuis], index) => {
            const buttonClass = getButtonClass(index);
            const difficultyClass = getDifficultyClass(kuis.totalSoal || 0);
            const difficultyText = getDifficultyText(kuis.totalSoal || 0);

            return `
                <div class="modern-card quiz-card">
                    <div style="display:flex; align-items:center; gap:20px; margin-bottom:20px;">
                        <div style="font-size:60px;">
                            ${escapeHTML(kuis.materiIkon || '🎯')}
                        </div>

                        <div>
                            <h3 style="font-family:'Fredoka',sans-serif; color:#2d3748; margin-bottom:8px;">
                                ${escapeHTML(kuis.judul || 'Tanpa Judul')}
                            </h3>

                            <span class="difficulty-badge ${difficultyClass}">
                                ${difficultyText}
                            </span>
                        </div>
                    </div>

                    <p style="color:#718096; margin-bottom:18px;">
                        ${escapeHTML(kuis.deskripsi || 'Kuis untuk menguji pemahaman materi.')}
                    </p>

                    <p style="color:#718096; font-size:14px; margin-bottom:18px;">
                        Materi: ${escapeHTML(kuis.materiJudul || '-')}
                    </p>

                    <p style="font-weight:600; color:#2d3748; margin-bottom:18px;">
                        ${kuis.totalSoal || 0} soal
                    </p>

                    <a href="quiz-play.html?quiz=${id}" class="btn-modern ${buttonClass}">
                        Mulai →
                    </a>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Gagal memuat daftar kuis:', error);

        container.innerHTML = `
            <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:40px;">
                <h3 style="color:#e53e3e;">Gagal memuat kuis</h3>
                <p style="color:#718096;">${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

function getButtonClass(index) {
    const classes = [
        'btn-primary',
        'btn-success',
        'btn-info',
        'btn-warning'
    ];

    return classes[index % classes.length];
}

function getDifficultyClass(totalSoal) {
    if (totalSoal <= 5) return 'difficulty-easy';
    if (totalSoal <= 10) return 'difficulty-medium';
    return 'difficulty-hard';
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