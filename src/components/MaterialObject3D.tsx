import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type PointerTarget = { x: number; y: number; active: boolean };

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function MaterialGranules() {
  const group = useRef<THREE.Group>(null);
  const granules = useMemo(() => {
    const random = seededRandom(1999);
    const colors = ["#ffffff", "#f4f7f0", "#eef2e8", "#ffffff", "#e6efd8", "#dfe8f2", "#e8ebee", "#71b72b"];
    return Array.from({ length: 115 }, (_, index) => {
      const y = -0.92 + Math.pow(random(), 0.72) * 1.3;
      const capTaper = Math.abs(y) > 0.65 ? Math.sqrt(Math.max(0.12, 1 - Math.pow((Math.abs(y) - 0.65) / 0.52, 2))) : 1;
      const radius = Math.sqrt(random()) * 0.38 * capTaper;
      const angle = random() * Math.PI * 2;
      return {
        position: [radius * Math.cos(angle), y, radius * Math.sin(angle)] as [number, number, number],
        rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI] as [number, number, number],
        scale: 0.03 + random() * 0.05,
        color: colors[index % colors.length],
        // A mix of crystalline facets, rounded pellets and fine powder grains.
        form: index % 5 === 0 ? "crystal" : index % 3 === 0 ? "pellet" : "powder",
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.035;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.018 - 0.02;
  });

  return (
    <group ref={group}>
      {granules.map((granule, index) => (
        <mesh key={index} position={granule.position} rotation={granule.rotation} scale={granule.scale}>
          {granule.form === "crystal"
            ? <octahedronGeometry args={[1, 0]} />
            : granule.form === "pellet"
              ? <sphereGeometry args={[1, 12, 10]} />
              : <icosahedronGeometry args={[1, 1]} />}
          <meshPhysicalMaterial
            color={granule.color}
            roughness={granule.form === "crystal" ? 0.28 : granule.form === "pellet" ? 0.44 : 0.72}
            transmission={granule.form === "crystal" ? 0.22 : 0}
            thickness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function Vessel({ target }: { target: React.MutableRefObject<PointerTarget> }) {
  const vessel = useRef<THREE.Group>(null);
  const shell = useRef<THREE.MeshPhysicalMaterial>(null);
  const rotation = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useFrame((state, delta) => {
    if (!vessel.current) return;
    const pointerX = target.current.active ? target.current.x : 0;
    const pointerY = target.current.active ? target.current.y : 0;
    const desiredX = pointerY * 0.16;
    const desiredY = pointerX * 0.24;
    const drag = Math.exp(-5.2 * delta);
    rotation.current.vx = (rotation.current.vx + (desiredX - rotation.current.x) * 3.8 * delta) * drag;
    rotation.current.vy = (rotation.current.vy + (desiredY - rotation.current.y) * 3.8 * delta) * drag;
    rotation.current.x += rotation.current.vx;
    rotation.current.y += rotation.current.vy;

    const time = state.clock.elapsedTime;
    vessel.current.rotation.x = rotation.current.x + Math.sin(time * 0.32) * 0.025;
    vessel.current.rotation.y = rotation.current.y + time * 0.075;
    vessel.current.position.x = THREE.MathUtils.damp(vessel.current.position.x, 0.11 + pointerX * 0.075, 3.2, delta);
    vessel.current.position.y = THREE.MathUtils.damp(vessel.current.position.y, 0.09 + pointerY * 0.045 + Math.sin(time * 0.72) * 0.04, 2.8, delta);
    if (shell.current) shell.current.iridescenceIOR = 1.28 + Math.sin(time * 0.35) * 0.02;
  });

  return (
    <group ref={vessel} position={[0.11, 0.09, 0]} rotation={[0.08, -0.18, -Math.PI / 3.2]} scale={0.82}>
      <MaterialGranules />
      <mesh renderOrder={2}>
        <capsuleGeometry args={[0.52, 1.32, 12, 40]} />
        <meshPhysicalMaterial ref={shell} color="#eef3ec" roughness={0.13} metalness={0} transmission={0.94} thickness={0.32} ior={1.36} iridescence={0.12} iridescenceIOR={1.3} transparent opacity={0.52} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh scale={[1.018, 1.018, 1.018]} renderOrder={3}>
        <capsuleGeometry args={[0.52, 1.32, 8, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.08} transmission={1} thickness={0.08} transparent opacity={0.11} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene({ target }: { target: React.MutableRefObject<PointerTarget> }) {
  return <>
    <ambientLight intensity={1.25} />
    <directionalLight position={[-3.5, 4.5, 5]} intensity={3.5} color="#ffffff" />
    <directionalLight position={[4, 1.5, 3]} intensity={1.8} color="#eef4e6" />
    <pointLight position={[2.2, -0.5, -2.5]} intensity={8} distance={7} color="#71b72b" />
    <pointLight position={[-2.6, 1.2, -2.2]} intensity={4} distance={7} color="#2f5fa8" />
    <Vessel target={target} />
    <ContactShadows position={[0, -1.38, 0]} opacity={0.2} scale={4.2} blur={2.8} far={3.2} color="#5b6878" />
  </>;
}

export default function MaterialObject3D() {
  const target = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      target.current.x = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1);
      target.current.y = THREE.MathUtils.clamp(-((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1);
      target.current.active = true;
    };
    const onLeave = () => { target.current.active = false; };
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={host} className="material-canvas-host">
      <Canvas dpr={[1, 1.65]} camera={{ position: [0, 0, 3.35], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ background: "transparent" }}>
        <Scene target={target} />
      </Canvas>
    </div>
  );
}
