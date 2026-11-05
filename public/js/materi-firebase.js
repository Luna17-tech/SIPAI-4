/* ========================================
   MATERI SISWA - LOAD DARI FIREBASE
   Data dari: materi-kelas4
======================================== */

let currentUser = null;
const materiFirebaseRef = database.ref('materi-kelas4');

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initNavigation === 'function') {
        initNavigation('materi');
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = user;
    loadMateriFirebase(user.uid);
});

async function loadMateriFirebase(userId) {
    const grid = document.getElementById('materiGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:30px;">
            <p style="color:#718096;">Memuat materi dari Firebase...</p>
        </div>
    `;

    try {
        const materiSnapshot = await materiFirebaseRef.once('value');
        const progressSnapshot = await firebase.database()
            .ref(`progress/${userId}/materi`)
            .once('value');

        const materiData = materiSnapshot.val() || {};
        const progressData = progressSnapshot.val() || {};
        const materiEntries = Object.entries(materiData);

        if (materiEntries.length === 0) {
            grid.innerHTML = `
                <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:40px;">
                    <h3 style="font-family:'Fredoka',sans-serif; color:#2d3748; margin-bottom:8px;">
                        Belum ada materi
                    </h3>
                    <p style="color:#718096;">Materi belum ditambahkan oleh guru.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = materiEntries.map(([id, materi], index) => {
            const progress = progressData[id] || {};
            const isCompleted = progress.completed === true;
            const persen = isCompleted ? 100 : 0;
            const gradientClass = `gradient-bg-${(index % 5) + 1}`;

            return `
                <a href="materi-detail.html?topik=${id}" 
                   class="modern-card topic-card ${gradientClass}" 
                   style="color:white; text-align:center; padding:40px 30px; text-decoration:none;">

                    <span class="topic-badge" style="color:var(--color-primary);">
                        ${isCompleted ? 'Selesai ✅' : 'Belajar 📚'}
                    </span>

                    <div class="topic-icon icon-bounce">
                        ${escapeHTML(materi.ikon || '📚')}
                    </div>

                    <h3 style="font-family:'Fredoka',sans-serif; font-size:28px; margin-bottom:12px;">
                        ${escapeHTML(materi.judul || 'Tanpa Judul')}
                    </h3>

                    <p style="opacity:0.95; margin-bottom:20px;">
                        ${escapeHTML(materi.deskripsi || 'Klik untuk mempelajari materi ini.')}
                    </p>

                    <div class="progress-bar-modern" style="margin-bottom:16px;">
                        <div class="progress-fill" style="width:${persen}%; background:white;"></div>
                    </div>

                    <span style="font-size:14px; opacity:0.9;">
                        ${persen}% Selesai
                    </span>
                </a>
            `;
        }).join('');

    } catch (error) {
        console.error('Gagal memuat materi Firebase:', error);

        grid.innerHTML = `
            <div class="modern-card" style="grid-column:1 / -1; text-align:center; padding:40px;">
                <h3 style="font-family:'Fredoka',sans-serif; color:#e53e3e; margin-bottom:8px;">
                    Gagal memuat materi
                </h3>
                <p style="color:#718096;">${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}