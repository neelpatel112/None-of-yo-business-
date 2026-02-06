// script.js - Main Application Logic

// Update time in menu bar
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Initialize desktop icons interaction
function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop .icon');
    
    icons.forEach(icon => {
        // Double click to open
        icon.addEventListener('dblclick', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Add your open folder/file logic here
                alert(`Opening ${this.querySelector('span').textContent}`);
            }, 100);
        });
        
        // Right click context menu
        icon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            // Add context menu logic here
            console.log('Right clicked:', this.querySelector('span').textContent);
        });
    });
}

// System initialization
function initSystem() {
    // Update time immediately and every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Initialize desktop icons
    initDesktopIcons();
    
    // Lock screen functionality (example)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            // Implement lock screen
            console.log('Lock screen activated');
        }
    });
    
    console.log('macOS Web Emulator initialized');
}

// Start the system when page loads
document.addEventListener('DOMContentLoaded', initSystem);