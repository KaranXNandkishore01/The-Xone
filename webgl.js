import * as THREE from 'three';

export const initWebGL = () => {
    const canvas = document.getElementById('bg-canvas');

    const scene = new THREE.Scene();
    // Deep black fog matches the theme
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.z = 1000;
    camera.position.y = 200;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Removed grid as requested

    // Create particles (stars/data points)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const originalPosArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles over a large area
        posArray[i] = (Math.random() - 0.5) * 3000;
        originalPosArray[i] = posArray[i];
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 4,
        color: 0xffffff, // White particles
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;
    });

    // Animation Loop
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        time += delta;

        // Rotate particles slowly
        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.rotation.x = time * 0.02;

        // Antimagnetic Mouse Repel Logic
        const targetWorld = new THREE.Vector3(mouseX * 2.5, -mouseY * 2.5, camera.position.z - 1000); // Approximate screen space
        particlesMesh.worldToLocal(targetWorld);

        const positions = particlesGeometry.attributes.position.array;

        for (let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const px = positions[ix];
            const py = positions[iy];
            const pz = positions[iz];

            const ox = originalPosArray[ix];
            const oy = originalPosArray[iy];
            const oz = originalPosArray[iz];

            const dx = px - targetWorld.x;
            const dy = py - targetWorld.y;
            const dz = pz - targetWorld.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            const repelRadius = 400; // Affect particles within this radius radius

            if (dist < repelRadius) {
                // If close to cursor, repel
                const force = Math.pow((repelRadius - dist) / repelRadius, 2);
                positions[ix] += (dx / (dist || 1)) * force * 20;
                positions[iy] += (dy / (dist || 1)) * force * 20;
                positions[iz] += (dz / (dist || 1)) * force * 20;
            } else {
                // If not close, spring back to original slowly
                positions[ix] += (ox - positions[ix]) * 0.02;
                positions[iy] += (oy - positions[iy]) * 0.02;
                positions[iz] += (oz - positions[iz]) * 0.02;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Move camera based on mouse movement for parallax effect
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05 + 10; // keep slight elevation

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};
