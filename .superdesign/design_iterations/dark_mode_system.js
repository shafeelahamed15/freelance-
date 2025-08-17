// ClientHandle Dark Mode System
// Complete theme switching functionality with persistence and system detection

class DarkModeManager {
    constructor() {
        this.init();
    }

    // Initialize the dark mode system
    init() {
        // Set initial theme before page renders to prevent flash
        this.setInitialTheme();
        
        // Listen for system theme changes
        this.listenForSystemChanges();
        
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.updateUI();
            });
        } else {
            this.setupEventListeners();
            this.updateUI();
        }
    }

    // Set initial theme before page renders to prevent flash
    setInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);

        if (shouldUseDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    // Get current theme
    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    // Toggle theme
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Set specific theme
    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        localStorage.setItem('theme', theme);
        this.updateUI();
        this.dispatchThemeChangeEvent(theme);
    }

    // Update UI elements (icons, etc.)
    updateUI() {
        const isDark = this.getCurrentTheme() === 'dark';
        
        // Update theme toggle icons
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            const sunIcon = toggle.querySelector('.sun-icon');
            const moonIcon = toggle.querySelector('.moon-icon');
            
            if (sunIcon && moonIcon) {
                if (isDark) {
                    sunIcon.style.display = 'block';
                    moonIcon.style.display = 'none';
                } else {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'block';
                }
            }
        });

        // Re-initialize icons if using Lucide
        if (window.lucide) {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 100);
        }
    }

    // Listen for system theme changes
    listenForSystemChanges() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Add click listeners to all theme toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTheme();
            });
        });

        // Add keyboard support
        document.querySelectorAll('.theme-toggle').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        });
    }

    // Dispatch custom theme change event
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    }

    // Get system preference
    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Reset to system preference
    resetToSystemPreference() {
        localStorage.removeItem('theme');
        this.setTheme(this.getSystemPreference());
    }
}

// Initialize dark mode manager
const darkModeManager = new DarkModeManager();

// Global functions for backward compatibility
window.toggleTheme = () => darkModeManager.toggleTheme();
window.setTheme = (theme) => darkModeManager.setTheme(theme);
window.getCurrentTheme = () => darkModeManager.getCurrentTheme();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}