"use client";

import { Canvas } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { HarborCone, type Looks } from "./HarborCone";

/** Camera framing shared with the static fallback image (same angle and distance). */
const AZ = -12 * (Math.PI / 180);
const EL = 6 * (Math.PI / 180);
const DIST = 17.5;
const LOOK_Y = -0.35;
const CAMERA: [number, number, number] = [
  Math.sin(AZ) * Math.cos(EL) * DIST,
  Math.sin(EL) * DIST + LOOK_Y,
  Math.cos(AZ) * Math.cos(EL) * DIST,
];

export type ConeSceneProps = {
  /** Render loop on/off: off while the hero is scrolled away or the tab is hidden. */
  active: boolean;
  detail: "high" | "low";
  onReady: () => void;
  onContextLost: () => void;
  /** Freeze motion (used to capture the static fallback image). */
  still?: boolean;
  /** Flavor look per scoop (defaults to blueberry / strawberry / vanilla). */
  looks?: Looks;
};

/**
 * The interactive 3D hero cone. Loaded on demand (see ConeHero) so Three.js
 * never blocks the first paint. Everything is procedural: no model or
 * texture downloads.
 */
export default function ConeScene({ active, detail, onReady, onContextLost, still = false, looks }: ConeSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={detail === "low" ? [1, 1.5] : [1, 2]}
      camera={{ position: CAMERA, fov: 30, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, LOOK_Y, 0);
        // Neutral tone mapping keeps the cream and fruit colors true (ACES washes them out).
        gl.toneMapping = NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
      }}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      aria-hidden
    >
      {/* Studio rig: warm key softbox, cool harbor rim, low warm fill. */}
      <ambientLight intensity={0.25} color="#fff3e2" />
      <directionalLight position={[-4, 7, 5]} intensity={1.7} color="#fff1df" />
      <directionalLight position={[5, 3, -6]} intensity={1.6} color="#bcd2ff" />
      <directionalLight position={[6, 1, 4]} intensity={0.35} color="#ffe6c8" />
      <Environment resolution={detail === "low" ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff4e6" position={[-5, 5, 5]} scale={[7, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.2} color="#a9c3f0" position={[5, 1.5, -5]} scale={[2, 9, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1.4} color="#ffffff" position={[0, 8, 1]} scale={4} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} color="#ffe2c2" position={[6, 0, 4]} scale={[4, 4, 1]} target={[0, 0, 0]} />
      </Environment>
      <HarborCone detail={detail} onReady={onReady} still={still} looks={looks} />
    </Canvas>
  );
}
