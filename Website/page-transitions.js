/**
 * Home Page Loading System
 * Handles the initial loading screen for the home page only
 */

class HomeLoadingSystem {
    constructor() {
        this.hasSeenHomeLoading = this.getSessionFlag('hasSeenHomeLoading');
        this.currentPage = this.getCurrentPage();
        
        // Only initialize on home page
        if (this.currentPage === 'home' || this.currentPage === 'index') {
            this.init();
        }
    }
    
    init() {
        // Only handle loading screen on home page
        if (this.currentPage === 'home' || this.currentPage === 'index') {
            // Check if we should show the loading screen
            if (!this.hasSeenHomeLoading) {
                this.setSessionFlag('hasSeenHomeLoading', true);
                this.hasSeenHomeLoading = true;
                console.log('🏠 Home page loading screen active');
            } else {
                // Hide loading screen immediately if already seen
                this.hideLoadingScreen();
            }
        }
        
        console.log(`🎨 Home Loading System initialized for ${this.currentPage} page (loading screen only)`);
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        // Map filenames to page names
        const pageMap = {
            'index': 'home',
            'home': 'home',
            'apps': 'apps',
            'news-enhanced': 'news',
            'contact': 'contact',
            'about': 'about',
            'daily-updates': 'daily-updates'
        };
        
        return pageMap[filename] || 'home';
    }
    
    getSessionFlag(key) {
        return sessionStorage.getItem(key) === 'true';
    }
    
    setSessionFlag(key, value) {
        sessionStorage.setItem(key, value.toString());
    }
    
    shouldShowLoading() {
        // Only show loading on home page if user hasn't seen it this session
        return (this.currentPage === 'home' || this.currentPage === 'index') && !this.hasSeenHomeLoading;
    }
    
    hideLoadingScreen() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.homeLoadingSystem = new HomeLoadingSystem();
    
    // Hide loading screen if not needed
    if (!window.homeLoadingSystem.shouldShowLoading()) {
        window.homeLoadingSystem.hideLoadingScreen();
    }
    
    // Add enhanced fade in animation to content when page loads
    setTimeout(() => {
        // Add CSS for content fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            .content-fade-in {
                animation: contentFadeIn 0.8s ease-out;
            }
            
            @keyframes contentFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        const contentElements = [
            'nav',
            'header',
            'main',
            'section',
            'article',
            '.hero-content',
            '.page-content',
            '.container',
            '.main-container',
            'footer'
        ];
        
        contentElements.forEach(selector => {
            const found = document.querySelectorAll(selector);
            found.forEach(el => {
                if (el && el.style) {
                    el.classList.add('content-fade-in');
                }
            });
        });
    }, 150);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeLoadingSystem;
} else if (typeof window !== 'undefined') {
    window.HomeLoadingSystem = HomeLoadingSystem;
} 