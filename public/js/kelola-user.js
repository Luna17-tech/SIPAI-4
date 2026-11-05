/* ========================================
   KELOLA USER - DASHBOARD GURU
======================================== */

let currentGuru = null;

// ========================================
// FIREBASE FUNCTIONS
// ========================================

const functionsService = firebase.functions();

if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
) {
    functionsService.useEmulator(
        '127.0.0.1',
        5001
    );

    console.log(
        '🔥 Firebase Functions menggunakan emulator localhost:5001'
    );
}



// Pakai secondary auth supaya akun guru tidak logout saat membuat user baru
let secondaryApp = null;
let secondaryAuth = null;

function initSecondaryAuth() {
    const appName = 'SecondaryCreateUserApp';

    secondaryApp = firebase.apps.find(app => app.name === appName);

    if (!secondaryApp) {
        secondaryApp = firebase.initializeApp(firebase.app().options, appName);
    }

    secondaryAuth = secondaryApp.auth();
}

// Cek login guru
auth.onAuthStateChanged(async user => {
    if (!user) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = 'login.html';
        return;
    }

    try {
        currentGuru = user;

        const userSnapshot = await usersRef.child(user.uid).once('value');
        const userData = userSnapshot.val();

        if (!userData || userData.role !== 'guru') {
            alert('Halaman ini hanya untuk guru.');
            window.location.href = 'dashboard-siswa.html';
            return;
        }

        initSecondaryAuth();
        loadDaftarUser();

    } catch (error) {
        console.error('Gagal mengecek role guru:', error);
        alert('Gagal memuat halaman kelola user.');
    }
});

// Tambah user baru
async function tambahUser() {
    const nama = document.getElementById('namaUser').value.trim();
    const email = document.getElementById('emailUser').value.trim();
    const password = document.getElementById('passwordUser').value.trim();
    const role = document.getElementById('roleUser').value;

    if (!nama || !email || !password || !role) {
        alert('Nama, email, password, dan role wajib diisi.');
        return;
    }

    if (password.length < 6) {
        alert('Password minimal 6 karakter.');
        return;
    }

    try {
        const credential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
        const newUser = credential.user;

        await database.ref('users/' + newUser.uid).set({
            name: nama,
            email: email,
            role: role,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            createdBy: currentGuru.uid
        });

        await secondaryAuth.signOut();

        alert('User berhasil dibuat.');

        resetFormUser();

    } catch (error) {
        console.error('Gagal menambah user:', error);

        if (error.code === 'auth/email-already-in-use') {
            alert('Email sudah digunakan.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Format email tidak valid.');
        } else if (error.code === 'auth/weak-password') {
            alert('Password terlalu lemah. Minimal 6 karakter.');
        } else {
            alert('Gagal menambah user: ' + error.message);
        }
    }
}

async function simpanResetPassword() {

    const passwordBaru =
        document
            .getElementById('resetPassword')
            .value
            .trim();

    const konfirmasiPassword =
        document
            .getElementById('resetKonfirmasi')
            .value
            .trim();

    const message =
        document.getElementById('resetMessage');

    const button =
        document.getElementById('btnResetPassword');


    // Cek UID siswa
    if (!uidResetPassword) {

        alert('Data siswa tidak ditemukan.');

        return;
    }


    // Password kosong
    if (!passwordBaru) {

        tampilkanResetError(
            'Password baru harus diisi.'
        );

        return;
    }


    // Minimal 6 karakter
    if (passwordBaru.length < 6) {

        tampilkanResetError(
            'Password minimal 6 karakter.'
        );

        return;
    }


    // Konfirmasi
    if (passwordBaru !== konfirmasiPassword) {

        tampilkanResetError(
            'Konfirmasi password tidak sama.'
        );

        return;
    }


    try {

        button.disabled = true;

        button.textContent =
            '⏳ Memproses...';


        /*
         * Memanggil backend Firebase Function.
         * Password TIDAK diubah langsung dari browser.
         */

        const resetPasswordFunction =
        functionsService.httpsCallable(
            'resetStudentPassword'
        );


        const result =
            await resetPasswordFunction({

                uid: uidResetPassword,

                password: passwordBaru

            });


        if (result.data.success) {

            message.style.display =
                'block';

            message.style.background =
                '#c6f6d5';

            message.style.color =
                '#276749';

            message.textContent =
                '✅ Password siswa berhasil direset.';


            // Tutup modal setelah 1,5 detik
            setTimeout(() => {

                tutupResetPassword();

            }, 1500);

        }


    } catch (error) {

        console.error(
            'Reset password gagal:',
            error
        );


        tampilkanResetError(
            error.message ||
            'Gagal mereset password siswa.'
        );


    } finally {

        button.disabled = false;

        button.textContent =
            '🔑 Reset Password';

    }

}


function tampilkanResetError(text) {

    const message =
        document.getElementById('resetMessage');

    message.style.display =
        'block';

    message.style.background =
        '#fed7d7';

    message.style.color =
        '#c53030';

    message.textContent =
        '❌ ' + text;
}

async function hapusUser(uid, nama, email) {

    // Jangan izinkan guru menghapus dirinya sendiri
    if (currentGuru && uid === currentGuru.uid) {

        alert(
            '❌ Anda tidak dapat menghapus akun yang sedang digunakan.'
        );

        return;
    }


    // Konfirmasi pertama
    const konfirmasi = confirm(
        `Apakah Anda yakin ingin menghapus user ini?\n\n` +
        `Nama: ${nama}\n` +
        `Email: ${email}\n\n` +
        `Akun yang dihapus tidak dapat digunakan untuk login kembali.`
    );


    if (!konfirmasi) {
        return;
    }


    // Konfirmasi kedua
    const konfirmasiLagi = confirm(
        `⚠️ PERHATIAN!\n\n` +
        `Data akun ${nama} akan dihapus.\n` +
        `Lanjutkan penghapusan?`
    );


    if (!konfirmasiLagi) {
        return;
    }


    try {

        const deleteUserFunction =
        functionsService.httpsCallable(
            'deleteUserAccount'
        );


        const result =
            await deleteUserFunction({
                uid: uid
            });


        if (result.data.success) {

            alert(
                `✅ User ${nama} berhasil dihapus.`
            );

        }


    } catch (error) {

        console.error(
            'Gagal menghapus user:',
            error
        );


        alert(
            '❌ Gagal menghapus user: ' +
            (error.message || 'Terjadi kesalahan.')
        );

    }

}

// ========================================
// LOAD DAFTAR USER
// ========================================

function loadDaftarUser() {

    const container =
        document.getElementById('userList');

    if (!container) return;


    usersRef.on(
        'value',

        snapshot => {

            const users =
                snapshot.val() || {};

            const entries =
                Object.entries(users);


            // Jika belum ada user
            if (entries.length === 0) {

                container.innerHTML = `
                    <div class="modern-card">
                        <p style="color:#718096;">
                            Belum ada user.
                        </p>
                    </div>
                `;

                return;
            }


            // ========================================
            // TAMPILKAN USER
            // ========================================

            container.innerHTML =
                entries.map(([uid, user]) => {

                    const roleIcon =
                        user.role === 'guru'
                            ? '👩‍🏫'
                            : '👨‍🎓';


                    const roleColor =
                        user.role === 'guru'
                            ? 'var(--gradient-warning)'
                            : 'var(--gradient-success)';


                    // ========================================
                    // RESET PASSWORD
                    // Hanya untuk siswa
                    // ========================================

                    const tombolReset =
                        user.role === 'siswa'
                            ? `
                                <button
                                    type="button"
                                    class="
                                        btn-modern
                                        btn-primary
                                        reset-password-btn
                                    "
                                    data-uid="${uid}"
                                    data-nama="${escapeHTML(user.name || '')}"
                                    data-email="${escapeHTML(user.email || '')}"
                                    style="
                                        border:none;
                                        cursor:pointer;
                                        font-size:13px;
                                        padding:10px 14px;
                                    "
                                >
                                    🔑 Reset Password
                                </button>
                            `
                            : '';


                    // ========================================
                    // HAPUS USER
                    // Tidak boleh hapus akun sendiri
                    // ========================================

                    const tombolHapus =
                        uid !== currentGuru.uid
                            ? `
                                <button
                                    type="button"
                                    class="
                                        btn-modern
                                        delete-user-btn
                                    "
                                    data-uid="${uid}"
                                    data-nama="${escapeHTML(user.name || '')}"
                                    data-email="${escapeHTML(user.email || '')}"
                                    style="
                                        border:none;
                                        cursor:pointer;
                                        font-size:13px;
                                        padding:10px 14px;
                                        background:#e53e3e;
                                        color:white;
                                    "
                                >
                                    🗑️ Hapus User
                                </button>
                            `
                            : '';


                    return `
                        <div
                            class="modern-card user-card"
                            style="
                                display:grid;
                                grid-template-columns:
                                    auto 1fr auto;
                                gap:20px;
                                align-items:center;
                            "
                        >

                            <div
                                style="
                                    width:60px;
                                    height:60px;
                                    border-radius:18px;
                                    background:${roleColor};
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:28px;
                                "
                            >
                                ${roleIcon}
                            </div>


                            <div>

                                <h3
                                    style="
                                        font-family:
                                            'Fredoka',
                                            sans-serif;
                                        font-size:22px;
                                        color:#2d3748;
                                        margin-bottom:6px;
                                    "
                                >
                                    ${
                                        escapeHTML(
                                            user.name ||
                                            'Tanpa Nama'
                                        )
                                    }
                                </h3>


                                <p
                                    style="
                                        color:#718096;
                                        margin-bottom:8px;
                                    "
                                >
                                    ${
                                        escapeHTML(
                                            user.email || '-'
                                        )
                                    }
                                </p>


                                <span
                                    class="badge-modern"
                                    style="
                                        background:${roleColor};
                                        font-size:12px;
                                    "
                                >
                                    ${
                                        escapeHTML(
                                            user.role || '-'
                                        )
                                    }
                                </span>

                            </div>


                            <div
                                style="
                                    display:flex;
                                    flex-direction:column;
                                    align-items:flex-end;
                                    gap:10px;
                                "
                            >

                                ${tombolReset}

                                ${tombolHapus}

                                <span
                                    style="
                                        font-size:12px;
                                        color:#a0aec0;
                                    "
                                >
                                    ${uid.substring(0, 8)}...
                                </span>

                            </div>

                        </div>
                    `;

                }).join('');


            // ========================================
            // EVENT RESET PASSWORD
            // ========================================

            const resetButtons =
                document.querySelectorAll(
                    '.reset-password-btn'
                );


            resetButtons.forEach(button => {

                button.addEventListener(
                    'click',

                    function() {

                        const uid =
                            this.dataset.uid;

                        const nama =
                            this.dataset.nama;

                        const email =
                            this.dataset.email;


                        bukaResetPassword(
                            uid,
                            nama,
                            email
                        );

                    }
                );

            });


            // ========================================
            // EVENT HAPUS USER
            // ========================================

            const deleteButtons =
                document.querySelectorAll(
                    '.delete-user-btn'
                );


            deleteButtons.forEach(button => {

                button.addEventListener(
                    'click',

                    function() {

                        const uid =
                            this.dataset.uid;

                        const nama =
                            this.dataset.nama;

                        const email =
                            this.dataset.email;


                        hapusUser(
                            uid,
                            nama,
                            email
                        );

                    }
                );

            });

        },


        // ========================================
        // ERROR DATABASE
        // ========================================

        error => {

            console.error(
                '❌ Gagal mengambil daftar user:',
                error
            );


            container.innerHTML = `
                <div class="modern-card">

                    <p
                        style="
                            color:#c53030;
                            font-weight:600;
                        "
                    >
                        ❌ Gagal memuat data user.
                    </p>

                    <p
                        style="
                            color:#718096;
                            margin-top:8px;
                            font-size:14px;
                        "
                    >
                        ${escapeHTML(error.message)}
                    </p>

                </div>
            `;

        }
    );

}

// ========================================
// SEARCH USER
// ========================================

const searchUserInput =
    document.getElementById('searchUser');

if (searchUserInput) {

    searchUserInput.addEventListener(
        'input',
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();

            const userCards =
                document.querySelectorAll(
                    '#userList .user-card'
                );

            let ditemukan = 0;

            userCards.forEach(card => {

                const isiCard =
                    card.textContent
                        .toLowerCase();

                if (
                    isiCard.includes(keyword)
                ) {

                    card.style.display = 'grid';

                    ditemukan++;

                } else {

                    card.style.display = 'none';

                }

            });


            // ========================================
            // PESAN JIKA TIDAK DITEMUKAN
            // ========================================

            let pesanKosong =
                document.getElementById(
                    'userSearchEmpty'
                );

            if (
                keyword !== '' &&
                ditemukan === 0
            ) {

                if (!pesanKosong) {

                    pesanKosong =
                        document.createElement(
                            'div'
                        );

                    pesanKosong.id =
                        'userSearchEmpty';

                    pesanKosong.className =
                        'modern-card';

                    pesanKosong.style.textAlign =
                        'center';

                    pesanKosong.style.padding =
                        '30px';

                    pesanKosong.innerHTML = `
                        <div style="
                            font-size:38px;
                            margin-bottom:10px;
                        ">
                            🔍
                        </div>

                        <h3 style="
                            font-family:'Fredoka',
                            sans-serif;
                            color:#2d3748;
                            margin-bottom:6px;
                        ">
                            User tidak ditemukan
                        </h3>

                        <p style="
                            color:#718096;
                        ">
                            Tidak ada user yang
                            sesuai dengan pencarian.
                        </p>
                    `;

                    document
                        .getElementById(
                            'userList'
                        )
                        .appendChild(
                            pesanKosong
                        );

                }

            } else {

                if (pesanKosong) {

                    pesanKosong.remove();

                }

            }

        }
    );

}

// Reset form
function resetFormUser() {
    document.getElementById('namaUser').value = '';
    document.getElementById('emailUser').value = '';
    document.getElementById('passwordUser').value = '';
    document.getElementById('roleUser').value = 'siswa';
}

let uidResetPassword = null;


// Buka modal reset password
function bukaResetPassword(uid, nama, email) {

    uidResetPassword = uid;

    document.getElementById('resetNama').value =
        nama;

    document.getElementById('resetEmail').value =
        email;

    document.getElementById('resetPassword').value =
        '';

    document.getElementById('resetKonfirmasi').value =
        '';

    const message =
        document.getElementById('resetMessage');

    message.style.display = 'none';
    message.textContent = '';

    document.getElementById(
        'resetPasswordModal'
    ).style.display = 'flex';
}


// Tutup modal
function tutupResetPassword() {

    document.getElementById(
        'resetPasswordModal'
    ).style.display = 'none';

    uidResetPassword = null;
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