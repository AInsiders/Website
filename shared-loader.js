// New Loading Screen Logic - Black screen with typing text and explosion reveal
document.addEventListener('DOMContentLoaded', function() {

    // No immediate hiding - let the loader show on home page
    
    // Initialize new loading screen
    initNewLoadingScreen();
    
    // Function to reset first visit flag (for testing)
    window.resetFirstVisit = function() {
        localStorage.removeItem('hasVisitedHome');
        console.log('First visit flag reset. Reload the page to see the loader again.');
    };
    
    // New Loading Screen Animation
    function initNewLoadingScreen() {
        const loader = document.getElementById('loader');
        const typingText = document.getElementById('typing-text');
        const pulsingLight = document.getElementById('pulsing-light');
        const websiteContent = document.getElementById('website-content');
        
        if (!loader) return;
        
        // Check if this is the home page
        const isHomePage = window.location.pathname.endsWith('index.html') ||
                          window.location.pathname.endsWith('/') ||
                          window.location.pathname === '';

        console.log('New loader check:', { isHomePage, pathname: window.location.pathname });
        
        // If not home page, hide loader immediately
        if (!isHomePage) {
            console.log('Hiding loader - not home page');
            loader.style.display = 'none';
            loader.style.visibility = 'hidden';
            loader.style.opacity = '0';
            if (websiteContent) {
                websiteContent.classList.add('revealed');
            }
            return;
        }
        
        console.log('Showing new loader - first visit');
        
        // Mark that user has visited
        localStorage.setItem('hasVisitedHome', 'true');
        
        // Initialize Matrix loader
        if (window.initMatrixLoader) {
            window.initMatrixLoader();
        }
        
        // Text will be handled by Matrix loader
        if (typingText) {
            typingText.textContent = '';
        }
        
        // Text animation handled by Matrix loader
        
        // Click handler for manual reveal
        let hasClicked = false;
        let autoStartTimer;
        
        function startExplosionAnimation() {
            if (hasClicked) return; // Prevent multiple triggers
            hasClicked = true;
            
            console.log('Starting explosion animation');
            
            // Clear auto-start timer
            if (autoStartTimer) {
                clearTimeout(autoStartTimer);
            }
            
            // Matrix reveal is automatic, but we can trigger it manually
            console.log('Manual trigger - Matrix will continue automatically');
            
            // Add explosion effect to loader
            loader.style.transform = 'scale(1.1)';
            loader.style.filter = 'brightness(1.5)';
            
            // Start the matrix reveal animation
            setTimeout(() => {
                loader.classList.add('reveal');
                
                // Show website content with animation - start revealing EARLY for magical overlap
                if (websiteContent) {
                    // Start revealing the website content very early for seamless transition
                    setTimeout(() => {
                        websiteContent.classList.add('revealed');
                    }, 200); // 200ms into the 1.2s matrix animation = ~17% through for magical overlap
                }
                
                                    // Remove loader after animation completes with a small delay for smoothness
                    setTimeout(() => {
                        loader.style.display = 'none';
                        loader.style.visibility = 'hidden';
                        loader.style.opacity = '0';
                        
                        // Cleanup Matrix
                        if (window.cleanupMatrix) {
                            window.cleanupMatrix();
                        }
                    }, 1300); // Slightly longer than matrixReveal for smooth completion
            }, 600); // Reduced delay for faster start
        }
        
        // Add click event listener
        loader.addEventListener('click', startExplosionAnimation);
        
        // Auto-start after 20 seconds - Extended to give user more time to interact
        autoStartTimer = setTimeout(() => {
            console.log('Auto-starting explosion animation after 20 seconds');
            startExplosionAnimation();
        }, 20000);
        
        // Fallback: hide loader if something goes wrong
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                console.log('Fallback: hiding loader due to timeout');
                loader.classList.add('hidden');
                loader.style.display = 'none';
                loader.style.visibility = 'hidden';
                loader.style.opacity = '0';
                if (websiteContent) {
                    websiteContent.classList.add('revealed');
                }
            }
        }, 25000); // 25 seconds total fallback (5 seconds after auto-start)
    }
}); 