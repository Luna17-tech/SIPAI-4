/* ========================================
   DETAIL MATERI SISWA - LOAD DARI FIREBASE
   Data dari: materi-kelas4/{topik}
======================================== */

let currentUser = null;
let currentMateri = null;
let currentSectionIndex = 0;
let currentTopik = '';

const detailMateriRef = database.ref('materi-kelas4');

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initNavigation === 'function') {
        initNavigation('materi');
    }

    const urlParams = new URLSearchParams(window.location.search);
    currentTopik = urlParams.get('topik') || '';

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        currentUser = user;
        loadMateriFromFirebase(currentTopik);
    });
});

async function loadMateriFromFirebase(topik) {
    if (!topik) {
        tampilkanError('ID materi tidak valid.');
        setTimeout(() => {
            window.location.href = 'materi.html';
        }, 1500);
        return;
    }

    try {
        const snapshot = await detailMateriRef.child(topik).once('value');
        const data = snapshot.val();

        if (!data) {
            tampilkanError('Materi tidak ditemukan di Firebase.');
            setTimeout(() => {
                window.location.href = 'materi.html';
            }, 1500);
            return;
        }

        currentMateri = {
            id: topik,
            title: data.judul || 'Tanpa Judul',
            icon: data.ikon || '📚',
            deskripsi: data.deskripsi || '',
            isi: data.isi || '',
            sections: [
                {
                    title: 'Ringkasan Materi',
                    content: `
                        <div class="info-box">
                            <p>${formatText(data.deskripsi || 'Tidak ada deskripsi.')}</p>
                        </div>
                    `
                },
                {
                    title: 'Isi Materi',
                    content: `
                        <div class="example-box" style="line-height:1.8; font-size:18px;">
                            ${formatText(data.isi || 'Isi materi belum tersedia.')}
                        </div>
                    `
                }
            ]
        };

        const titleEl = document.getElementById('materiTitle');
        if (titleEl) {
            titleEl.innerHTML = `${escapeHTML(currentMateri.icon)} ${escapeHTML(currentMateri.title)}`;
        }

        buildSectionNavigation();
        showSection(0);

        // Catat penggunaan materi oleh siswa
        await catatPenggunaanMateri();

    } catch (error) {
        console.error('Gagal memuat detail materi:', error);
        tampilkanError('Gagal memuat materi: ' + error.message);
    }
}

function buildSectionNavigation() {
    const nav = document.getElementById('sectionNavigation');
    if (!nav || !currentMateri) return;

    nav.innerHTML = '';

    currentMateri.sections.forEach((section, index) => {
        const item = document.createElement('div');
        item.className = 'section-nav-item';

        if (index === 0) {
            item.classList.add('active');
        }

        item.innerHTML = `
            <span>${index + 1}</span>
            <span>${escapeHTML(section.title)}</span>
        `;

        item.onclick = () => showSection(index);
        nav.appendChild(item);
    });
}

function showSection(index) {
    if (!currentMateri || !currentMateri.sections[index]) return;

    currentSectionIndex = index;
    const section = currentMateri.sections[index];

    const contentEl = document.getElementById('materiContent');
    if (contentEl) {
        contentEl.innerHTML = `
            <h2 style="font-family:'Fredoka',sans-serif; font-size:36px; margin-bottom:20px; color:#2d3748;">
                ${escapeHTML(section.title)}
            </h2>
            ${section.content}
        `;
    }

    const navItems = document.querySelectorAll('.section-nav-item');
    navItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    const prevBtn = document.getElementById('prevSectionBtn');
    const nextBtn = document.getElementById('nextSectionBtn');

    if (prevBtn) {
        prevBtn.disabled = index === 0;
    }

    if (nextBtn) {
        nextBtn.style.display =
            index === currentMateri.sections.length - 1 ? 'none' : 'inline-flex';
    }

    window.scrollTo(0, 0);
}

function nextSection() {
    if (currentMateri && currentSectionIndex < currentMateri.sections.length - 1) {
        showSection(currentSectionIndex + 1);
    }
}

function previousSection() {
    if (currentSectionIndex > 0) {
        showSection(currentSectionIndex - 1);
    }
}

// ========================================
// CATAT PENGGUNAAN MATERI
// ========================================
async function catatPenggunaanMateri() {

    if (!currentUser || !currentTopik || !currentMateri) {
        return;
    }

    try {

        const progressRef = firebase.database()
            .ref(
                `progress/${currentUser.uid}/materi/${currentTopik}`
            );

        const snapshot =
            await progressRef.once('value');

        const oldData =
            snapshot.val() || {};

        const sekarang =
            Date.now();

        await progressRef.update({

            topik: currentTopik,

            title: currentMateri.title,

            firstViewedAt:
                oldData.firstViewedAt ||
                sekarang,

            lastViewedAt:
                sekarang,

            lastActivityAt:
                sekarang,

            viewCount:
                (Number(oldData.viewCount) || 0) + 1

        });

        console.log(
            '👀 Penggunaan materi tercatat:',
            currentMateri.title
        );

    } catch (error) {

        console.error(
            'Gagal mencatat penggunaan materi:',
            error
        );

    }
}

async function markAsComplete() {

    if (!currentUser) {
        tampilkanError('User belum login.');
        return;
    }

    if (!currentTopik || !currentMateri) {
        tampilkanError('Materi tidak valid.');
        return;
    }

    try {

        const progressRef =
            firebase.database()
                .ref(
                    `progress/${currentUser.uid}/materi/${currentTopik}`
                );

        const existingProgress =
            await progressRef.once('value');

        const oldData =
            existingProgress.val() || {};

        const xpAlreadyAwarded =
            oldData.xpAwarded === true;

        const sekarang =
            Date.now();


        // ========================================
        // SIMPAN STATUS MATERI SELESAI
        // ========================================

        await progressRef.update({

            completed: true,

            completedAt:
                oldData.completedAt ||
                sekarang,

            lastActivityAt:
                sekarang,

            topik:
                currentTopik,

            title:
                currentMateri.title,

            xpAwarded: true

        });


        // ========================================
        // XP HANYA SEKALI
        // ========================================

        if (!xpAlreadyAwarded) {

            const xpRef =
                firebase.database()
                    .ref(
                        `xp/${currentUser.uid}/total`
                    );

            await xpRef.transaction(
                currentXP => {

                    return (
                        Number(currentXP) || 0
                    ) + 50;

                }
            );

            console.log(
                '⭐ XP berhasil ditambahkan +50'
            );

        } else {

            console.log(
                'ℹ️ XP materi sudah pernah diberikan'
            );

        }


        tampilkanSukses(
            `Selamat! Kamu telah menyelesaikan materi ${currentMateri.title}! 🎉`
        );


        setTimeout(() => {

            window.location.href =
                'materi.html';

        }, 2000);


    } catch (error) {

        console.error(
            'Gagal menyimpan progress:',
            error
        );

        tampilkanError(
            'Gagal menyimpan progress: ' +
            error.message
        );

    }
}

function formatText(value) {
    return escapeHTML(value).replace(/\n/g, '<br>');
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
    if (typeof celebrateSuccess === 'function') {
        celebrateSuccess(message);
    } else if (typeof showSuccess === 'function') {
        showSuccess(message);
    } else {
        alert(message);
    }
}