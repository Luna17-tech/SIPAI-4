// Confetti.js - Celebration Animation

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

function celebrateSuccess(message = 'Selamat! 🎉') {
    createConfetti();
    showSuccess(message, 4000);
    
    // Play celebration sound (optional)
    // const audio = new Audio('sounds/success.mp3');
    // audio.play().catch(e => console.error('Audio play failed:', e));
}

window.createConfetti = createConfetti;
window.celebrateSuccess = celebrateSuccess;