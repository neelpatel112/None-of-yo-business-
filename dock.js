// dock.js - Advanced macOS Dock with Physics-based Animation
class MacOSDock {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.dockEl = null;
        this.icons = [];
        this.mouseX = null;
        
        // Animation parameters (tuned for macOS-like feel)
        this.baseWidth = 52; // Base icon size in pixels
        this.distanceLimit = this.baseWidth * 6;
        this.spring = {
            stiffness: 0.3,
            damping: 0.7,
            velocity: 0
        };
        
        this.init();
    }
    
    init() {
        this.createDock();
        this.setupEventListeners();
        this.animate();
    }
    
    createDock() {
        this.dockEl = document.createElement('div');
        this.dockEl.className = 'dock-el';
        
        // Dock applications (modify as needed)
        const apps = [
            { id: 'finder', name: 'Finder', icon: 'icons/finder.png' },
            { id: 'safari', name: 'Safari', icon: 'icons/safari.png' },
            { id: 'mail', name: 'Mail', icon: 'icons/mail.png' },
            { id: 'photos', name: 'Photos', icon: 'icons/photos.png' },
            { id: 'messages', name: 'Messages', icon: 'icons/messages.png' },
            { id: 'music', name: 'Music', icon: 'icons/music.png' },
            { id: 'calendar', name: 'Calendar', icon: 'icons/calendar.png' },
            { id: 'system', name: 'System Preferences', icon: 'icons/system.png' }
        ];
        
        // Create dock items
        apps.forEach(app => {
            const dockItem = document.createElement('div');
            dockItem.className = 'dock-item';
            
            const button = document.createElement('button');
            button.className = 'dock-button';
            button.dataset.app = app.id;
            
            const img = document.createElement('img');
            img.src = app.icon;
            img.alt = app.name;
            img.draggable = false;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'dock-tooltip';
            tooltip.textContent = app.name;
            
            button.appendChild(img);
            button.appendChild(tooltip);
            dockItem.appendChild(button);
            this.dockEl.appendChild(dockItem);
            
            // Store reference for animation
            this.icons.push({
                element: img,
                targetWidth: this.baseWidth,
                currentWidth: this.baseWidth,
                velocity: 0
            });
        });
        
        // Add separator and trash (optional)
        const separator = document.createElement('div');
        separator.className = 'dock-separator';
        this.dockEl.appendChild(separator);
        
        const trashItem = document.createElement('div');
        trashItem.className = 'dock-item';
        trashItem.innerHTML = `
            <button class="dock-button" data-app="trash">
                <img src="icons/trash.png" alt="Trash">
                <div class="dock-tooltip">Trash</div>
            </button>
        `;
        this.dockEl.appendChild(trashItem);
        
        // Add trash icon to animation array
        const trashImg = trashItem.querySelector('img');
        this.icons.push({
            element: trashImg,
            targetWidth: this.baseWidth,
            currentWidth: this.baseWidth,
            velocity: 0
        });
        
        this.container.appendChild(this.dockEl);
    }
    
    setupEventListeners() {
        // Track mouse position
        this.dockEl.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
        });
        
        this.dockEl.addEventListener('mouseleave', () => {
            this.mouseX = null;
            // Reset all icons to base size
            this.icons.forEach(icon => {
                icon.targetWidth = this.baseWidth;
            });
        });
        
        // Handle clicks
        this.dockEl.addEventListener('click', (e) => {
            if (e.target.closest('.dock-button')) {
                const button = e.target.closest('.dock-button');
                const app = button.dataset.app;
                this.launchApp(app);
            }
        });
    }
    
    calculateTargetWidth(iconIndex) {
        if (this.mouseX === null) return this.baseWidth;
        
        const icon = this.icons[iconIndex];
        const rect = icon.element.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        
        // Distance from mouse to icon center
        const distance = Math.abs(this.mouseX - iconCenterX);
        
        // If too far, return base width
        if (distance > this.distanceLimit) return this.baseWidth;
        
        // Calculate scale based on distance (closer = larger)
        // This creates the magnification curve
        const normalizedDistance = distance / this.distanceLimit;
        const scale = 1 + (1 - normalizedDistance) * 1.5; // Max 2.5x scale
        
        return this.baseWidth * Math.min(scale, 2.5);
    }
    
    // Spring physics animation
    animateIcon(icon) {
        const force = (icon.targetWidth - icon.currentWidth) * this.spring.stiffness;
        const damping = -icon.velocity * this.spring.damping;
        
        icon.velocity += force + damping;
        icon.currentWidth += icon.velocity;
        
        // Apply width with sub-pixel precision
        icon.element.style.width = `${icon.currentWidth}px`;
        icon.element.style.height = `${icon.currentWidth}px`;
    }
    
    animate() {
        // Update target widths based on mouse position
        this.icons.forEach((icon, index) => {
            icon.targetWidth = this.calculateTargetWidth(index);
            this.animateIcon(icon);
        });
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
    
    launchApp(appId) {
        console.log(`Launching: ${appId}`);
        // Add your app launch logic here
        // For example: openWindow(appId);
        
        // Visual feedback
        const button = this.dockEl.querySelector(`[data-app="${appId}"]`);
        if (button) {
            const img = button.querySelector('img');
            img.style.transform = 'scale(0.9)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 100);
        }
    }
}

// Initialize dock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.macOSDock = new MacOSDock('dockContainer');
}); 