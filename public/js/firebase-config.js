// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3yVe_YC7Td0MSTSSftJq5irh-s3sdtZ8",
  authDomain: "aplikasi-sd-90a5f.firebaseapp.com",
  databaseURL: "https://aplikasi-sd-90a5f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aplikasi-sd-90a5f",
  storageBucket: "aplikasi-sd-90a5f.firebasestorage.app",
  messagingSenderId: "610785764736",
  appId: "1:610785764736:web:d292da420a096408a6cd65",
  measurementId: "G-28GREJ3GS8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Database references
const usersRef = database.ref('users');
const progressRef = database.ref('progress');
const quizzesRef = database.ref('quiz-results');

// Helper function to get current user ID
function getCurrentUserId() {
    const user = firebase.auth().currentUser;
    return user ? user.uid : null;
}

// Helper function to update progress
async function updateProgress(userId, materiId, progress) {
    if (!userId || !materiId) {
        throw new Error('User ID and Material ID are required');
    }
    
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        throw new Error('Progress must be a number between 0 and 100');
    }
    
    try {
        await progressRef.child(userId).child(materiId).set({
            progress: progress,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        return true;
    } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
}

// Helper function to save quiz result
async function saveQuizResult(userId, quizData) {
    if (!userId || !quizData) {
        throw new Error('User ID and quiz data are required');
    }
    
    // Validate quiz data
    if (typeof quizData.score !== 'number' || quizData.score < 0 || quizData.score > 100) {
        throw new Error('Invalid quiz score');
    }
    
    try {
        const quizRef = quizzesRef.child(userId).push();
        await quizRef.set({
            ...quizData,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        return quizRef.key;
    } catch (error) {
        console.error('Error saving quiz result:', error);
        throw error;
    }
}

// Export helper functions globally
window.getCurrentUserId = getCurrentUserId;
window.updateProgress = updateProgress;
window.saveQuizResult = saveQuizResult;
window.usersRef = usersRef;
window.progressRef = progressRef;
window.quizzesRef = quizzesRef;

// Firebase initialized