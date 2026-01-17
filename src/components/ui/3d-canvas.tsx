"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";


interface ThreeCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
}

export default function ThreeCanvas({
  children,
  className = "absolute inset-0 z-0",
  cameraPosition = [0, 0, 5],
}: ThreeCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
