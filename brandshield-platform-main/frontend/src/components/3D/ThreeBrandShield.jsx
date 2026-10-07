import { useEffect, useRef } from "react";
import * as THREE from "three";

function ThreeBrandShield() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    // -----------------------------
    // SCENE
    // -----------------------------

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);

    // -----------------------------
    // CAMERA
    // -----------------------------

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100
    );

    camera.position.set(0, 0, 7);

    // -----------------------------
    // RENDERER
    // -----------------------------

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight
    );

    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    mount.appendChild(renderer.domElement);

    // -----------------------------
    // LIGHTS
    // -----------------------------

    const ambientLight = new THREE.AmbientLight(
      0x88ccff,
      1.5
    );

    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      0x00eaff,
      5,
      20
    );

    pointLight.position.set(3, 3, 5);
    scene.add(pointLight);

    const greenLight = new THREE.PointLight(
      0x00ff9d,
      3,
      15
    );

    greenLight.position.set(-4, -2, 3);
    scene.add(greenLight);

    // -----------------------------
    // MAIN SHIELD GROUP
    // -----------------------------

    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Outer shield
    const shieldGeometry =
      new THREE.IcosahedronGeometry(1.55, 2);

    const shieldMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x00eaff,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      });

    const shield = new THREE.Mesh(
      shieldGeometry,
      shieldMaterial
    );

    shieldGroup.add(shield);

    // Inner shield
    const innerGeometry =
      new THREE.IcosahedronGeometry(1.15, 1);

    const innerMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });

    const innerShield = new THREE.Mesh(
      innerGeometry,
      innerMaterial
    );

    shieldGroup.add(innerShield);

    // -----------------------------
    // ORBIT RINGS
    // -----------------------------

    const torusGroup = new THREE.Group();

    shieldGroup.add(torusGroup);

    const ring1Geometry =
      new THREE.TorusGeometry(
        2.05,
        0.018,
        12,
        100
      );

    const ring1Material =
      new THREE.MeshBasicMaterial({
        color: 0x00eaff,
        transparent: true,
        opacity: 0.5,
      });

    const ring1 = new THREE.Mesh(
      ring1Geometry,
      ring1Material
    );

    ring1.rotation.x = Math.PI / 2;

    torusGroup.add(ring1);

    const ring2Geometry =
      new THREE.TorusGeometry(
        2.25,
        0.012,
        12,
        100
      );

    const ring2Material =
      new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        transparent: true,
        opacity: 0.4,
      });

    const ring2 = new THREE.Mesh(
      ring2Geometry,
      ring2Material
    );

    ring2.rotation.y = Math.PI / 2;

    torusGroup.add(ring2);

    const ring3Geometry =
      new THREE.TorusGeometry(
        2.45,
        0.009,
        12,
        100
      );

    const ring3Material =
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.3,
      });

    const ring3 = new THREE.Mesh(
      ring3Geometry,
      ring3Material
    );

    ring3.rotation.x = Math.PI / 4;

    torusGroup.add(ring3);

    // -----------------------------
    // PARTICLES
    // -----------------------------

    const particleCount = 700;

    const particlePositions =
      new Float32Array(
        particleCount * 3
      );

    for (let i = 0; i < particleCount; i++) {
      const radius =
        2.8 + Math.random() * 3.5;

      const theta =
        Math.random() * Math.PI * 2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );

      const x =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      const y =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      const z =
        radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        particlePositions,
        3
      )
    );

    const particleMaterial =
      new THREE.PointsMaterial({
        color: 0x00eaff,
        size: 0.045,
        transparent: true,
        opacity: 0.75,
        blending:
          THREE.AdditiveBlending,
        depthWrite: false,
      });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    // -----------------------------
    // THREAT NODES
    // -----------------------------

    const threatGroup = new THREE.Group();

    scene.add(threatGroup);

    const threatPositions = [
      [2.7, 1.4, 0],
      [-2.6, 1.8, 0.4],
      [2.5, -1.5, 0.6],
      [-2.8, -1.3, 0.2],
      [0.2, 2.8, 0],
      [0.3, -2.7, 0.2],
    ];

    const threatObjects = [];

    threatPositions.forEach(
      ([x, y, z], index) => {
        const isCritical =
          index % 2 === 0;

        const nodeGeometry =
          new THREE.SphereGeometry(
            isCritical ? 0.075 : 0.055,
            16,
            16
          );

        const nodeMaterial =
          new THREE.MeshBasicMaterial({
            color: isCritical
              ? 0xff3b5c
              : 0xffa500,
            transparent: true,
            opacity: 0.9,
          });

        const node = new THREE.Mesh(
          nodeGeometry,
          nodeMaterial
        );

        node.position.set(
          x,
          y,
          z
        );

        threatGroup.add(node);

        threatObjects.push(node);

        // Connection line
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z),
        ];

        const lineGeometry =
          new THREE.BufferGeometry().setFromPoints(
            points
          );

        const lineMaterial =
          new THREE.LineBasicMaterial({
            color: isCritical
              ? 0xff3b5c
              : 0xffa500,
            transparent: true,
            opacity: 0.22,
          });

        const line = new THREE.Line(
          lineGeometry,
          lineMaterial
        );

        threatGroup.add(line);
      }
    );

    // -----------------------------
    // ORBIT DOTS
    // -----------------------------

    const orbitGroup = new THREE.Group();

    scene.add(orbitGroup);

    for (let i = 0; i < 16; i++) {
      const angle =
        (i / 16) * Math.PI * 2;

      const radius = 2.8;

      const dotGeometry =
        new THREE.SphereGeometry(
          0.035,
          8,
          8
        );

      const dotMaterial =
        new THREE.MeshBasicMaterial({
          color:
            i % 3 === 0
              ? 0x00ff9d
              : 0x00eaff,
        });

      const dot = new THREE.Mesh(
        dotGeometry,
        dotMaterial
      );

      dot.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );

      orbitGroup.add(dot);
    }

    // -----------------------------
    // DRAG CONTROL
    // -----------------------------

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const handlePointerDown = (
      event
    ) => {
      isDragging = true;

      previousX = event.clientX;
      previousY = event.clientY;

      renderer.domElement.style.cursor =
        "grabbing";
    };

    const handlePointerMove = (
      event
    ) => {
      if (!isDragging) return;

      const deltaX =
        event.clientX - previousX;

      const deltaY =
        event.clientY - previousY;

      shieldGroup.rotation.y +=
        deltaX * 0.008;

      shieldGroup.rotation.x +=
        deltaY * 0.008;

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;

      renderer.domElement.style.cursor =
        "grab";
    };

    renderer.domElement.style.cursor =
      "grab";

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    renderer.domElement.addEventListener(
      "pointermove",
      handlePointerMove
    );

    renderer.domElement.addEventListener(
      "pointerup",
      handlePointerUp
    );

    renderer.domElement.addEventListener(
      "pointerleave",
      handlePointerUp
    );

    // -----------------------------
    // RESIZE
    // -----------------------------

    const handleResize = () => {
      const width =
        mount.clientWidth;

      const height =
        Math.max(
          mount.clientHeight,
          1
        );

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    handleResize();

    // -----------------------------
    // ANIMATION
    // -----------------------------

    const clock =
      new THREE.Clock();

    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(
          animate
        );

      const elapsed =
        clock.getElapsedTime();

      // Shield rotation
      if (!isDragging) {
        shieldGroup.rotation.y +=
          0.0025;

        shieldGroup.rotation.x =
          Math.sin(
            elapsed * 0.35
          ) * 0.08;
      }

      // Inner shield
      innerShield.rotation.y -=
        0.004;

      innerShield.rotation.x +=
        0.002;

      // Rings
      torusGroup.rotation.z +=
        0.003;

      torusGroup.rotation.x =
        Math.sin(
          elapsed * 0.25
        ) * 0.15;

      // Particles
      particles.rotation.y +=
        0.0008;

      particles.rotation.x =
        Math.sin(
          elapsed * 0.15
        ) * 0.04;

      // Threat network
      threatGroup.rotation.y -=
        0.0015;

      // Orbit
      orbitGroup.rotation.z +=
        0.004;

      // Threat pulse
      threatObjects.forEach(
        (node, index) => {
          const pulse =
            1 +
            Math.sin(
              elapsed * 3 + index
            ) *
              0.25;

          node.scale.setScalar(
            pulse
          );
        }
      );

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // -----------------------------
    // CLEANUP
    // -----------------------------

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      renderer.domElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      renderer.domElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      renderer.domElement.removeEventListener(
        "pointerleave",
        handlePointerUp
      );

      shieldGeometry.dispose();
      shieldMaterial.dispose();

      innerGeometry.dispose();
      innerMaterial.dispose();

      ring1Geometry.dispose();
      ring1Material.dispose();

      ring2Geometry.dispose();
      ring2Material.dispose();

      ring3Geometry.dispose();
      ring3Material.dispose();

      particleGeometry.dispose();
      particleMaterial.dispose();

      threatGroup.children.forEach(
        (child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            child.material.dispose();
          }
        }
      );

      orbitGroup.children.forEach(
        (child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            child.material.dispose();
          }
        }
      );

      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        mount
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[300px]"
    />
  );
}

// ======================================================
// IMPORTANT: DEFAULT EXPORT
// ======================================================

export default ThreeBrandShield;