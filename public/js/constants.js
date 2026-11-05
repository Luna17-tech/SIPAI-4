// Constants - Application-wide constants

/**
 * Material IDs
 */
const MATERIAL_IDS = {
    SEGITIGA: 'segitiga',
    PERSEGI: 'persegi',
    PERSEGI_PANJANG: 'persegi-panjang',
    LINGKARAN: 'lingkaran',
    JAJAR_GENJANG: 'jajar-genjang',
    TRAPESIUM: 'trapesium',
    KUBUS: 'kubus',
    BALOK: 'balok',
    TABUNG: 'tabung',
    LIMAS: 'limas'
};

/**
 * User Roles
 */
const USER_ROLES = {
    SISWA: 'siswa',
    GURU: 'guru'
};

/**
 * Score Classifications
 */
const SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 60
};

/**
 * Progress Percentages
 */
const PROGRESS = {
    NOT_STARTED: 0,
    IN_PROGRESS: 50,
    COMPLETED: 100
};

/**
 * Time Limits (in seconds)
 */
const TIME_LIMITS = {
    QUIZ_DEFAULT: 900, // 15 minutes
    QUIZ_SHORT: 720,   // 12 minutes
    QUIZ_LONG: 1200    // 20 minutes
};

/**
 * Notification Types
 */
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * Firebase Error Codes
 */
const AUTH_ERRORS = {
    INVALID_EMAIL: 'auth/invalid-email',
    USER_DISABLED: 'auth/user-disabled',
    USER_NOT_FOUND: 'auth/user-not-found',
    WRONG_PASSWORD: 'auth/wrong-password',
    INVALID_CREDENTIAL: 'auth/invalid-credential',
    TOO_MANY_REQUESTS: 'auth/too-many-requests',
    NETWORK_FAILED: 'auth/network-request-failed'
};

/**
 * Default Values
 */
const DEFAULTS = {
    TOTAL_MATERIALS: 10,
    CONFETTI_COUNT: 50,
    NOTIFICATION_DURATION: 3000,
    LOADER_DELAY: 500
};

/**
 * Validation Rules
 */
const VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 100
};

// Export constants globally
window.MATERIAL_IDS = MATERIAL_IDS;
window.USER_ROLES = USER_ROLES;
window.SCORE_THRESHOLDS = SCORE_THRESHOLDS;
window.PROGRESS = PROGRESS;
window.TIME_LIMITS = TIME_LIMITS;
window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
window.AUTH_ERRORS = AUTH_ERRORS;
window.DEFAULTS = DEFAULTS;
window.VALIDATION = VALIDATION;

// Constants module initialized
