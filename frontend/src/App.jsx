import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function App() {
  const mountRef = useRef(null);
  const orbitGroupRef = useRef(null);
  const PauseRef = useRef(null);


  const [inclination, setInclination] = useState(30);
  const [pause, setPause] = useState(false);

  useEffect(() => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    // TODO 1: Create a Three.js scene
    const scene = new THREE.Scene();

    // TODO 2: Create a perspective camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);


    // TODO 3: Create a WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // Create texture from the image imported
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      '/textures/earth.jpg',
      () => {
        console.log('Earth texture loaded successfully');
        renderer.render(scene, camera);
      },
      undefined,
      (error) => {
        console.error('Texture loading failed:', error);
      }
    );

    // TODO 1: Create a earthTexture MeshStandardMaterial
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 1,
      metalness: 0
    });


    // TODO 2: Create a mesh using geometry and material
    const sphere = new THREE.Mesh(geometry, material);

    // TODO 3: Add the mesh to the scene
    scene.add(sphere);

    // Creating Moon
    const satelliteGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const satelliteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff
    });

    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.set(3, 0, 0); // Redundant can be removed as satellite will still start from this position


    let angle = 0;
    const orbitRadius = 3;
    const angularSpeed = 0.5;

    // Creating orbit
    const orbitGeometry = new THREE.CircleGeometry(orbitRadius, 100);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;

    // Creating Orbit Group
    const orbitGroup = new THREE.Group();
    orbitGroup.add(orbit);
    orbitGroup.add(satellite);
    orbitGroup.rotation.x = THREE.MathUtils.degToRad(inclination);
    orbitGroupRef.current = orbitGroup;   // added now
    scene.add(orbitGroup);



    // Creating Light
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 3, 5);
    scene.add(light);

    // Creating Axis
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    let animationId;
    const clock = new THREE.Clock();


    function animate() {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      if (!PauseRef.current) {
        
        sphere.rotation.y += angularSpeed * delta;

        angle += angularSpeed * delta;
        satellite.position.x = orbitRadius * Math.cos(angle);
        satellite.position.z = orbitRadius * Math.sin(angle);
      }

      renderer.render(scene, camera);
    }

    animate();


    mountRef.current.appendChild(renderer.domElement);

    return () => {
      cancelAnimationFrame(animationId);

      renderer.domElement.remove();
      geometry.dispose();
      material.dispose();
      earthTexture.dispose();
      renderer.dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();

      orbitGeometry.dispose();
      orbitMaterial.dispose();
    };

  }, []);

  // added now
  useEffect(() => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.x = THREE.MathUtils.degToRad(inclination);
    }
  }, [inclination]);

// Implementation of Pause button
useEffect(() => {
   PauseRef.current = pause;
},[pause])



  // Return JSX of App component
  return (
    <div>
      <input
        type="range"
        min="0"
        max="180"
        value={inclination}
        onChange={(e) => setInclination(Number(e.target.value))}
      />

      <p>Inclination: {inclination}°</p>
      <button onClick={() => setPause(prev => !prev)}>
        {pause ? "Resume":"Pause"}
      </button>

      <div
        ref={mountRef}
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}

export default App;