// Security Protection Script
// Prevents right-click, inspect element, and other developer tools access

(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityMessage('Right-click is disabled for security reasons.');
        return false;
    });
    
    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // Disable F12 key
        if (e.key === 'F12') {
            e.preventDefault();
            showSecurityMessage('Developer tools access is restricted.');
            return false;
        }
        
        // Disable Ctrl+Shift+I (Chrome/Firefox inspect element)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showSecurityMessage('Developer tools access is restricted.');
            return false;
        }
        
        // Disable Ctrl+Shift+J (Chrome console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            showSecurityMessage('Developer tools access is restricted.');
            return false;
        }
        
        // Disable Ctrl+Shift+C (Chrome element inspector)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            showSecurityMessage('Developer tools access is restricted.');
            return false;
        }
        
        // Disable Ctrl+U (view source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showSecurityMessage('View source is disabled for security reasons.');
            return false;
        }
        
        // Disable Ctrl+S (save page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showSecurityMessage('Page saving is disabled for security reasons.');
            return false;
        }
        
        // Disable Ctrl+P (print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            showSecurityMessage('Printing is disabled for security reasons.');
            return false;
        }
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable copy
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showSecurityMessage('Copying content is disabled for security reasons.');
        return false;
    });
    
    // Disable cut
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showSecurityMessage('Cutting content is disabled for security reasons.');
        return false;
    });
    
    // Disable paste
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showSecurityMessage('Pasting content is disabled for security reasons.');
        return false;
    });
    
    // Detect developer tools opening
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                devtools.orientation = window.outerHeight - window.innerHeight > threshold ? 'vertical' : 'horizontal';
                onDevToolsOpen();
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
    
    // Alternative detection method
    const devtoolsCheck = () => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            onDevToolsOpen();
        }
    };
    
    setInterval(devtoolsCheck, 1000);
    
    // Handle developer tools detection
    function onDevToolsOpen() {
        showSecurityMessage('Developer tools detected. Access restricted.');
        
        // Optional: Redirect or take other action
        // window.location.href = '/access-denied.html';
        
        // Disable the page
        document.body.style.display = 'none';
        
        // Show warning message
        const warning = document.createElement('div');
        warning.id = 'security-warning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                color: #ff0000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                font-size: 24px;
                text-align: center;
                z-index: 999999;
            ">
                <div>
                    <h1>⚠️ SECURITY WARNING ⚠️</h1>
                    <p>Developer tools detected. Access to this page has been restricted.</p>
                    <p>Please close developer tools and refresh the page.</p>
                </div>
            </div>
        `;
        document.body.appendChild(warning);
    }
    
    // Show security message
    function showSecurityMessage(message) {
        // Remove existing message
        const existing = document.getElementById('security-message');
        if (existing) {
            existing.remove();
        }
        
        // Create new message
        const securityMsg = document.createElement('div');
        securityMsg.id = 'security-message';
        securityMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff0000;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        securityMsg.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(securityMsg);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (securityMsg.parentNode) {
                securityMsg.remove();
            }
        }, 3000);
    }
    
    // Disable console access
    const disableConsole = () => {
        // Override console methods
        console.log = function() {};
        console.info = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.debug = function() {};
        
        // Override console object
        Object.defineProperty(window, 'console', {
            get: function() {
                return {
                    log: function() {},
                    info: function() {},
                    warn: function() {},
                    error: function() {},
                    debug: function() {}
                };
            },
            set: function() {}
        });
    };
    
    // Apply console protection
    try {
        disableConsole();
    } catch (e) {
        // Fallback if console override fails
    }
    
    // Disable view source
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showSecurityMessage('View source is disabled.');
            return false;
        }
    });
    
    // Additional protection: Disable image dragging
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    });
    
    // Disable iframe access
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
    
    console.log('🔒 Security protection activated');
    
})(); 