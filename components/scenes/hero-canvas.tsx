"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { usePrefersColorScheme, usePrefersReducedMotion } from "@/lib/hooks";

function Ribbon({ scheme }: { scheme: "light" | "dark" }) {
  const ref = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const reduced = usePrefersReducedMotion();

  const { geometry, geometry2 } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const x = (t - 0.5) * 28;
      const y = Math.sin(t * Math.PI * 4) * 1.4 + Math.cos(t * Math.PI * 2.5) * 0.6;
      const z = Math.cos(t * Math.PI * 3) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
    const g = new THREE.TubeGeometry(curve, 600, 0.022, 6, false);

    const points2: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const x = (t - 0.5) * 32;
      const y = Math.cos(t * Math.PI * 3) * 1.1 - Math.sin(t * Math.PI * 5) * 0.5 - 1.5;
      const z = Math.sin(t * Math.PI * 2.5) * 1.6 - 1.2;
      points2.push(new THREE.Vector3(x, y, z));
    }
    const curve2 = new THREE.CatmullRomCurve3(points2, false, "centripetal", 0.5);
    const g2 = new THREE.TubeGeometry(curve2, 600, 0.014, 6, false);

    return { geometry: g, geometry2: g2 };
  }, []);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.08) * 0.3;
      ref.current.rotation.x = Math.cos(t * 0.06) * 0.12;
      ref.current.position.y = Math.sin(t * 0.2) * 0.15;
    }
    if (ref2.current) {
      ref2.current.rotation.y = Math.sin(t * 0.05 + 1) * 0.25;
      ref2.current.rotation.x = Math.cos(t * 0.07 + 0.5) * 0.1;
    }
  });

  const isLight = scheme === "light";
  const primaryColor = isLight ? "#0a0a0c" : "#f4f1ea";
  const primaryEmissive = isLight ? "#7aa7ff" : "#7aa7ff";
  const primaryEmissiveIntensity = isLight ? 0.18 : 0.35;
  const secondaryColor = isLight ? "#5a5f6a" : "#b8c0cc";
  const secondaryEmissiveIntensity = isLight ? 0.05 : 0.12;

  return (
    <>
      <mesh ref={ref} geometry={geometry}>
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryEmissive}
          emissiveIntensity={primaryEmissiveIntensity}
          metalness={0.7}
          roughness={isLight ? 0.45 : 0.25}
        />
      </mesh>
      <mesh ref={ref2} geometry={geometry2}>
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={secondaryEmissiveIntensity}
          metalness={0.9}
          roughness={isLight ? 0.55 : 0.4}
        />
      </mesh>
    </>
  );
}

export default function HeroCanvas() {
  const reduced = usePrefersReducedMotion();
  const scheme = usePrefersColorScheme();
  const isLight = scheme === "light";

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <color attach="background" args={[isLight ? "#f1ede4" : "#050505"]} />
      <fog attach="fog" args={[isLight ? "#f1ede4" : "#050505", 8, 22]} />
      <ambientLight intensity={isLight ? 0.55 : 0.25} />
      <directionalLight position={[6, 6, 4]} intensity={isLight ? 0.5 : 0.7} color={isLight ? "#ffffff" : "#f4f1ea"} />
      <directionalLight position={[-6, -2, 2]} intensity={isLight ? 0.3 : 0.5} color="#7aa7ff" />
      <Ribbon scheme={scheme} />
    </Canvas>
  );
}
