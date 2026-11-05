// Loader.js - Beautiful Loading Animation

// Create loader HTML
function createLoader() {
    const loaderHTML = `
        <div id="pageLoader" class="page-loader">
            <div class="loader-content">
                <div class="loader-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="loader-icon">📐</div>
                </div>
                <h2 class="loader-title">PAI SD Kelas 4</h2>
                <p class="loader-text">Memuat halaman...</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
}

// Show loader
function showLoader(message = 'Memuat halaman...') {
    let loader = document.getElementById('pageLoader');
    
    if (!loader) {
        createLoader();
        loader = document.getElementById('pageLoader');
    }

    const loaderText = loader.querySelector('.loader-text');
    if (loaderText) {
        loaderText.textContent = message;
    }

    loader.style.display = 'flex';
}

// Hide loader
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}

// Auto-hide loader when page loads
window.addEventListener('load', () => {
    setTimeout(hideLoader, 500);
});

// Show loader initially
createLoader();

// Export functions
window.showLoader = showLoader;
window.hideLoader = hideLoader;