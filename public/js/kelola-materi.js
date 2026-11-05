/* ========================================
   KELOLA MATERI - DASHBOARD GURU
======================================== */

const materiKelolaRef = database.ref('materi-kelas4');

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

        loadMateriKelola();

    } catch (error) {
        console.error('Gagal mengecek role guru:', error);
        alert('Gagal memuat halaman kelola materi.');
    }
});

// Load daftar materi
function loadMateriKelola() {
    materiKelolaRef.on('value', snapshot => {
        const data = snapshot.val() || {};
        const container = document.getElementById('materiList');

        if (!container) return;

        const materiArray = Object.entries(data);

        if (materiArray.length === 0) {
            container.innerHTML = `
                <div class="modern-card">
                    <p style="color:#718096;">Belum ada materi. Silakan tambah materi baru.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = materiArray.map(([id, materi]) => `
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
                    background:var(--gradient-primary);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:28px;
                ">
                    ${materi.ikon || '📚'}
                </div>

                <div>
                    <h3 style="
                        font-family:'Fredoka',sans-serif;
                        font-size:22px;
                        color:#2d3748;
                        margin-bottom:6px;
                    ">
                        ${materi.judul || 'Tanpa Judul'}
                    </h3>

                    <p style="color:#718096; margin-bottom:8px;">
                        ${materi.deskripsi || '-'}
                    </p>

                    <span class="badge-modern" style="background:var(--gradient-info); font-size:12px;">
                        ID: ${id}
                    </span>
                </div>

                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="editMateri('${id}')" class="btn-modern btn-warning" style="border:none; cursor:pointer; padding:10px 16px;">
                        Edit
                    </button>

                    <button onclick="hapusMateri('${id}')" class="btn-modern btn-danger" style="border:none; cursor:pointer; padding:10px 16px;">
                        Hapus
                    </button>
                </div>
            </div>
        `).join('');
    });
}

// Simpan atau update materi
async function simpanMateri() {
    const materiId = document.getElementById('materiId').value;
    const judul = document.getElementById('judulMateri').value.trim();
    const ikon = document.getElementById('ikonMateri').value.trim();
    const deskripsi = document.getElementById('deskripsiMateri').value.trim();
    const isi = document.getElementById('isiMateri').value.trim();

    if (!judul || !deskripsi || !isi) {
        alert('Judul, deskripsi, dan isi materi wajib diisi.');
        return;
    }

    const materiData = {
        judul,
        ikon: ikon || '📚',
        deskripsi,
        isi,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        if (materiId) {
            await materiKelolaRef.child(materiId).update(materiData);
            alert('Materi berhasil diperbarui.');
        } else {
            const newRef = materiKelolaRef.push();
            await newRef.set({
                ...materiData,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
            alert('Materi berhasil ditambahkan.');
        }

        resetFormMateri();

    } catch (error) {
        console.error('Gagal menyimpan materi:', error);
        alert('Gagal menyimpan materi.');
    }
}

// Edit materi
async function editMateri(id) {
    try {
        const snapshot = await materiKelolaRef.child(id).once('value');
        const materi = snapshot.val();

        if (!materi) {
            alert('Materi tidak ditemukan.');
            return;
        }

        document.getElementById('materiId').value = id;
        document.getElementById('judulMateri').value = materi.judul || '';
        document.getElementById('ikonMateri').value = materi.ikon || '';
        document.getElementById('deskripsiMateri').value = materi.deskripsi || '';
        document.getElementById('isiMateri').value = materi.isi || '';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (error) {
        console.error('Gagal mengambil materi:', error);
        alert('Gagal mengambil data materi.');
    }
}

// Hapus materi
async function hapusMateri(id) {
    const yakin = confirm('Yakin ingin menghapus materi ini?');

    if (!yakin) return;

    try {
        await materiKelolaRef.child(id).remove();
        alert('Materi berhasil dihapus.');
    } catch (error) {
        console.error('Gagal menghapus materi:', error);
        alert('Gagal menghapus materi.');
    }
}

// Reset form
function resetFormMateri() {
    document.getElementById('materiId').value = '';
    document.getElementById('judulMateri').value = '';
    document.getElementById('ikonMateri').value = '';
    document.getElementById('deskripsiMateri').value = '';
    document.getElementById('isiMateri').value = '';
}