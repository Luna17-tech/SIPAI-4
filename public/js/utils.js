// Utilities - Common Helper Functions

/**
 * Formats a date to Indonesian locale string
 * @param {Date|number} date - Date object or timestamp
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options
    };
    return new Date(date).toLocaleDateString('id-ID', defaultOptions);
}

/**
 * Calculates time ago from a timestamp
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} Time ago string in Indonesian
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        minggu: 604800,
        hari: 86400,
        jam: 3600,
        menit: 60,
        detik: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit} yang lalu`;
        }
    }
    
    return 'Baru saja';
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Gets score classification
 * @param {number} score - Score value
 * @returns {Object} Classification object with class and text
 */
function getScoreClassification(score) {
    if (score >= 80) {
        return { class: 'excellent', text: 'Sangat Baik', icon: '🌟' };
    } else if (score >= 60) {
        return { class: 'good', text: 'Baik', icon: '👍' };
    } else {
        return { class: 'needs-improvement', text: 'Perlu Bimbingan', icon: '📚' };
    }
}

/**
 * Formats time in MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates average from array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}

/**
 * Checks if user is authenticated
 * @returns {Promise<Object|null>} User object or null
 */
async function checkAuthentication() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

/**
 * Redirects to login if not authenticated
 * @param {string} redirectPage - Page to redirect to after login
 */
async function requireAuthentication(redirectPage = '') {
    const user = await checkAuthentication();
    if (!user) {
        const redirect = redirectPage ? `?redirect=${redirectPage}` : '';
        window.location.href = `login.html${redirect}`;
    }
    return user;
}

/**
 * Safely gets user data from database
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User data or null
 */
async function getUserData(userId) {
    if (!userId) return null;
    
    try {
        const snapshot = await firebase.database().ref('users/' + userId).once('value');
        return snapshot.val();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

/**
 * Generates a random ID
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Deep clones an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Export functions globally
window.formatDate = formatDate;
window.getTimeAgo = getTimeAgo;
window.isValidEmail = isValidEmail;
window.sanitizeInput = sanitizeInput;
window.debounce = debounce;
window.throttle = throttle;
window.getScoreClassification = getScoreClassification;
window.formatTime = formatTime;
window.calculateAverage = calculateAverage;
window.checkAuthentication = checkAuthentication;
window.requireAuthentication = requireAuthentication;
window.getUserData = getUserData;
window.generateId = generateId;
window.deepClone = deepClone;

// Utilities module initialized
