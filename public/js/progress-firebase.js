console.log('📊 Progress Firebase page loaded!');

document.addEventListener('DOMContentLoaded', () => {
    initNavigation('progress');
});

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadProgressData(user.uid);
});

async function loadProgressData(userId) {
    try {
        const materiSnapshot = await firebase.database().ref('materi-kelas4').once('value');
        const progressSnapshot = await firebase.database().ref('progress/' + userId + '/materi').once('value');
        const quizSnapshot = await firebase.database().ref('quiz-results/' + userId).once('value');

        const materiData = materiSnapshot.val() || {};
        const progressData = progressSnapshot.val() || {};
        const quizData = quizSnapshot.val() || {};

        displayOverallProgress(materiData, progressData);
        displayTopicProgress(materiData, progressData);
        loadStatistics(materiData, progressData, quizData);
        loadActivityTimeline(materiData, progressData, quizData);

    } catch (error) {
        console.error('❌ Error loading progress:', error);
        showError('Gagal memuat progress: ' + error.message);
    }
}

function displayOverallProgress(materiData, progressData) {
    const materiEntries = Object.entries(materiData);
    const totalMateri = materiEntries.length;

    const completedMateri = materiEntries.filter(([id]) => {
        return progressData[id]?.completed === true;
    }).length;

    const percentage = totalMateri > 0
        ? Math.round((completedMateri / totalMateri) * 100)
        : 0;

    const degrees = (percentage / 100) * 360;

    document.getElementById('progressCircle').style.setProperty('--progress-deg', degrees + 'deg');
    document.getElementById('overallPercentage').textContent = percentage + '%';
    document.getElementById('completedCount').textContent = completedMateri;
    document.getElementById('percentText').textContent = percentage + '%';

    const totalMateriCount = document.getElementById('totalMateriCount');
    if (totalMateriCount) {
        totalMateriCount.textContent = totalMateri;
    }
}

function displayTopicProgress(materiData, progressData) {
    const grid = document.getElementById('topicProgressGrid');
    if (!grid) return;

    const materiEntries = Object.entries(materiData);

    if (materiEntries.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
                <div style="font-size:80px; margin-bottom:20px;">📚</div>
                <h3 style="font-family:'Fredoka',sans-serif; font-size:28px; margin-bottom:12px; color:#2d3748;">
                    Belum Ada Materi
                </h3>
                <p style="color:#718096;">Materi belum ditambahkan oleh guru.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';

    materiEntries.forEach(([id, materi]) => {
        const progress = progressData[id] || {};
        const isCompleted = progress.completed === true;

        const completedDate = progress.completedAt
            ? new Date(progress.completedAt).toLocaleDateString('id-ID')
            : '-';

        const card = document.createElement('div');
        card.className = 'topic-progress-card' + (isCompleted ? ' completed' : '');

        card.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
                <div style="font-size:48px;">${escapeHTML(materi.ikon || '📚')}</div>

                <div style="flex:1;">
                    <h3 style="font-family:'Fredoka',sans-serif; font-size:24px; margin-bottom:4px; color:#2d3748;">
                        ${escapeHTML(materi.judul || 'Tanpa Judul')}
                    </h3>

                    <p style="color:#718096; font-size:14px;">
                        ${isCompleted ? '✅ Selesai' : '⏳ Belum Selesai'}
                    </p>
                </div>
            </div>

            <div class="progress-bar-modern" style="margin-bottom:12px;">
                <div class="progress-fill" style="width:${isCompleted ? '100' : '0'}%;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:14px; color:#718096;">
                <span>${isCompleted ? '100' : '0'}% Complete</span>
                <span>${completedDate}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

function loadStatistics(materiData, progressData, quizData) {
    const materiEntries = Object.entries(materiData);

    const materiCount = materiEntries.filter(([id]) => {
        return progressData[id]?.completed === true;
    }).length;

    const quizResults = Object.values(quizData);
    const quizCount = quizResults.length;

    const avgScore = quizCount > 0
        ? Math.round(quizResults.reduce((sum, r) => sum + (r.score || 0), 0) / quizCount)
        : 0;

    document.getElementById('materiCount').textContent = materiCount;
    document.getElementById('quizCount').textContent = quizCount;
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('badgeCount').textContent = materiCount;
}

function loadActivityTimeline(materiData, progressData, quizData) {
    const timeline = document.getElementById('activityTimeline');
    const activities = [];

    Object.entries(progressData).forEach(([id, data]) => {
        if (data.completed) {
            const title = data.title || materiData[id]?.judul || id;

            activities.push({
                icon: '📚',
                title: `Menyelesaikan Materi ${title}`,
                timestamp: data.completedAt || Date.now(),
                color: 'var(--gradient-success)'
            });
        }
    });

    Object.values(quizData).forEach(result => {
        activities.push({
            icon: '🎯',
            title: `Menyelesaikan Kuis ${result.quizType || result.quizId || 'Kuis'}`,
            detail: `Skor: ${result.score || 0}/100 (${result.correct || 0}/${result.total || 0} benar)`,
            timestamp: result.timestamp || Date.now(),
            color: (result.score || 0) >= 80 ? 'var(--gradient-success)' : 'var(--gradient-warning)'
        });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);

    if (activities.length === 0) {
        timeline.innerHTML = `
            <p style="color:#718096; text-align:center; padding:40px;">
                Belum ada aktivitas. Mulai belajar sekarang!
            </p>
        `;
        return;
    }

    timeline.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        item.innerHTML = `
            <div class="timeline-icon" style="background:${activity.color};">
                ${activity.icon}
            </div>

            <div class="timeline-content">
                <h4 style="font-weight:600; color:#2d3748; margin-bottom:8px;">
                    ${escapeHTML(activity.title)}
                </h4>

                ${activity.detail ? `<p style="color:#718096; margin-bottom:8px;">${escapeHTML(activity.detail)}</p>` : ''}

                <p style="color:#a0aec0; font-size:14px;">
                    ${getTimeAgo(activity.timestamp)}
                </p>
            </div>
        `;

        timeline.appendChild(item);
    });
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' menit yang lalu';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' jam yang lalu';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' hari yang lalu';

    return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}