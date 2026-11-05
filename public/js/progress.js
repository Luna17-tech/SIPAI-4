/* ========================================
   PROGRESS TRACKING SYSTEM
   Real-time Progress Monitoring
======================================== */

// Load Overall Progress
async function loadOverallProgress() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        // Get materials progress
        const materialSnapshot = await progressRef.child(userId).once('value');
        const materialProgress = materialSnapshot.val() || {};
        
        // Get quiz results
        const quizSnapshot = await quizzesRef.child(userId).once('value');
        const quizResults = quizSnapshot.val() || {};
        
        // Calculate statistics
        const totalMaterials = Object.keys(materiData || {}).length || 10;
        const completedMaterials = Object.values(materialProgress).filter(m => m.progress === 100).length;
        
        const quizArray = Object.values(quizResults);
        const totalQuizzes = quizArray.length;
        const avgScore = totalQuizzes > 0 
            ? Math.round(quizArray.reduce((sum, q) => sum + q.score, 0) / totalQuizzes)
            : 0;
        
        // Calculate overall percentage
        const materialPercentage = (completedMaterials / totalMaterials) * 50;
        const quizPercentage = (avgScore / 100) * 50;
        const overallPercentage = Math.round(materialPercentage + quizPercentage);
        
        // Update UI
        updateOverallProgressUI(overallPercentage, completedMaterials, totalQuizzes, avgScore);
        
        // Load detailed progress
        loadMaterialProgressList(materialProgress);
        loadQuizHistory(quizResults);
        loadAchievements(completedMaterials, totalQuizzes, avgScore);
        loadStudyCalendar(userId);
        
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Update Overall Progress UI
function updateOverallProgressUI(percentage, completedMaterials, totalQuizzes, avgScore) {
    // Update percentage circle
    const circle = document.getElementById('overallProgressCircle');
    if (circle) {
        const radius = 90;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    const percentageEl = document.getElementById('overallPercentage');
    if (percentageEl) percentageEl.textContent = `${percentage}%`;
    
    // Update stats
    const completedEl = document.getElementById('completedMaterials');
    if (completedEl) completedEl.textContent = completedMaterials;
    
    const quizzesEl = document.getElementById('totalQuizzes');
    if (quizzesEl) quizzesEl.textContent = totalQuizzes;
    
    const scoreEl = document.getElementById('averageScore');
    if (scoreEl) scoreEl.textContent = avgScore;
    
    // Update streak (simplified - just show total days active)
    const streakEl = document.getElementById('studyStreak');
    if (streakEl) streakEl.textContent = Math.min(completedMaterials + totalQuizzes, 30);
}

// Load Material Progress List
function loadMaterialProgressList(progressData) {
    const container = document.getElementById('materialProgressList');
    if (!container) return;
    
    const materials = [
        { id: 'bab1', name: 'Keragaman', icon: '📖' },
        { id: 'bab2', name: 'Asmaul Husna', icon: '✨' },
        { id: 'bab3', name: 'Indahnya Saling Menghargai', icon: '🤝' },
        { id: 'bab4', name: 'Menyambut Usia Balig', icon: '🌱' },
        { id: 'bab5', name: 'Kisah Hijrah Nabi Muhammad SAW', icon: '🕌' },
        { id: 'bab6', name: 'Q.S. At-Tin dan Silaturahmi', icon: '📜' },
        { id: 'bab7', name: 'Beriman kepada Rasul-Rasul Allah', icon: '🕋' },
        { id: 'bab8', name: 'Aku Anak Saleh', icon: '😊' },
        { id: 'bab9', name: 'Salat Jumat, Duha, dan Tahajud', icon: '🙏' },
        { id: 'bab10', name: 'Nabi Muhammad Membangun Madinah', icon: '🌆' }
    ];
    
    container.innerHTML = materials.map(material => {
        const progress = progressData[material.id]?.progress || 0;
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending';
        const statusText = progress === 100 ? 'Selesai' : progress > 0 ? 'Sedang dipelajari' : 'Belum dimulai';
        
        return `
            <div class="material-progress-item">
                <div class="material-info">
                    <span class="material-icon">${material.icon}</span>
                    <span class="material-name">${material.name}</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}%</span>
                </div>
                <span class="material-status ${status}">${statusText}</span>
            </div>
        `;
    }).join('');
}

// Load Quiz History
function loadQuizHistory(quizResults) {
    const container = document.getElementById('quizHistory');
    if (!container) return;
    
    const quizArray = Object.entries(quizResults).map(([id, data]) => ({
        id,
        ...data
    })).sort((a, b) => b.timestamp - a.timestamp);
    
    if (quizArray.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Belum ada kuis yang dikerjakan</p>
                <a href="kuis.html" class="btn btn-primary">Mulai Kuis Pertama</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = quizArray.map(quiz => {
        const date = new Date(quiz.timestamp);
        const scoreClass = getScoreClassification(quiz.score);
        
        return `
            <div class="quiz-history-item">
                <div class="quiz-info">
                    <h4>${quiz.quizId ? quiz.quizId.charAt(0).toUpperCase() + quiz.quizId.slice(1) : 'Quiz'}</h4>
                    <p class="quiz-date">${formatDate(date, { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                </div>
                <div class="quiz-score ${scoreClass.class}">
                    <span class="score-number">${quiz.score}</span>
                    <span class="score-label">/ 100</span>
                </div>
                <div class="quiz-details">
                    <span>✓ ${quiz.correctCount} benar</span>
                    <span>✗ ${quiz.totalQuestions - quiz.correctCount} salah</span>
                </div>
            </div>
        `;
    }).join('');
}

// Load Achievements
function loadAchievements(completedMaterials, totalQuizzes, avgScore) {
    const achievements = [
        {
            id: 'beginner',
            icon: '🥉',
            title: 'Pemula',
            description: 'Selesaikan 1 materi',
            target: 1,
            current: completedMaterials,
            unlocked: completedMaterials >= 1
        },
        {
            id: 'diligent',
            icon: '🥈',
            title: 'Pelajar Rajin',
            description: 'Selesaikan 5 materi',
            target: 5,
            current: completedMaterials,
            unlocked: completedMaterials >= 5
        },
        {
            id: 'master',
            icon: '🥇',
            title: 'Master PAI',
            description: 'Selesaikan semua materi',
            target: 10,
            current: completedMaterials,
            unlocked: completedMaterials >= 10
        },
        {
            id: 'quiz-star',
            icon: '⭐',
            title: 'Bintang Kuis',
            description: 'Dapatkan skor 100 di kuis',
            target: 100,
            current: avgScore,
            unlocked: avgScore >= 100
        },
        {
            id: 'streak',
            icon: '🔥',
            title: 'Streak Master',
            description: 'Belajar 7 hari berturut-turut',
            target: 7,
            current: Math.min(completedMaterials + totalQuizzes, 7),
            unlocked: (completedMaterials + totalQuizzes) >= 7
        },
        {
            id: 'perfectionist',
            icon: '💯',
            title: 'Perfeksionis',
            description: 'Selesaikan semua kuis dengan nilai 80+',
            target: 80,
            current: avgScore,
            unlocked: avgScore >= 80 && totalQuizzes >= 4
        }
    ];
    
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    container.innerHTML = achievements.map(ach => {
        const progress = Math.min((ach.current / ach.target) * 100, 100);
        
        return `
            <div class="achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-badge">${ach.icon}</div>
                <h4>${ach.title}</h4>
                <p>${ach.description}</p>
                <div class="achievement-progress">
                    <div class="progress-bar small">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="achievement-text">${ach.current} / ${ach.target}</span>
                </div>
                ${ach.unlocked ? '<span class="unlocked-badge">✓ Tercapai!</span>' : ''}
            </div>
        `;
    }).join('');
}

// Load Study Calendar
async function loadStudyCalendar(userId) {
    const container = document.getElementById('studyCalendar');
    if (!container) return;
    
    try {
        // Get user activity data
        const activityRef = database.ref(`activity/${userId}`);
        const snapshot = await activityRef.once('value');
        const activityData = snapshot.val() || {};
        
        // Generate calendar for last 30 days
        const today = new Date();
        const calendar = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            const hasActivity = activityData[dateKey] ? true : false;
            
            calendar.push({
                date: date,
                dateKey: dateKey,
                active: hasActivity
            });
        }
        
        // Display calendar
        container.innerHTML = `
            <div class="calendar-grid">
                ${calendar.map(day => `
                    <div class="calendar-day ${day.active ? 'active' : ''}" 
                         title="${day.date.toLocaleDateString('id-ID')}">
                        <span class="calendar-dot"></span>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

// Track Daily Activity
async function trackDailyActivity() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
        await database.ref(`activity/${userId}/${today}`).set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            activities: true
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
    }
}

// Load Dashboard Stats (for student dashboard)
async function loadDashboardStats() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        const materialSnapshot = await progressRef.child(userId).once('value');
        const quizSnapshot = await quizzesRef.child(userId).once('value');
        
        const materialProgress = materialSnapshot.val() || {};
        const quizResults = quizSnapshot.val() || {};
        
        const completedLessons = Object.values(materialProgress).filter(m => m.progress === 100).length;
        const quizArray = Object.values(quizResults);
        const completedQuizzes = quizArray.length;
        const avgScore = completedQuizzes > 0
            ? Math.round(quizArray.reduce((sum, q) => sum + q.score, 0) / completedQuizzes)
            : 0;
        
        // Count badges (simplified)
        let badges = 0;
        if (completedLessons >= 1) badges++;
        if (completedLessons >= 5) badges++;
        if (avgScore >= 80) badges++;
        
        // Update UI
        const completedLessonsEl = document.getElementById('completedLessons');
        if (completedLessonsEl) completedLessonsEl.textContent = completedLessons;
        
        const quizScoreEl = document.getElementById('quizScore');
        if (quizScoreEl) quizScoreEl.textContent = avgScore;
        
        const completedQuizzesEl = document.getElementById('completedQuizzes');
        if (completedQuizzesEl) completedQuizzesEl.textContent = completedQuizzes;
        
        const badgesEl = document.getElementById('badges');
        if (badgesEl) badgesEl.textContent = badges;
        
        const streakEl = document.getElementById('streakDays');
        if (streakEl) streakEl.textContent = Math.min(completedLessons + completedQuizzes, 30);
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Initialize on page load
if (window.location.pathname.includes('progress.html')) {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadOverallProgress();
            trackDailyActivity();
        }
    });
}

if (window.location.pathname.includes('dashboard-siswa.html')) {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadDashboardStats();
            trackDailyActivity();
        }
    });
}

// Progress module initialized