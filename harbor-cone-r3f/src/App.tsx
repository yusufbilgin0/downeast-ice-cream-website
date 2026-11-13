import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { HarborCone } from './HarborCone';
import { FLAVORS, type FlavorKey } from './flavors';

const params = new URLSearchParams(window.location.search);
const STILL = params.has('still');
const SNAP = params.has('snap');
const AZ = Number(params.get('az') ?? -12) * (Math.PI / 180);
const EL = Number(params.get('el') ?? 6) * (Math.PI / 180);
const DIST = 17.5;
const LOOK_Y = -0.35;
const camPos: [number, number, number] = [
  Math.sin(AZ) * Math.cos(EL) * DIST,
  Math.sin(EL) * DIST + LOOK_Y,
  Math.cos(AZ) * Math.cos(EL) * DIST,
];

const ORDER: FlavorKey[] = ['blueberry', 'strawberry', 'vanilla'];

export default function App() {
  const initialTop = params.get('top');
  const [top, setTop] = useState<FlavorKey>(
    initialTop && initialTop in FLAVORS ? (initialTop as FlavorKey) : 'blueberry',
  );
  // keep three distinct flavors: the other two fill middle/bottom in a fixed order
  const rest = ORDER.filter((k) => k !== top);
  const flavors = { top, middle: rest[0], bottom: rest[1] };

  return (
    <div className="stage">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: camPos, fov: 30, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: SNAP }}
        onCreated={({ camera }) => camera.lookAt(0, LOOK_Y, 0)}
      >
        {/* Studio rig: warm key softbox, cool harbor rim, low warm fill. */}
        <ambientLight intensity={0.25} color="#fff3e2" />
        <directionalLight position={[-4, 7, 5]} intensity={1.7} color="#fff1df" />
        <directionalLight position={[5, 3, -6]} intensity={1.6} color="#bcd2ff" />
        <directionalLight position={[6, 1, 4]} intensity={0.35} color="#ffe6c8" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} color="#fff4e6" position={[-5, 5, 5]} scale={[7, 5, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={3.2} color="#a9c3f0" position={[5, 1.5, -5]} scale={[2, 9, 1]} target={[0, 0, 0]} />
          <Lightformer form="circle" intensity={1.4} color="#ffffff" position={[0, 8, 1]} scale={4} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.6} color="#ffe2c2" position={[6, 0, 4]} scale={[4, 4, 1]} target={[0, 0, 0]} />
        </Environment>

        <HarborCone flavors={flavors} still={STILL} />
      </Canvas>

      {!SNAP && (
        <div className="ui" role="group" aria-label="Top scoop flavor">
          <span className="ui-label">Top scoop</span>
          {ORDER.map((k) => (
            <button key={k} className={k === top ? 'on' : ''} aria-pressed={k === top} onClick={() => setTop(k)}>
              {FLAVORS[k].label}
            </button>
          ))}
        </div>
      )}
      {!SNAP && <p className="tag">Harbor Cone · R3F prototype (procedural, not final art)</p>}
    </div>
  );
}
