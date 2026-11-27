import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeRibbonCanvas
 * Creates a cinematic, multi-layered 3D folded ribbon / wave animation
 * using Three.js with realistic specular lighting, gradient colors,
 * origami-like dynamic folds, and responsive mouse parallax.
 */
const ThreeRibbonCanvas = ({ height = "520px" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let canvasHeight = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    // 2. WebGL Renderer with Antialiasing and Alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup for Realistic Depth and Fold Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Main Magenta/Pink key light
    const keyLight = new THREE.DirectionalLight(0xff2d87, 2.2);
    keyLight.position.set(-6, 6, 8);
    scene.add(keyLight);

    // Cool Cyan/Blue fill light
    const fillLight = new THREE.DirectionalLight(0x00f2fe, 1.8);
    fillLight.position.set(7, -5, 6);
    scene.add(fillLight);

    // Violet top rim light
    const rimLight = new THREE.PointLight(0xa855f7, 2.5, 25);
    rimLight.position.set(0, 5, 4);
    scene.add(rimLight);

    // 4. Procedural Gradient Texture Generator
    const createGradientTexture = (colors) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
      colors.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const mainGradient = createGradientTexture([
      { stop: 0.0, color: "#ec4899" }, // Vibrant Pink
      { stop: 0.25, color: "#d946ef" }, // Magenta
      { stop: 0.5, color: "#8b5cf6" }, // Purple
      { stop: 0.75, color: "#3b82f6" }, // Electric Blue
      { stop: 1.0, color: "#06b6d4" }, // Cyan
    ]);

    const accentGradient = createGradientTexture([
      { stop: 0.0, color: "#8b5cf6" }, // Purple
      { stop: 0.35, color: "#06b6d4" }, // Cyan
      { stop: 0.7, color: "#ec4899" }, // Pink
      { stop: 1.0, color: "#3b82f6" }, // Blue
    ]);

    // 5. Folded Ribbon Geometry
    // We create a high-density plane geometry that we deform in real time
    const ribbonWidth = 14;
    const ribbonHeight = 2.4;
    const segX = 140;
    const segY = 24;

    const mainGeo = new THREE.PlaneGeometry(ribbonWidth, ribbonHeight, segX, segY);
    const mainMat = new THREE.MeshStandardMaterial({
      map: mainGradient,
      roughness: 0.28,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    const mainRibbon = new THREE.Mesh(mainGeo, mainMat);
    mainRibbon.rotation.x = -0.15;
    mainRibbon.rotation.z = -0.08;
    scene.add(mainRibbon);

    // Secondary interwoven accent ribbon for multi-layer depth
    const accentGeo = new THREE.PlaneGeometry(ribbonWidth * 0.9, ribbonHeight * 0.6, 120, 16);
    const accentMat = new THREE.MeshStandardMaterial({
      map: accentGradient,
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const accentRibbon = new THREE.Mesh(accentGeo, accentMat);
    accentRibbon.position.set(0, -0.4, -0.6);
    accentRibbon.rotation.x = 0.2;
    accentRibbon.rotation.z = 0.05;
    scene.add(accentRibbon);

    // Save initial vertex positions
    const mainPos = mainGeo.attributes.position;
    const mainInitial = new Float32Array(mainPos.array);

    const accentPos = accentGeo.attributes.position;
    const accentInitial = new Float32Array(accentPos.array);

    // 6. Interactive Floating 3D Micro-Spheres / Particle Accents
    const particleCount = 28;
    const particleGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.75,
    });

    const particleGroup = new THREE.Group();
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(particleGeo, particleMat.clone());
      const pColor = i % 2 === 0 ? 0x06b6d4 : 0xec4899;
      mesh.material.color.setHex(pColor);

      const px = (Math.random() - 0.5) * 14;
      const py = (Math.random() - 0.5) * 4;
      const pz = (Math.random() - 0.5) * 4;

      mesh.position.set(px, py, pz);
      particleGroup.add(mesh);

      particleData.push({
        baseX: px,
        baseY: py,
        baseZ: pz,
        speed: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      });
    }
    scene.add(particleGroup);

    // 7. Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 8. Animation Loop with Organic Origami Wave Harmonics
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      camera.position.x = mouseX * 1.4;
      camera.position.y = mouseY * 1.0;
      camera.lookAt(0, 0, 0);

      // Deform Main Folded Ribbon
      const mArr = mainPos.array;
      for (let i = 0; i < mArr.length; i += 3) {
        const ox = mainInitial[i];
        const oy = mainInitial[i + 1];

        // Complex wave function with folding harmonics
        const wave1 = Math.sin(ox * 0.65 + elapsed * 1.1) * 1.15;
        const wave2 = Math.cos(ox * 0.35 - elapsed * 0.75) * 0.6;
        const foldHarmonic = Math.sin(ox * 1.8 + elapsed * 0.9) * 0.35; // Sharp faceted fold feel

        // Height undulation
        mArr[i + 1] = oy + wave1 * 0.45 + foldHarmonic * 0.25;

        // Depth displacement (Z axis gives the twisted ribbon depth)
        const depthWave = Math.cos(ox * 0.5 + elapsed * 1.0) * 1.35;
        const twistWave = Math.sin(oy * 2.2 + elapsed * 0.8) * 0.45;
        mArr[i + 2] = depthWave + twistWave + foldHarmonic * 0.4;
      }
      mainPos.needsUpdate = true;
      mainGeo.computeVertexNormals();

      // Deform Accent Ribbon (offset frequency for interwoven motion)
      const aArr = accentPos.array;
      for (let i = 0; i < aArr.length; i += 3) {
        const ox = accentInitial[i];
        const oy = accentInitial[i + 1];

        const aWave1 = Math.sin(ox * 0.7 - elapsed * 1.2) * 0.85;
        const aFold = Math.cos(ox * 1.6 + elapsed * 0.8) * 0.3;

        aArr[i + 1] = oy + aWave1 * 0.4;
        aArr[i + 2] = Math.sin(ox * 0.45 + elapsed * 0.95) * 1.1 + aFold * 0.35;
      }
      accentPos.needsUpdate = true;
      accentGeo.computeVertexNormals();

      // Animate floating micro-particles
      particleData.forEach((p, idx) => {
        const mesh = particleGroup.children[idx];
        if (mesh) {
          mesh.position.y = p.baseY + Math.sin(elapsed * p.speed + p.offset) * 0.25;
          mesh.position.x = p.baseX + Math.cos(elapsed * (p.speed * 0.6) + p.offset) * 0.15;
        }
      });

      // Subtle dynamic ribbon rotation
      mainRibbon.rotation.y = Math.sin(elapsed * 0.2) * 0.08;
      accentRibbon.rotation.y = -Math.cos(elapsed * 0.25) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      canvasHeight = container.clientHeight || 520;
      camera.aspect = width / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, canvasHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      mainGeo.dispose();
      mainMat.dispose();
      accentGeo.dispose();
      accentMat.dispose();
      particleGeo.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: height,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
};

export default ThreeRibbonCanvas;
