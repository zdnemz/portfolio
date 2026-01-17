"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

export default function HeroScene() {
  return (
    <>
      <color attach="background" args={["#050510"]} />
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <ParticleRing />
      </Float>
    </>
  );
}

function ParticleRing() {
  const ref = useRef<THREE.Points>(null!);
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <points ref={ref}>
      <torusGeometry args={[10, 3, 16, 100]} />
      <pointsMaterial
        size={0.05}
        color="#8b5cf6" // Primary violet
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}
