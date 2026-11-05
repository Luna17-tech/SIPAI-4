// Auth.js - Login Logic

// Check if user already logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
        // User logged in, check role and redirect
        checkUserRole(user.uid);
    }
});

// Login Form Handler
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // Validate inputs
        if (!email || !password) {
            errorMsg.textContent = '❌ Email dan password harus diisi!';
            errorMsg.style.display = 'block';
            return;
        }
        
        if (!isValidEmail(email)) {
            errorMsg.textContent = '❌ Format email tidak valid!';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Memproses...';
        submitBtn.disabled = true;
        errorMsg.style.display = 'none';
        
        try {
            // Firebase login
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Check user role from database
            const snapshot = await firebase.database().ref('users/' + user.uid).once('value');
            const userData = snapshot.val();
            
            if (userData && userData.role) {
                // Redirect based on role
                if (userData.role === 'siswa') {
                    window.location.href = 'dashboard-siswa.html';
                } else if (userData.role === 'guru') {
                    window.location.href = 'dashboard-guru.html';
                } else {
                    throw new Error('Role tidak valid');
                }
            } else {
                throw new Error('Data user tidak ditemukan');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            errorMsg.textContent = getErrorMessage(error.code);
            errorMsg.style.display = 'block';
            submitBtn.textContent = 'Masuk';
            submitBtn.disabled = false;
        }
    });
}

// Helper function to check user role
async function checkUserRole(uid) {
    try {
        const snapshot = await firebase.database().ref('users/' + uid).once('value');
        const userData = snapshot.val();
        
        if (userData && userData.role) {
            if (userData.role === 'siswa') {
                window.location.href = 'dashboard-siswa.html';
            } else if (userData.role === 'guru') {
                window.location.href = 'dashboard-guru.html';
            }
        }
    } catch (error) {
        console.error('Error checking user role:', error);
    }
}

// Helper function for error messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return '❌ Email tidak valid!';
        case 'auth/user-disabled':
            return '❌ Akun ini dinonaktifkan!';
        case 'auth/user-not-found':
            return '❌ Email tidak terdaftar!';
        case 'auth/wrong-password':
            return '❌ Password salah!';
        case 'auth/invalid-credential':
            return '❌ Email atau password salah!';
        case 'auth/too-many-requests':
            return '❌ Terlalu banyak percobaan. Coba lagi nanti!';
        case 'auth/network-request-failed':
            return '❌ Koneksi internet bermasalah!';
        default:
            return '❌ Login gagal! Coba lagi.';
    }
}

// Logout function (for dashboard pages)
window.logout = async function() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Gagal logout. Coba lagi!');
    }
};

// Auth module initialized