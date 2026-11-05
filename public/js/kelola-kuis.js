/* ========================================
   KELOLA KUIS - DASHBOARD GURU
======================================== */

const kuisKelolaRef = database.ref('kuis-kelas4');
const materiKelas4Ref = database.ref('materi-kelas4');

let daftarMateri = {};
let soalSementara = [];

// Cek login guru
auth.onAuthStateChanged(async user => {
    if (!user) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const userSnapshot = await usersRef.child(user.uid).once('value');
        const userData = userSnapshot.val();

        if (!userData || userData.role !== 'guru') {
            alert('Halaman ini hanya untuk guru.');
            window.location.href = 'dashboard-siswa.html';
            return;
        }

        await loadMateriSelect();
        loadDaftarKuis();

    } catch (error) {
        console.error('Gagal mengecek role guru:', error);
        alert('Gagal memuat halaman kelola kuis.');
    }
});

// Load materi ke select
async function loadMateriSelect() {
    const select = document.getElementById('materiSelect');
    if (!select) return;

    try {
        const snapshot = await materiKelas4Ref.once('value');
        daftarMateri = snapshot.val() || {};

        const entries = Object.entries(daftarMateri);

        if (entries.length === 0) {
            select.innerHTML = `<option value="">Belum ada materi</option>`;
            return;
        }

        select.innerHTML = `
            <option value="">Pilih materi</option>
            ${entries.map(([id, materi]) => `
                <option value="${id}">
                    ${materi.ikon || '📚'} ${materi.judul || 'Tanpa Judul'}
                </option>
            `).join('')}
        `;

    } catch (error) {
        console.error('Gagal memuat materi:', error);
        select.innerHTML = `<option value="">Gagal memuat materi</option>`;
    }
}

// Tambah soal ke array sementara
function tambahSoal() {
    const soal = document.getElementById('soalInput').value.trim();
    const pilihanA = document.getElementById('pilihanA').value.trim();
    const pilihanB = document.getElementById('pilihanB').value.trim();
    const pilihanC = document.getElementById('pilihanC').value.trim();
    const pilihanD = document.getElementById('pilihanD').value.trim();
    const jawaban = document.getElementById('jawabanBenar').value;
    const pembahasan = document.getElementById('pembahasanInput').value.trim();

    if (!soal || !pilihanA || !pilihanB || !pilihanC || !pilihanD || jawaban === '') {
        alert('Pertanyaan, semua pilihan, dan jawaban benar wajib diisi.');
        return;
    }

    soalSementara.push({
        soal,
        pilihan: [pilihanA, pilihanB, pilihanC, pilihanD],
        jawaban: Number(jawaban),
        pembahasan: pembahasan || ''
    });

    resetFormSoal();
    renderPreviewSoal();
}

// Render preview soal
function renderPreviewSoal() {
    const container = document.getElementById('soalPreview');
    if (!container) return;

    if (soalSementara.length === 0) {
        container.innerHTML = `<p style="color:#718096;">Belum ada soal ditambahkan.</p>`;
        return;
    }

    container.innerHTML = soalSementara.map((item, index) => `
        <div class="modern-card" style="padding:18px;">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                <div>
                    <h4 style="color:#2d3748; margin-bottom:10px;">
                        Soal ${index + 1}: ${escapeHTML(item.soal)}
                    </h4>

                    <ol type="A" style="color:#718096; padding-left:20px;">
                        ${item.pilihan.map((p, i) => `
                            <li style="${i === item.jawaban ? 'font-weight:700; color:#2d3748;' : ''}">
                                ${escapeHTML(p)} ${i === item.jawaban ? '✅' : ''}
                            </li>
                        `).join('')}
                    </ol>

                    ${item.pembahasan ? `
                        <p style="margin-top:10px; color:#718096;">
                            <strong>Pembahasan:</strong> ${escapeHTML(item.pembahasan)}
                        </p>
                    ` : ''}
                </div>

                <button onclick="hapusSoalSementara(${index})"
                        style="border:none; background:#f56565; color:white; padding:8px 12px; border-radius:8px; cursor:pointer;">
                    Hapus
                </button>
            </div>
        </div>
    `).join('');
}

// Hapus soal sementara
function hapusSoalSementara(index) {
    soalSementara.splice(index, 1);
    renderPreviewSoal();
}

// Simpan kuis
async function simpanKuis() {
    const quizId = document.getElementById('quizId').value;
    const materiId = document.getElementById('materiSelect').value;
    const judul = document.getElementById('judulKuis').value.trim();
    const deskripsi = document.getElementById('deskripsiKuis').value.trim();

    if (!materiId) {
        alert('Pilih materi terlebih dahulu.');
        return;
    }

    if (!judul || !deskripsi) {
        alert('Judul dan deskripsi kuis wajib diisi.');
        return;
    }

    if (soalSementara.length === 0) {
        alert('Tambahkan minimal 1 soal.');
        return;
    }

    const materi = daftarMateri[materiId] || {};

    const kuisData = {
        materiId,
        materiJudul: materi.judul || 'Tanpa Judul',
        materiIkon: materi.ikon || '📚',
        judul,
        deskripsi,
        questions: soalSementara,
        totalSoal: soalSementara.length,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        if (quizId) {
            await kuisKelolaRef.child(quizId).update(kuisData);
            alert('Kuis berhasil diperbarui.');
        } else {
            const newRef = kuisKelolaRef.push();
            await newRef.set({
                ...kuisData,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
            alert('Kuis berhasil ditambahkan.');
        }

        resetFormKuis();

    } catch (error) {
        console.error('Gagal menyimpan kuis:', error);
        alert('Gagal menyimpan kuis: ' + error.message);
    }
}

// Load daftar kuis
function loadDaftarKuis() {
    const container = document.getElementById('kuisList');
    if (!container) return;

    kuisKelolaRef.on('value', snapshot => {
        const data = snapshot.val() || {};
        const entries = Object.entries(data);

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="modern-card">
                    <p style="color:#718096;">Belum ada kuis. Silakan tambah kuis baru.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(([id, kuis]) => `
            <div class="modern-card" style="
                display:grid;
                grid-template-columns:auto 1fr auto;
                gap:20px;
                align-items:center;
            ">
                <div style="
                    width:60px;
                    height:60px;
                    border-radius:18px;
                    background:var(--gradient-warning);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:28px;
                ">
                    ${escapeHTML(kuis.materiIkon || '🎯')}
                </div>

                <div>
                    <h3 style="font-family:'Fredoka',sans-serif; font-size:22px; color:#2d3748; margin-bottom:6px;">
                        ${escapeHTML(kuis.judul || 'Tanpa Judul')}
                    </h3>

                    <p style="color:#718096; margin-bottom:8px;">
                        Materi: ${escapeHTML(kuis.materiJudul || '-')}
                    </p>

                    <span class="badge-modern" style="background:var(--gradient-info); font-size:12px;">
                        ${kuis.totalSoal || 0} Soal
                    </span>
                </div>

                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="editKuis('${id}')" class="btn-modern btn-warning" style="border:none; cursor:pointer; padding:10px 16px;">
                        Edit
                    </button>

                    <button onclick="hapusKuis('${id}')" class="btn-modern btn-danger" style="border:none; cursor:pointer; padding:10px 16px;">
                        Hapus
                    </button>
                </div>
            </div>
        `).join('');
    });
}

// Edit kuis
async function editKuis(id) {
    try {
        const snapshot = await kuisKelolaRef.child(id).once('value');
        const kuis = snapshot.val();

        if (!kuis) {
            alert('Kuis tidak ditemukan.');
            return;
        }

        document.getElementById('quizId').value = id;
        document.getElementById('materiSelect').value = kuis.materiId || '';
        document.getElementById('judulKuis').value = kuis.judul || '';
        document.getElementById('deskripsiKuis').value = kuis.deskripsi || '';

        soalSementara = Array.isArray(kuis.questions)
            ? kuis.questions
            : Object.values(kuis.questions || {});

        renderPreviewSoal();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (error) {
        console.error('Gagal mengambil data kuis:', error);
        alert('Gagal mengambil data kuis.');
    }
}

// Hapus kuis
async function hapusKuis(id) {
    const yakin = confirm('Yakin ingin menghapus kuis ini?');

    if (!yakin) return;

    try {
        await kuisKelolaRef.child(id).remove();
        alert('Kuis berhasil dihapus.');
    } catch (error) {
        console.error('Gagal menghapus kuis:', error);
        alert('Gagal menghapus kuis.');
    }
}

// Reset form kuis
function resetFormKuis() {
    document.getElementById('quizId').value = '';
    document.getElementById('materiSelect').value = '';
    document.getElementById('judulKuis').value = '';
    document.getElementById('deskripsiKuis').value = '';

    soalSementara = [];
    resetFormSoal();
    renderPreviewSoal();
}

// Reset form soal
function resetFormSoal() {
    document.getElementById('soalInput').value = '';
    document.getElementById('pilihanA').value = '';
    document.getElementById('pilihanB').value = '';
    document.getElementById('pilihanC').value = '';
    document.getElementById('pilihanD').value = '';
    document.getElementById('jawabanBenar').value = '';
    document.getElementById('pembahasanInput').value = '';
}

// Escape HTML
function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}