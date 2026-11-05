// Notifications.js - Toast Notification System

// Create notification container
function createNotificationContainer() {
    if (document.getElementById('notificationContainer')) return;
    
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    createNotificationContainer();
    
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    return notification;
}

// Shorthand functions
window.showSuccess = (msg, duration) => showNotification(msg, 'success', duration);
window.showError = (msg, duration) => showNotification(msg, 'error', duration);
window.showWarning = (msg, duration) => showNotification(msg, 'warning', duration);
window.showInfo = (msg, duration) => showNotification(msg, 'info', duration);
window.showNotification = showNotification;

// Initialize on load
createNotificationContainer();