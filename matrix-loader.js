/* ---------- ENHANCED MATRIX STYLE LOADER SYSTEM ---------- */

let matrixCanvas, matrixCtx;
let matrixSymbols = [];
let matrixColumns = [];
let isTyping = false;
let currentText = '';
let targetText = 'Hello Neo';
let typingIndex = 0;
let matrixRevealProgress = 0;
let brightnessLevel = 1;
let colorPhase = 'green'; // 'green' -> 'brightening' -> 'blue' -> 'fade'
let glitchEffect = 0;
let pulseIntensity = 1;
let animationId = null;

// Enhanced matrix symbols with more authentic characters
const MATRIX_CHARS = [
    // Japanese Katakana (authentic Matrix characters)
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
    // Numbers and symbols
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    // Some ASCII for variety
    'Z', 'I', 'O', 'N', ':', '¦', '"', '=', '*', '+', '<', '>', '¡', '¿'
];

// Easing functions for smooth animations
const easing = {
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeIn: (t) => t * t * t,
    bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
};

function initMatrixLoader() {
    console.log('Initializing Matrix Loader...');
    
    // Create matrix canvas
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixCanvas.style.position = 'absolute';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.zIndex = '5';
    matrixCanvas.style.pointerEvents = 'none';
    matrixCanvas.classList.add('matrix-canvas');
    
    const loader = document.getElementById('loader');
    if (loader) {
        loader.appendChild(matrixCanvas);
    }
    
    matrixCtx = matrixCanvas.getContext('2d');
    
    // Initialize matrix symbols
    initMatrixSymbols();
    
    // Start the sequence
    startMatrixSequence();
    
    // Handle resize
    window.addEventListener('resize', handleMatrixResize);
}

function initMatrixSymbols() {
    matrixSymbols = [];
    matrixColumns = [];
    
    const fontSize = 18;
    const columnWidth = fontSize * 0.8;
    const columns = Math.floor(matrixCanvas.width / columnWidth);
    
    // Create columns first for better organization
    for (let i = 0; i < columns; i++) {
        const column = {
            x: i * columnWidth,
            symbols: [],
            speed: 2 + Math.random() * 6,
            lastSymbolTime: 0,
            symbolInterval: 100 + Math.random() * 200, // Varied timing for more authentic feel
            brightness: 0.3 + Math.random() * 0.7,
            glitchChance: 0.001 + Math.random() * 0.003
        };
        
        // Initialize with some symbols
        const initialSymbols = Math.floor(Math.random() * 8) + 3;
        for (let j = 0; j < initialSymbols; j++) {
            column.symbols.push({
                char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
                y: j * -fontSize * 1.2 - Math.random() * matrixCanvas.height,
                age: Math.random() * 100,
                opacity: Math.random() * 0.8 + 0.2,
                size: fontSize + Math.random() * 4 - 2,
                glitchFrame: 0,
                isGlitching: false
            });
        }
        
        matrixColumns.push(column);
    }
    
    // Legacy symbol array for compatibility (now enhanced)
    for (const column of matrixColumns) {
        for (const symbol of column.symbols) {
            matrixSymbols.push({
                x: column.x,
                y: symbol.y,
                speed: column.speed,
                symbol: symbol.char,
                opacity: symbol.opacity,
                trail: [],
                column: column,
                symbolData: symbol
            });
        }
    }
}

function startMatrixSequence() {
    // Add click listener for manual wake up
    document.addEventListener('click', function wakeUpClick() {
        if (!isTyping && currentText === '') {
            // Skip to typing if clicked before auto-start
            isTyping = true;
            startTyping();
            document.removeEventListener('click', wakeUpClick);
        } else if (currentText === targetText && matrixRevealProgress === 0) {
            // Start reveal if clicked after typing is complete
            startMatrixReveal();
            document.removeEventListener('click', wakeUpClick);
        }
    });
    
    // Start typing after extended delay (auto-start) - Extended to 20 seconds as requested
    setTimeout(() => {
        if (!isTyping) {
            isTyping = true;
            startTyping();
        }
    }, 20000); // Extended to 20 seconds to give user time to click
}

function startTyping() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;
    
    function typeNextChar() {
        if (typingIndex < targetText.length) {
            currentText += targetText[typingIndex];
            typingText.innerHTML = currentText + '<span class="cursor">|</span>';
            typingIndex++;
            
            setTimeout(typeNextChar, 120); // Slightly faster typing
        } else {
            // Remove cursor after typing is complete
            typingText.innerHTML = currentText;
            
            // Typing complete, start matrix reveal
            setTimeout(() => {
                startMatrixReveal();
            }, 800);
        }
    }
    
    typeNextChar();
}

function startMatrixReveal() {
    console.log('Starting Enhanced Matrix Reveal...');
    
    // Show website content behind the matrix
    const websiteContent = document.getElementById('website-content');
    if (websiteContent) {
        websiteContent.style.display = 'block';
        websiteContent.style.opacity = '1';
    }
    
    let startTime = Date.now();
    
    // Enhanced matrix animation with smoother transitions
    function animateMatrix() {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTime;
        
        // Update color phase and brightness with easing
        updateColorPhase();
        
        // Update pulse and glitch effects
        pulseIntensity = 1 + Math.sin(deltaTime * 0.005) * 0.3;
        glitchEffect = Math.sin(deltaTime * 0.01) * 0.1;
        
        // Clear canvas with gradient for depth
        const gradient = matrixCtx.createLinearGradient(0, 0, 0, matrixCanvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 5, 0, 0.98)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        matrixCtx.fillStyle = gradient;
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        // Update matrix columns with enhanced physics
        updateMatrixColumns(deltaTime);
        
        // Draw visible matrix symbols with enhanced effects
        if (colorPhase !== 'green' || matrixRevealProgress > 0.1) {
            drawEnhancedMatrixSymbols();
        }
        
        // Create cutout effect for website reveal
        if (matrixRevealProgress > 0.2) {
            createMatrixCutouts();
        }
        
        // Smooth progress increase with easing
        const progressSpeed = colorPhase === 'blue' ? 0.008 : 0.004;
        matrixRevealProgress += progressSpeed * easing.easeInOut(Math.min(1, deltaTime / 3000));
        
        // Continue animation
        if (matrixRevealProgress < 1) {
            animationId = requestAnimationFrame(animateMatrix);
        } else {
            // Matrix reveal complete with smooth transition
            setTimeout(() => {
                completeMatrixReveal();
            }, 800);
        }
    }
    
    animationId = requestAnimationFrame(animateMatrix);
}

function updateColorPhase() {
    const easedProgress = easing.easeInOut(matrixRevealProgress);
    
    if (easedProgress < 0.25) {
        colorPhase = 'green';
        brightnessLevel = 1 + easedProgress * 2; // Subtle brightening
    } else if (easedProgress < 0.5) {
        colorPhase = 'brightening';
        // Smooth brightness increase with pulse
        const brightPhase = (easedProgress - 0.25) / 0.25;
        brightnessLevel = 3 + brightPhase * 8 * pulseIntensity; // Gets very bright with pulse
    } else if (easedProgress < 0.8) {
        colorPhase = 'blue';
        // Smooth transition to blue with maintained brightness
        const bluePhase = (easedProgress - 0.5) / 0.3;
        brightnessLevel = (8 - bluePhase * 3) * pulseIntensity; // Bright blue transition
    } else {
        colorPhase = 'fade';
        // Gentle fade with easing
        const fadePhase = (easedProgress - 0.8) / 0.2;
        brightnessLevel = Math.max(0.2, (5 - fadePhase * 4.8) * easing.easeOut(1 - fadePhase));
    }
    
    // Update global variables
    window.matrixRevealProgress = matrixRevealProgress;
    window.colorPhase = colorPhase;
    window.brightnessLevel = brightnessLevel;
}

// Enhanced matrix column update system
function updateMatrixColumns(deltaTime) {
    matrixColumns.forEach(column => {
        // Update each symbol in the column
        column.symbols.forEach((symbol, index) => {
            symbol.y += column.speed * (0.5 + Math.sin(deltaTime * 0.001 + column.x * 0.01) * 0.3);
            symbol.age += 1;
            
            // Handle glitch effects
            if (Math.random() < column.glitchChance) {
                symbol.isGlitching = true;
                symbol.glitchFrame = 20;
                symbol.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            }
            
            if (symbol.isGlitching) {
                symbol.glitchFrame--;
                if (symbol.glitchFrame <= 0) {
                    symbol.isGlitching = false;
                }
            }
            
            // Symbol recycling - more authentic spacing
            if (symbol.y > matrixCanvas.height + symbol.size) {
                symbol.y = -symbol.size - Math.random() * 200;
                symbol.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                symbol.age = 0;
                symbol.opacity = 0.4 + Math.random() * 0.6;
                symbol.size = 16 + Math.random() * 6;
            }
        });
        
        // Add new symbols occasionally for dynamic effect
        if (Math.random() < 0.005 && column.symbols.length < 12) {
            column.symbols.push({
                char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
                y: -20 - Math.random() * 100,
                age: 0,
                opacity: 0.5 + Math.random() * 0.5,
                size: 16 + Math.random() * 6,
                glitchFrame: 0,
                isGlitching: false
            });
        }
    });
}

// Enhanced matrix symbol drawing with realistic effects
function drawEnhancedMatrixSymbols() {
    matrixColumns.forEach(column => {
        column.symbols.forEach((symbol, index) => {
            const isLeadSymbol = index === column.symbols.length - 1;
            let color, shadowColor, shadowBlur;
            
            // Calculate color based on phase with smooth transitions
            if (colorPhase === 'green' || colorPhase === 'brightening') {
                const intensity = Math.min(255, 80 + brightnessLevel * 40);
                const green = Math.min(255, 120 + brightnessLevel * 50);
                color = `rgba(${Math.floor(intensity * 0.3)}, ${Math.floor(green)}, ${Math.floor(intensity * 0.3)}, ${symbol.opacity})`;
                shadowColor = `rgba(0, ${Math.floor(green * 0.8)}, 0, 0.8)`;
                shadowBlur = brightnessLevel * 3;
            } else if (colorPhase === 'blue') {
                // Smooth green to blue transition
                const blueProgress = Math.min(1, (matrixRevealProgress - 0.5) / 0.3);
                const red = Math.floor(20 + blueProgress * 30);
                const green = Math.floor(255 - blueProgress * 180);
                const blue = Math.floor(100 + blueProgress * 155);
                const intensity = brightnessLevel * 60;
                
                color = `rgba(${Math.floor(red + intensity * 0.2)}, ${Math.floor(green + intensity * 0.3)}, ${Math.floor(blue + intensity * 0.5)}, ${symbol.opacity})`;
                shadowColor = `rgba(${red}, ${green}, ${blue}, 0.6)`;
                shadowBlur = brightnessLevel * 4;
            } else { // fade
                const fadeAlpha = symbol.opacity * brightnessLevel * 0.2;
                color = `rgba(100, 150, 255, ${fadeAlpha})`;
                shadowColor = `rgba(50, 100, 200, ${fadeAlpha * 0.5})`;
                shadowBlur = 2;
            }
            
            // Apply glitch effect
            let x = column.x;
            if (symbol.isGlitching) {
                x += (Math.random() - 0.5) * 4;
                shadowBlur *= 2;
            }
            
            // Enhanced drawing with glow effect
            matrixCtx.font = `${Math.floor(symbol.size)}px 'Courier New', monospace`;
            matrixCtx.textAlign = 'center';
            
            // Draw glow/shadow first
            if (shadowBlur > 0) {
                matrixCtx.shadowColor = shadowColor;
                matrixCtx.shadowBlur = shadowBlur;
                matrixCtx.globalAlpha = 0.6;
                matrixCtx.fillStyle = shadowColor;
                matrixCtx.fillText(symbol.char, x + symbol.size * 0.5, symbol.y);
            }
            
            // Draw main character
            matrixCtx.shadowBlur = 0;
            matrixCtx.globalAlpha = symbol.opacity;
            matrixCtx.fillStyle = color;
            matrixCtx.fillText(symbol.char, x + symbol.size * 0.5, symbol.y);
            
            // Lead symbol gets extra brightness
            if (isLeadSymbol && (colorPhase === 'brightening' || colorPhase === 'blue')) {
                matrixCtx.globalAlpha = Math.min(1, symbol.opacity + 0.4);
                matrixCtx.fillStyle = colorPhase === 'blue' ? 
                    'rgba(150, 200, 255, 0.8)' : 'rgba(150, 255, 150, 0.8)';
                matrixCtx.fillText(symbol.char, x + symbol.size * 0.5, symbol.y);
            }
        });
    });
    
    // Reset drawing state
    matrixCtx.globalAlpha = 1;
    matrixCtx.shadowBlur = 0;
    matrixCtx.textAlign = 'start';
}

// Create cutout effects for smooth website reveal
function createMatrixCutouts() {
    matrixCtx.globalCompositeOperation = 'destination-out';
    
    matrixColumns.forEach(column => {
        column.symbols.forEach(symbol => {
            // Create expanding cutouts as animation progresses
            const cutoutSize = (matrixRevealProgress - 0.2) * 30;
            if (cutoutSize > 0) {
                const cutoutOpacity = Math.min(1, cutoutSize / 20);
                matrixCtx.globalAlpha = cutoutOpacity;
                matrixCtx.beginPath();
                matrixCtx.arc(
                    column.x + symbol.size * 0.5, 
                    symbol.y - symbol.size * 0.5, 
                    cutoutSize, 
                    0, 
                    Math.PI * 2
                );
                matrixCtx.fillStyle = 'rgba(255, 255, 255, 1)';
                matrixCtx.fill();
            }
        });
    });
    
    // Reset composite operation and alpha
    matrixCtx.globalCompositeOperation = 'source-over';
    matrixCtx.globalAlpha = 1;
}

// Legacy function removed - replaced by drawEnhancedMatrixSymbols

function completeMatrixReveal() {
    console.log('Enhanced Matrix Reveal Complete');
    
    // Cancel any ongoing animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Smooth fade out with CSS transitions for better performance
    if (matrixCanvas) {
        matrixCanvas.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        matrixCanvas.style.opacity = '0';
        
        // Use CSS transition end event for precise timing
        const handleTransitionEnd = () => {
            matrixCanvas.removeEventListener('transitionend', handleTransitionEnd);
            
            // Remove matrix canvas
            if (matrixCanvas && matrixCanvas.parentNode) {
                matrixCanvas.parentNode.removeChild(matrixCanvas);
            }
            
            // Final website content reveal with enhanced animation
            const websiteContent = document.getElementById('website-content');
            if (websiteContent) {
                websiteContent.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                websiteContent.classList.add('revealed');
            }
            
            // Hide loader with smooth transition
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.transition = 'opacity 0.5s ease-out';
                loader.style.opacity = '0';
                
                setTimeout(() => {
                    loader.style.display = 'none';
                    loader.style.visibility = 'hidden';
                }, 500);
            }
        };
        
        matrixCanvas.addEventListener('transitionend', handleTransitionEnd);
        
        // Fallback in case transition doesn't fire
        setTimeout(handleTransitionEnd, 1500);
    }
}

function handleMatrixResize() {
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        initMatrixSymbols();
    }
}

function cleanupMatrix() {
    // Cancel any ongoing animations
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Remove canvas and event listeners
    if (matrixCanvas && matrixCanvas.parentNode) {
        matrixCanvas.parentNode.removeChild(matrixCanvas);
    }
    window.removeEventListener('resize', handleMatrixResize);
    
    // Reset state variables
    matrixRevealProgress = 0;
    brightnessLevel = 1;
    colorPhase = 'green';
    glitchEffect = 0;
    pulseIntensity = 1;
    
    console.log('Enhanced Matrix cleanup complete');
}

// Make functions and variables globally available
window.initMatrixLoader = initMatrixLoader;
window.cleanupMatrix = cleanupMatrix;
window.matrixRevealProgress = matrixRevealProgress;
window.colorPhase = colorPhase;
window.brightnessLevel = brightnessLevel; 