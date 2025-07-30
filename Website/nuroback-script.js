// Brain Studio - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initLoader();
    initAINetwork();
    initScrollAnimations();

    initNavigation();
    initContactForm();
    initSmoothScrolling();
    
    // Loader Animation - Optimized
    function initLoader() {
        const loader = document.getElementById('loader');
        const progressBar = document.querySelector('.loading-progress');
        const percentageText = document.querySelector('.loading-percentage');
        const websiteContent = document.getElementById('website-content');
        const aiLoader = document.querySelector('.ai-loader');
        const aiNodes = document.querySelectorAll('.ai-node');
        
        if (!loader) return;
        
        let progress = 0;
        const targetProgress = 100;
        const duration = 1000; // Reduced to 1 second for faster loading
        const interval = 25; // Update every 25ms for smoother animation
        const increment = (targetProgress / (duration / interval));
        
        // Start the loading animation
        const loadingInterval = setInterval(() => {
            progress += increment;
            const currentProgress = Math.min(progress, 100);
            
            if (progressBar) {
                progressBar.style.width = `${currentProgress}%`;
            }
            
            if (percentageText) {
                percentageText.textContent = `${Math.round(currentProgress)}%`;
            }
            
            // Gradually increase lighting intensity around the icon
            const glowIntensity = 0.1 + (currentProgress / 100) * 0.9; // 0.1 to 1.0
            const glowSize = 300 + (currentProgress / 100) * 200; // 300px to 500px
            
            // Update the glow effects
            loader.style.setProperty('--glow-intensity', glowIntensity);
            loader.style.setProperty('--glow-size', `${glowSize}px`);
            
            // AI loader growth animation
            if (aiLoader) {
                const scale = 1 + (currentProgress / 100) * 0.5; // Grow from 1x to 1.5x
                aiLoader.style.transform = `scale(${scale})`;
                aiLoader.style.transition = 'transform 0.3s ease';
            }
            
            // AI nodes growth animation
            aiNodes.forEach((node, index) => {
                const scale = 0.9 + (currentProgress / 100) * 0.3; // Grow from 0.9x to 1.2x
                const delay = index * 0.1; // Stagger the animation
                node.style.transform = `scale(${scale})`;
                node.style.transition = `transform 0.3s ease ${delay}s`;
            });
            
            // Add power-up effects at specific milestones
            if (currentProgress > 25 && currentProgress < 26) {
                loader.style.filter = 'brightness(1.1)';
                setTimeout(() => loader.style.filter = 'brightness(1)', 200);
            }
            
            if (currentProgress > 50 && currentProgress < 51) {
                loader.style.filter = 'brightness(1.2)';
                setTimeout(() => loader.style.filter = 'brightness(1)', 300);
            }
            
            if (currentProgress > 75 && currentProgress < 76) {
                loader.style.filter = 'brightness(1.3)';
                setTimeout(() => loader.style.filter = 'brightness(1)', 400);
            }
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                
                // Final power-up effect
                loader.style.filter = 'brightness(1.5)';
                
                // Trigger the reveal animation
                setTimeout(() => {
                    loader.classList.add('reveal');
                    
                    // Show website content with animation
                    if (websiteContent) {
                        websiteContent.classList.add('revealed');
                    }
                    
                    // Remove loader after animation
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 1500);
                }, 300);
            }
        }, interval);
        
        // Fallback: hide loader if something goes wrong
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.classList.add('hidden');
                if (websiteContent) {
                    websiteContent.classList.add('revealed');
                }
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 600);
            }
        }, 12000);
    }
    
    // AI Network Canvas Animation
    function initAINetwork() {
        const canvas = document.getElementById('aiCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const nodes = [];
        const connections = [];
        const nodeCount = 80;
        const maxConnectionDistance = 180;
        let performanceMode = false;
        let frameTime = 0;
        let lastFrameTime = 0;
        const mouse = { 
            x: 0, 
            y: 0, 
            isMoving: false,
            velocity: { x: 0, y: 0 },
            lastX: 0,
            lastY: 0,
            trail: [],
            moveTimeout: null,
            lastMoveTime: 0
        };
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Initialize nodes
        function initNodes() {
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 3 + 1,
                    pulse: Math.random() * Math.PI * 2,
                    originalSize: Math.random() * 3 + 1,
                    targetSize: Math.random() * 3 + 1,
                    interactionRadius: 80,
                    attractionForce: 0.01
                });
            }
        }
        
        // Update node positions
        function updateNodes() {
            // First pass: Calculate node-to-node repulsion forces
            const repulsionForces = new Array(nodes.length).fill().map(() => ({ vx: 0, vy: 0 }));
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeA = nodes[i];
                    const nodeB = nodes[j];
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Apply repulsion force when nodes are too close
                    if (distance > 0 && distance < 60) {
                        const repulsionStrength = (60 - distance) / 60; // Stronger when closer
                        const force = repulsionStrength * 0.15; // Soft repulsion force
                        
                        // Normalize direction and apply force
                        const normalizedDx = dx / distance;
                        const normalizedDy = dy / distance;
                        
                        // Apply repulsion to both nodes (opposite directions)
                        repulsionForces[i].vx -= normalizedDx * force;
                        repulsionForces[i].vy -= normalizedDy * force;
                        repulsionForces[j].vx += normalizedDx * force;
                        repulsionForces[j].vy += normalizedDy * force;
                    }
                }
            }
            
            // Second pass: Update each node with all forces
            nodes.forEach((node, index) => {
                // Apply accumulated repulsion forces
                node.vx += repulsionForces[index].vx;
                node.vy += repulsionForces[index].vy;
                
                // Calculate distance to mouse
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Enhanced mouse interaction - only when mouse is actually moving
                if (distance < node.interactionRadius && mouse.isMoving) {
                    // Only apply forces when mouse is actively moving
                    const force = node.attractionForce * (1 - distance / node.interactionRadius) * 0.8;
                    node.vx += dx * force * 0.01;
                    node.vy += dy * force * 0.01;
                    
                    // Enhanced scaling based on proximity
                    const scaleFactor = 2.5;
                    node.targetSize = node.originalSize * (1 + (1 - distance / node.interactionRadius) * scaleFactor);
                    
                    // Add repulsion effect for very close nodes to mouse
                    if (distance < 30) {
                        const repulsionForce = (30 - distance) * 0.02;
                        node.vx -= dx * repulsionForce;
                        node.vy -= dy * repulsionForce;
                    }
                } else {
                    node.targetSize = node.originalSize;
                }
                
                // Smooth size transition
                node.size += (node.targetSize - node.size) * 0.1;
                
                // Enhanced constant movement (always active)
                const time = Date.now() * 0.001;
                const noiseX = Math.sin(time + node.x * 0.01) * 0.3;
                const noiseY = Math.cos(time + node.y * 0.01) * 0.3;
                
                // Add wave-like movement
                node.vx += noiseX * 0.02;
                node.vy += noiseY * 0.02;
                
                // Add random movement for more liveliness
                node.vx += (Math.random() - 0.5) * 0.015;
                node.vy += (Math.random() - 0.5) * 0.015;
                
                // Move nodes with dampening
                node.x += node.vx;
                node.y += node.vy;
                
                // Softer dampening for more movement
                node.vx *= 0.98;
                node.vy *= 0.98;
                
                // Higher velocity limits for more dynamic movement
                const maxVel = 2.5;
                node.vx = Math.max(-maxVel, Math.min(maxVel, node.vx));
                node.vy = Math.max(-maxVel, Math.min(maxVel, node.vy));
                
                // Bounce off edges with more energy
                if (node.x < 0 || node.x > canvas.width) {
                    node.vx *= -0.8;
                    node.x = Math.max(0, Math.min(canvas.width, node.x));
                }
                if (node.y < 0 || node.y > canvas.height) {
                    node.vy *= -0.8;
                    node.y = Math.max(0, Math.min(canvas.height, node.y));
                }
                
                // Faster pulse for more dynamic feel
                node.pulse += 0.025;
            });
        }
        
        // Draw connections between nearby nodes
        function drawConnections() {
            const time = Date.now() * 0.001;
            let connectionCount = 0;
            const maxConnections = 200; // Limit connections to prevent performance issues
            
            for (let i = 0; i < nodes.length && connectionCount < maxConnections; i++) {
                for (let j = i + 1; j < nodes.length && connectionCount < maxConnections; j++) {
                    const nodeA = nodes[i];
                    const nodeB = nodes[j];
                    const distance = Math.sqrt(
                        Math.pow(nodeA.x - nodeB.x, 2) + 
                        Math.pow(nodeA.y - nodeB.y, 2)
                    );
                    
                    if (distance < maxConnectionDistance) {
                        connectionCount++;
                        const opacity = 1 - (distance / maxConnectionDistance);
                        const alpha = opacity * 0.6;
                        
                        // Add pulsing effect to connections
                        const pulse = Math.sin(time * 2 + i * 0.5 + j * 0.3) * 0.2 + 0.8;
                        const finalAlpha = alpha * pulse;
                        
                        // Create enhanced gradient for connections
                        const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
                        gradient.addColorStop(0, `rgba(0, 102, 255, ${finalAlpha})`);
                        gradient.addColorStop(0.5, `rgba(77, 148, 255, ${finalAlpha * 1.2})`);
                        gradient.addColorStop(1, `rgba(0, 102, 255, ${finalAlpha})`);
                        
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = opacity * 2.5;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.stroke();
                        
                        // Add subtle glow effect
                        ctx.shadowColor = 'rgba(0, 102, 255, 0.3)';
                        ctx.shadowBlur = 5;
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                }
            }
            
            // Enhanced connections from mouse to nearby nodes
            if (mouse.isMoving) {
                let mouseConnectionCount = 0;
                const maxMouseConnections = 15; // Limit mouse connections for performance
                
                nodes.forEach(node => {
                    if (mouseConnectionCount >= maxMouseConnections) return;
                    
                    const dx = mouse.x - node.x;
                    const dy = mouse.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        mouseConnectionCount++;
                        const opacity = (1 - distance / 150) * 0.9;
                        const pulse = Math.sin(time * 4) * 0.3 + 0.7;
                        const finalOpacity = opacity * pulse;
                        
                        // Create energy connection gradient
                        const gradient = ctx.createLinearGradient(mouse.x, mouse.y, node.x, node.y);
                        gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`);
                        gradient.addColorStop(0.5, `rgba(0, 102, 255, ${finalOpacity * 0.8})`);
                        gradient.addColorStop(1, `rgba(77, 148, 255, ${finalOpacity * 0.6})`);
                        
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = finalOpacity * 2.5;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(node.x, node.y);
                        ctx.stroke();
                        
                        // Add energy glow
                        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                        ctx.shadowBlur = 8;
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                });
            }
        }
        
        // Draw mouse trail
        function drawMouseTrail() {
            if (mouse.trail.length > 1) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                // Create smooth curve using quadratic bezier interpolation
                const points = mouse.trail.filter(point => {
                    const age = (Date.now() - point.time) / 1000;
                    return age < 1.5; // Only show recent points
                });
                
                if (points.length < 2) return;
                
                // Draw main trail with smooth curve
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                // Use quadratic bezier curves for smoother lines
                for (let i = 1; i < points.length - 1; i++) {
                    const current = points[i];
                    const next = points[i + 1];
                    
                    // Calculate control point for smooth curve
                    const cpX = (current.x + next.x) / 2;
                    const cpY = (current.y + next.y) / 2;
                    
                    ctx.quadraticCurveTo(current.x, current.y, cpX, cpY);
                }
                
                // Connect to the last point
                if (points.length > 1) {
                    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                }
                
                // Create flowing gradient for the entire trail
                const firstPoint = points[0];
                const lastPoint = points[points.length - 1];
                const gradient = ctx.createLinearGradient(
                    firstPoint.x, firstPoint.y, lastPoint.x, lastPoint.y
                );
                
                // Enhanced color stops for more fluid appearance
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
                gradient.addColorStop(0.15, 'rgba(0, 255, 255, 0.95)');
                gradient.addColorStop(0.3, 'rgba(0, 200, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.8)');
                gradient.addColorStop(0.7, 'rgba(0, 100, 255, 0.6)');
                gradient.addColorStop(0.85, 'rgba(0, 50, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 0, 255, 0.1)');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 4;
                
                // Enhanced glow effect
                ctx.shadowColor = 'rgba(0, 200, 255, 0.8)';
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                // Draw secondary trail with different opacity for depth
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length - 1; i++) {
                    const current = points[i];
                    const next = points[i + 1];
                    const cpX = (current.x + next.x) / 2;
                    const cpY = (current.y + next.y) / 2;
                    ctx.quadraticCurveTo(current.x, current.y, cpX, cpY);
                }
                
                if (points.length > 1) {
                    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                }
                
                // Secondary trail with different color
                const secondaryGradient = ctx.createLinearGradient(
                    firstPoint.x, firstPoint.y, lastPoint.x, lastPoint.y
                );
                secondaryGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                secondaryGradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.4)');
                secondaryGradient.addColorStop(1, 'rgba(0, 100, 255, 0.2)');
                
                ctx.strokeStyle = secondaryGradient;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Add flowing energy particles with improved positioning
                if (mouse.isMoving && points.length > 0) {
                    const currentPoint = points[points.length - 1];
                    const velocity = currentPoint.velocity || 0;
                    const particleCount = Math.min(12, Math.floor(velocity / 6) + 4);
                    
                    // Draw particles along the smooth trail path
                    for (let i = 0; i < particleCount; i++) {
                        const trailProgress = i / particleCount;
                        const trailIndex = Math.floor(trailProgress * (points.length - 1));
                        
                        if (trailIndex < points.length - 1) {
                            const point = points[trailIndex];
                            const nextPoint = points[trailIndex + 1];
                            
                            // Smooth interpolation along trail segment
                            const t = (trailProgress * (points.length - 1)) % 1;
                            const x = point.x + (nextPoint.x - point.x) * t;
                            const y = point.y + (nextPoint.y - point.y) * t;
                            
                            // Dynamic particle size based on position
                            const size = (1 - trailProgress) * 3 + 0.5;
                            const particleOpacity = (1 - trailProgress) * 0.9 + 0.1;
                            
                            // Enhanced particle glow
                            ctx.shadowColor = 'rgba(0, 255, 255, 0.9)';
                            ctx.shadowBlur = size * 6;
                            ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`;
                            ctx.beginPath();
                            ctx.arc(x, y, size, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        }
                    }
                }
                
                // Add subtle sparkle effect at the trail head
                if (mouse.isMoving && points.length > 0) {
                    const headPoint = points[points.length - 1];
                    const sparkleCount = 3;
                    
                    for (let i = 0; i < sparkleCount; i++) {
                        const angle = (Date.now() * 0.01 + i * Math.PI * 2 / sparkleCount) % (Math.PI * 2);
                        const radius = 8 + Math.sin(Date.now() * 0.02 + i) * 3;
                        const x = headPoint.x + Math.cos(angle) * radius;
                        const y = headPoint.y + Math.sin(angle) * radius;
                        
                        const sparkleOpacity = 0.7 + Math.sin(Date.now() * 0.03 + i) * 0.3;
                        
                        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                        ctx.shadowBlur = 4;
                        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleOpacity})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 1, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }
        
        // Draw nodes
        function drawNodes() {
            nodes.forEach(node => {
                const pulseSize = Math.sin(node.pulse) * 0.5 + 1;
                const size = node.size * pulseSize;
                
                // Enhanced glow effect
                const gradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, size * 4
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.3, 'rgba(0, 102, 255, 0.8)');
                gradient.addColorStop(0.7, 'rgba(0, 102, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size * 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Core node
                ctx.fillStyle = 'rgba(0, 102, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Enhanced mouse interaction with smoother trail
        function handleMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            
            // Calculate mouse velocity for enhanced interaction
            mouse.velocity.x = newX - mouse.x;
            mouse.velocity.y = newY - mouse.y;
            
            // Update mouse position
            mouse.x = newX;
            mouse.y = newY;
            
            // Enhanced trail point management for smoother animation
            const velocity = Math.sqrt(mouse.velocity.x * mouse.velocity.x + mouse.velocity.y * mouse.velocity.y);
            
            // Adaptive point addition based on velocity and time
            const lastPoint = mouse.trail[mouse.trail.length - 1];
            const timeSinceLastPoint = lastPoint ? Date.now() - lastPoint.time : 1000;
            const distanceFromLastPoint = lastPoint ? 
                Math.sqrt(Math.pow(mouse.x - lastPoint.x, 2) + Math.pow(mouse.y - lastPoint.y, 2)) : 100;
            
            // More responsive point addition for smoother curves
            const shouldAddPoint = velocity > 1.5 || 
                                 timeSinceLastPoint > 30 || 
                                 distanceFromLastPoint > 8;
            
            if (shouldAddPoint) {
                // Add point with enhanced data for smoother rendering
                mouse.trail.push({ 
                    x: mouse.x, 
                    y: mouse.y, 
                    time: Date.now(),
                    velocity: velocity,
                    pressure: Math.min(1, velocity / 10) // Add pressure data for line width variation
                });
                
                // Optimize trail length for performance and smoothness
                const optimalLength = Math.max(12, Math.min(20, Math.floor(velocity / 2) + 8));
                if (mouse.trail.length > optimalLength) {
                    mouse.trail.shift();
                }
            }
            
            // Enhanced moving state detection
            mouse.isMoving = true;
            
            // Adaptive timeout based on velocity
            const timeoutDuration = Math.max(100, Math.min(300, 200 - velocity * 10));
            clearTimeout(mouse.moveTimeout);
            mouse.moveTimeout = setTimeout(() => {
                mouse.isMoving = false;
            }, timeoutDuration);
        }
        
        // Enhanced mouse enter
        function handleMouseEnter() {
            nodes.forEach(node => {
                node.interactionRadius = 150;
                // Don't add energy burst - just enable interaction
            });
        }
        
        // Enhanced mouse leave
        function handleMouseLeave() {
            mouse.isMoving = false;
            mouse.trail = [];
            nodes.forEach(node => {
                node.interactionRadius = 100;
                // Add a gentle repulsion effect when mouse leaves
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const dx = centerX - node.x;
                const dy = centerY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0) {
                    node.vx += (dx / distance) * 0.5;
                    node.vy += (dy / distance) * 0.5;
                }
            });
        }
        
        // Animation loop
        function animate() {
            const startTime = performance.now();
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            updateNodes();
            drawConnections();
            drawMouseTrail();
            drawNodes();
            
            // Performance monitoring
            frameTime = performance.now() - startTime;
            
            // Adjust performance mode based on frame time
            if (frameTime > 16.67) { // If frame time > 60fps threshold
                if (!performanceMode) {
                    performanceMode = true;
                    // Reduce connection distance when performance is poor
                    maxConnectionDistance = Math.max(120, maxConnectionDistance - 20);
                }
            } else if (frameTime < 12 && performanceMode) { // If performance is good
                performanceMode = false;
                // Gradually restore connection distance
                maxConnectionDistance = Math.min(180, maxConnectionDistance + 10);
            }
            
            lastFrameTime = frameTime;
            requestAnimationFrame(animate);
        }
        
        // Initialize
        resizeCanvas();
        initNodes();
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseenter', handleMouseEnter);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', resizeCanvas);
        animate();
    }
    
    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe all fade sections
        const fadeSections = document.querySelectorAll('.fade-section');
        fadeSections.forEach(section => observer.observe(section));
        
        // Optimized parallax effect for hero section
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const hero = document.querySelector('.hero');
                    if (hero) {
                        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    

    
    // Navigation
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default for external links
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    // Allow external navigation
                    return;
                }
                
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            }
        });
    }
    
    // Contact form
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only prevent default for actual anchor links, not external links
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    
                    const targetId = href;
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#0066ff';
                notification.style.color = '#ffffff';
                break;
            case 'error':
                notification.style.background = '#ff4757';
                break;
            default:
                notification.style.background = '#3742fa';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Service card hover effects
    function initServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Team member hover effects
    function initTeamMemberEffects() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                member.style.transform = 'translateY(-10px)';
            });
            
            member.addEventListener('mouseleave', () => {
                member.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Initialize additional effects
    initServiceCardEffects();
    initTeamMemberEffects();
    
    // Performance optimization: Throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(() => {
        // Scroll-based effects can be added here
    }, 16)); // ~60fps
    

    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
    

    
    console.log('🤖 AI Nexus initialized successfully!');
}); 