import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const TECH_STACK = [
  { name: 'React',      icon: '⚛',  color: '#61DAFB', orbit: 0,   speed: 0.4  },
  { name: 'Laravel',    icon: 'L',   color: '#FF2D20', orbit: 1,   speed: -0.3 },
  { name: 'MySQL',      icon: 'M',   color: '#00758F', orbit: 2,   speed: 0.5  },
  { name: 'PostgreSQL', icon: 'Pg',  color: '#336791', orbit: 3,   speed: -0.45},
  { name: 'AWS',        icon: '☁',   color: '#FF9900', orbit: 5,   speed: -0.5 },
];

function RotatingTriangle() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(null);
  const orbitAngles = useRef(TECH_STACK.map((_, i) => (i / TECH_STACK.length) * Math.PI * 2));

  /* ── Three.js scene ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;
    const W = 480, H = 480;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    /* Core geometry — torus knot */
    const coreGeo = new THREE.TorusKnotGeometry(1.35, 0.38, 80, 16, 2, 3); // Reduced segments
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a14,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    /* Wireframe overlay */
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    core.add(wire);

    /* Glow ring (flat torus around knot) */
    const ringGeo = new THREE.TorusGeometry(2.1, 0.025, 6, 60); // Reduced segments
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.8;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.015, 6, 50); // Reduced segments
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x7c4dff, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.z = Math.PI / 5;
    scene.add(ring2);

    /* Floating particle field */
    const PARTICLE_COUNT = 80; // Reduced from 220
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2.4 + Math.random() * 1.6;
      pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl1 = new THREE.PointLight(0x00e5ff, 3, 20);
    pl1.position.set(4, 4, 4);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x7c4dff, 2, 20);
    pl2.position.set(-4, -3, 3);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0xff4081, 1.5, 15);
    pl3.position.set(0, -5, -2);
    scene.add(pl3);

    /* Mouse */
    let mx = 0, my = 0;
    const onMove = e => {
      const r = renderer.domElement.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    renderer.domElement.addEventListener('mousemove', onMove);

    /* Animate */
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      core.rotation.y  = t * 0.22 + mx * 0.08;
      core.rotation.x  = Math.sin(t * 0.18) * 0.15 + my * 0.06;
      core.rotation.z  = t * 0.08;

      ring1.rotation.z = t * 0.15;
      ring2.rotation.y = t * 0.12;

      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.025;

      const pulse = 1 + Math.sin(t * 1.2) * 0.03;
      core.scale.setScalar(pulse);

      wireMat.opacity = 0.14 + Math.sin(t * 0.9) * 0.06;
      pl1.intensity   = 2.5 + Math.sin(t * 1.5) * 0.8;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener('mousemove', onMove);
      if (containerRef.current?.contains(renderer.domElement))
        containerRef.current.removeChild(renderer.domElement);
      [coreGeo, coreMat, wireGeo, wireMat, ringGeo, ringMat,
       ring2Geo, ring2Mat, pGeo, pMat].forEach(x => x.dispose());
      renderer.dispose();
    };
  }, []);

  /* ── CSS orbit animation tick ───────────────────────────────────── */
  useEffect(() => {
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      orbitAngles.current = orbitAngles.current.map((a, i) => a + TECH_STACK[i].speed * 0.006);
      if (canvasRef.current) canvasRef.current.__forceUpdate?.();
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Orbit badge positions (CSS absolute) ───────────────────────── */
  const ORBIT_RADII   = [178, 165, 188, 172, 182, 170];
  const ORBIT_TILTS   = [18, -14, 10, -20, 16, -10];
  const CENTER = 240;

  const getBadgePos = (i) => {
    const angle  = orbitAngles.current[i];
    const radius = ORBIT_RADII[i];
    const tilt   = ORBIT_TILTS[i] * (Math.PI / 180);
    const x = CENTER + radius * Math.cos(angle);
    const y = CENTER + radius * Math.sin(angle) * Math.cos(tilt);
    const z = Math.sin(angle);
    return { x, y, z };
  };

  return (
    <div className="rbt-root">
      {/* Scan lines overlay */}
      <div className="rbt-scanlines" aria-hidden="true" />

      {/* Corner brackets */}
      <div className="rbt-corner rbt-corner--tl" aria-hidden="true" />
      <div className="rbt-corner rbt-corner--tr" aria-hidden="true" />
      <div className="rbt-corner rbt-corner--bl" aria-hidden="true" />
      <div className="rbt-corner rbt-corner--br" aria-hidden="true" />

      {/* HUD labels */}
      <div className="rbt-hud rbt-hud--top">
        <span className="rbt-hud-label">TECH.STACK</span>
        <span className="rbt-hud-dot" />
        <span className="rbt-hud-label">v2.0</span>
      </div>
      <div className="rbt-hud rbt-hud--bottom">
        <span className="rbt-hud-label">SYS.READY</span>
        <span className="rbt-hud-bar" />
      </div>

      {/* Three.js canvas container */}
      <div className="rbt-canvas-wrap">
        <div ref={containerRef} className="rbt-canvas" />
      </div>

      {/* CSS-animated orbit badges */}
      <OrbitLayer
        orbitAngles={orbitAngles}
        getBadgePos={getBadgePos}
        hovered={hovered}
        active={active}
        setHovered={setHovered}
        setActive={setActive}
      />

      {/* Active tech tooltip */}
      {active !== null && (
        <div className="rbt-tooltip">
          <span className="rbt-tooltip-icon" style={{ color: TECH_STACK[active].color }}>
            {TECH_STACK[active].icon}
          </span>
          <span className="rbt-tooltip-name">{TECH_STACK[active].name}</span>
        </div>
      )}
    </div>
  );
}

/* Separate component so it re-renders on each animation frame */
function OrbitLayer({ orbitAngles, getBadgePos, hovered, active, setHovered, setActive }) {
  const [, tick] = useState(0);

  useEffect(() => {
    let raf;
    const loop = () => { raf = requestAnimationFrame(loop); tick(n => n + 1); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="rbt-orbit-layer" aria-label="Tech stack">
      {TECH_STACK.map((tech, i) => {
        const { x, y, z } = getBadgePos(i);
        const scale   = 0.75 + (z + 1) * 0.14;
        const opacity = 0.55 + (z + 1) * 0.22;
        const zIndex  = Math.round((z + 1) * 10);
        const isHov   = hovered === i;
        const isAct   = active === i;
        return (
          <div
            key={tech.name}
            className={`rbt-badge ${isHov ? 'rbt-badge--hovered' : ''} ${isAct ? 'rbt-badge--active' : ''}`}
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${isHov ? scale * 1.15 : scale})`,
              opacity: isHov ? 1 : opacity,
              zIndex,
              '--tech-color': tech.color,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === i ? null : i)}
          >
            <span className="rbt-badge-icon">{tech.icon}</span>
            <span className="rbt-badge-name">{tech.name}</span>
            <span className="rbt-badge-glow" />
          </div>
        );
      })}
    </div>
  );
}

export default RotatingTriangle;
