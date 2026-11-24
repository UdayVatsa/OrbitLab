import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function App() {
  const mountRef = useRef(null);


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

    // TODO 1: Create a blue MeshStandardMaterial
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 1,
      metalness: 0
    });


    // TODO 2: Create a mesh using geometry and material
    const sphere = new THREE.Mesh(geometry, material);

    // TODO 3: Add the mesh to the scene
    scene.add(sphere);

    const light = new THREE.DirectionalLight(0xffffff, 3);

    light.position.set(5, 3, 5);

    scene.add(light);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    let animationId;
    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      sphere.rotation.y += 0.5 * delta;

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
    };

  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

export default App;