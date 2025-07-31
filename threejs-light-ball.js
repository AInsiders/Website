/* ---------- THREE.JS LIGHT BALL SYSTEM ---------- */

let scene, camera, renderer, sphere, sphereMat, pointLight, floor;
let animationId = null;

function initThreeJsLightBall() {
    console.log('Initializing Three.js Light Ball...');
    
    /* ---------- SCENE SETUP ---------- */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 3, 6);

    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.classList.add('threejs-canvas');
    
    const loader = document.getElementById('loader');
    if (loader) {
        loader.appendChild(renderer.domElement);
        console.log('Three.js canvas added to loader');
    } else {
        console.error('Loader element not found!');
    }

    /* ---------- AMBIENT LIGHTING ---------- */
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    /* ---------- FLOOR (VISIBLE ONLY WHEN LIT) ---------- */
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.9,
            metalness: 0
        })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    /* ---------- GLOWING, PULSING SPHERE ---------- */
    sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 15,   // much brighter glow
        roughness: 0.1,
        metalness: 0.1
    });
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 64, 64),  // even larger sphere
        sphereMat
    );
    sphere.position.y = 2;     // hover height
    scene.add(sphere);

    /* Light emitted from the sphere */
    pointLight = new THREE.PointLight(0xffffff, 120, 30, 2);
    sphere.add(pointLight);

    /* ---------- ANIMATION LOOP ---------- */
    const clock = new THREE.Clock();

    function animate() {
        animationId = requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        // Slow pulse every 3 s (scale, glow, light intensity)
        const pulseFactor = 0.8 + 0.4 * (0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 3));
        sphere.scale.setScalar(pulseFactor);
        sphereMat.emissiveIntensity = 15 * pulseFactor;
        pointLight.intensity = 120 * pulseFactor;

        // Gentle bobbing to feel "hovering"
        sphere.position.y = 2 + 0.1 * Math.sin(2 * t);

        renderer.render(scene, camera);
    }
    animate();

    /* ---------- HANDLE RESIZE ---------- */
    window.addEventListener("resize", handleResize);
}

function handleResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function startThreeJsExplosion() {
    if (!sphere || !sphereMat || !pointLight) return;
    
    // Create explosion animation
    const startTime = Date.now();
    const explosionDuration = 1200; // 1.2 seconds
    
    function explosionAnimate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / explosionDuration, 1);
        
        // Explosion effect
        const explosionScale = 1 + progress * 20; // Scale up dramatically
        sphere.scale.setScalar(explosionScale);
        
        // Intense glow during explosion
        sphereMat.emissiveIntensity = 5 + progress * 50;
        pointLight.intensity = 50 + progress * 200;
        
        // Color shift to blue during explosion
        const blueIntensity = progress * 0.8;
        sphereMat.color.setRGB(1 - blueIntensity, 1 - blueIntensity, 1);
        sphereMat.emissive.setRGB(1 - blueIntensity, 1 - blueIntensity, 1);
        pointLight.color.setRGB(1 - blueIntensity, 1 - blueIntensity, 1);
        
        // Fade out at the end
        if (progress > 0.7) {
            const fadeProgress = (progress - 0.7) / 0.3;
            sphereMat.opacity = 1 - fadeProgress;
            sphereMat.transparent = true;
        }
        
        renderer.render(scene, camera);
        
        if (progress < 1) {
            requestAnimationFrame(explosionAnimate);
        }
    }
    
    explosionAnimate();
}

function cleanupThreeJs() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer && renderer.domElement) {
        renderer.domElement.remove();
    }
    
    window.removeEventListener("resize", handleResize);
    
    // Clean up Three.js resources
    if (scene) {
        scene.clear();
    }
    if (renderer) {
        renderer.dispose();
    }
}

// Make functions globally available
window.initThreeJsLightBall = initThreeJsLightBall;
window.startThreeJsExplosion = startThreeJsExplosion;
window.cleanupThreeJs = cleanupThreeJs; 