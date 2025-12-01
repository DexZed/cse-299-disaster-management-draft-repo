
const MESSAGES_KEY = 'emergencyMessages';

/**
 * Get messages from localStorage
 * @returns {Array} Array of message objects
 */
function getMessages() {
    const messages = localStorage.getItem(MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
}

/**
 * Save messages to localStorage
 * @param {Array} messages - Array of message objects to save
 */
function saveMessages(messages) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

/**
 * Generate unique message ID
 * @returns {string} Unique message ID
 */
function generateId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Format timestamp to human-readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

/**
 * Get or create user ID
 * @returns {string} User ID
 */
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

/**
 * Get emergency type icon
 * @param {string} type - Emergency type
 * @returns {string} Emoji icon
 */
function getEmergencyIcon(type) {
    const icons = {
        flood: '🌊',
        fire: '🔥',
        earthquake: '🏚️',
        cyclone: '🌪️',
        medical: '🏥',
        accident: '🚗',
        violence: '⚠️',
        other: '📋'
    };
    return icons[type] || '📋';
}

/**
 * Render messages list
 */
function renderMessages() {
    const messagesList = document.getElementById('messagesList');
    const messageCount = document.getElementById('messageCount');
    const messages = getMessages();
    const userId = getUserId();

    // Filter messages for current user
    const userMessages = messages.filter(msg => msg.userId === userId);

    // Update message count
    messageCount.textContent = userMessages.length;

    // Check if no messages
    if (userMessages.length === 0) {
        messagesList.innerHTML = '<div class="no-messages">No reports submitted yet</div>';
        return;
    }

    // Sort by date (newest first)
    userMessages.sort((a, b) => b.timestamp - a.timestamp);

    // Render message items
    messagesList.innerHTML = userMessages.map(msg => `
        <div class="message-item status-${msg.status}" data-message-id="${msg.id}">
            <div class="message-header">
                <span class="message-priority ${msg.priority}">${msg.priority}</span>
            </div>
            <div class="message-type">
                ${getEmergencyIcon(msg.emergencyType)} ${capitalizeFirst(msg.emergencyType)}
            </div>
            <div class="message-text">${escapeHtml(msg.description)}</div>
            <div class="message-meta">
                <span>📍 ${escapeHtml(msg.location)}</span>
                <span>🕒 ${formatDate(msg.timestamp)}</span>
            </div>
            <div class="message-meta">
                <span>👥 People affected: ${msg.peopleAffected || 'N/A'}</span>
                <span class="message-status ${msg.status}">${capitalizeFirst(msg.status)}</span>
            </div>
            ${msg.adminResponse ? `
                <div class="admin-response">
                    <div class="admin-response-label">💬 Admin Response</div>
                    <div class="admin-response-text">${escapeHtml(msg.adminResponse)}</div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Show success message toast
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    const textElement = successMsg.querySelector('.success-text');

    if (textElement) {
        textElement.textContent = message;
    } else {
        successMsg.innerHTML = `<span class="success-text">${escapeHtml(message)}</span>`;
    }

    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 4000);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    alert('Error: ' + message);
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result {isValid: boolean, errors: Array}
 */
function validateFormData(formData) {
    const errors = [];

    if (!formData.reporterName || formData.reporterName.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!formData.contactNumber || !/^[\d\s\+\-\(\)]+$/.test(formData.contactNumber)) {
        errors.push('Please enter a valid contact number');
    }

    if (!formData.location || formData.location.trim().length < 3) {
        errors.push('Location must be at least 3 characters long');
    }

    if (!formData.emergencyType) {
        errors.push('Please select an emergency type');
    }

    if (!formData.priority) {
        errors.push('Please select a priority level');
    }

    if (!formData.description || formData.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const formData = {
        id: generateId(),
        userId: getUserId(),
        reporterName: document.getElementById('reporterName').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        location: document.getElementById('location').value.trim(),
        emergencyType: document.getElementById('emergencyType').value,
        priority: document.querySelector('input[name="priority"]:checked')?.value,
        description: document.getElementById('description').value.trim(),
        peopleAffected: parseInt(document.getElementById('peopleAffected').value) || 0,
        timestamp: Date.now(),
        status: 'pending',
        adminResponse: null
    };

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
        showError(validation.errors.join('\n'));
        return;
    }

    try {
        // Get existing messages
        const messages = getMessages();

        // Add new message
        messages.push(formData);

        // Save to localStorage
        saveMessages(messages);

        // Reset form
        document.getElementById('reportForm').reset();

        // Render messages
        renderMessages();

        // Show success message
        showSuccess('Emergency report submitted successfully!');

        // Scroll to messages section
        document.getElementById('messagesList').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        showError('Failed to submit report. Please try again.');
    }
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize the chatbox application
 */
function initChatbox() {
    // Render initial messages
    renderMessages();

    // Setup form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleFormSubmit);
    }

    // Refresh messages every 10 seconds to show admin updates
    setInterval(renderMessages, 10000);

    console.log('Emergency Alert Chatbox initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbox);
} else {
    initChatbox();
}

// Export functions for external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getMessages,
        saveMessages,
        generateId,
        formatDate,
        getUserId,
        renderMessages,
        showSuccess,
        showError,
        validateFormData
    };
}
