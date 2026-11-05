// Navigation.js - Global Navigation Component

// Create Navigation HTML
function createNavigation(currentPage = 'dashboard') {
    const navHTML = `
        <nav class="main-nav">
            <div class="nav-container">
                <div class="nav-brand" onclick="window.location.href='dashboard-siswa.html'" style="cursor: pointer;">
                    <span class="nav-logo">📐</span>
                    <span class="nav-title">Agama Islam SD</span>
                </div>
                
                <div class="nav-menu" id="navMenu">
                    <a href="dashboard-siswa.html" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}">
                        <span class="nav-icon">🏠</span>
                        <span>Dashboard</span>
                    </a>
                    <a href="materi.html" class="nav-link ${currentPage === 'materi' ? 'active' : ''}">
                        <span class="nav-icon">📚</span>
                        <span>Materi</span>
                    </a>
                    <a href="kuis.html" class="nav-link ${currentPage === 'kuis' ? 'active' : ''}">
                        <span class="nav-icon">🎯</span>
                        <span>Kuis</span>
                    </a>
                    <a href="progress.html" class="nav-link ${currentPage === 'progress' ? 'active' : ''}">
                        <span class="nav-icon">📊</span>
                        <span>Progress</span>
                    </a>
                    <a href="achievements.html" class="nav-link ${currentPage === 'achievements' ? 'active' : ''}">
                        <span class="nav-icon">🏆</span>
                        <span>Achievements</span>
                    </a>
                </div>

                <div class="nav-actions">
                    <button class="nav-user" id="userMenuBtn" onclick="toggleUserMenu()">
                        <span class="user-avatar">👤</span>
                        <span class="user-name" id="navUserName">User</span>
                        <span class="user-arrow">▼</span>
                    </button>
                    
                    <div class="user-menu" id="userMenu" style="display: none;">
                        <div class="user-menu-header">
                            <div class="user-avatar-large">👤</div>
                            <div>
                                <div class="user-menu-name" id="userMenuName">User</div>
                                <div class="user-menu-email" id="userMenuEmail">user@email.com</div>
                            </div>
                        </div>
                        <div class="user-menu-divider"></div>
                        <a href="profile.html" class="user-menu-item">
                            <span>👤</span> Profile
                        </a>
                        <a href="dashboard-siswa.html" class="user-menu-item">
                            <span>🏠</span> Dashboard
                        </a>
                        <div class="user-menu-divider"></div>
                        <button class="user-menu-item logout-btn" id="navLogoutBtn">
                            <span>🚪</span> Keluar
                        </button>
                    </div>
                </div>

                <button class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleMobileMenu()">
                    <span class="hamburger"></span>
                </button>
            </div>
        </nav>
    `;

    return navHTML;
}

// Insert navigation into page
function initNavigation(currentPage = 'dashboard') {
    // Check if navigation already exists
    if (document.querySelector('.main-nav')) {
        return;
    }

    // Insert at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', createNavigation(currentPage));
    
    // Add padding to body to account for fixed nav
    document.body.style.paddingTop = '80px';
    
    // Initialize event listeners
    initNavigationEvents();
}

// Initialize navigation events
function initNavigationEvents() {
    // Logout button
    const logoutBtn = document.getElementById('navLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await firebase.auth().signOut();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Gagal logout. Coba lagi!');
            }
        });
    }

    // Load user data
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const snapshot = await firebase.database().ref('users/' + user.uid).once('value');
                const userData = snapshot.val();
                
                if (userData) {
                    // Update nav with user info
                    const navUserName = document.getElementById('navUserName');
                    const userMenuName = document.getElementById('userMenuName');
                    const userMenuEmail = document.getElementById('userMenuEmail');
                    
                    if (navUserName) navUserName.textContent = userData.name || 'User';
                    if (userMenuName) userMenuName.textContent = userData.name || 'User';
                    if (userMenuEmail) userMenuEmail.textContent = userData.email || user.email;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    });

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('userMenu');
        const userMenuBtn = document.getElementById('userMenuBtn');
        
        if (userMenu && userMenuBtn && !userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.style.display = 'none';
        }
    });
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    }
}

// Export for use in other scripts
window.initNavigation = initNavigation;
window.toggleUserMenu = toggleUserMenu;
window.toggleMobileMenu = toggleMobileMenu;