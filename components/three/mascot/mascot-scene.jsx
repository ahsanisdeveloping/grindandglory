"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrthographicCamera } from "@react-three/drei";
import { MascotCharacter } from "./mascot-character";
import { mascotConfig } from "./mascot-config";

function FittedCamera() {
  const size = useThree((state) => state.size);
  return <OrthographicCamera makeDefault position={[0,2.72,12]} rotation={[-0.05,0,0]} near={0.1} far={50} zoom={Math.min(size.width / 5.25, size.height / 4.75)} />;
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#fff7ed", "#927795", 1.3]} />
      <directionalLight position={[-3,6,6]} intensity={2.8} color="#fff5e8" />
      <directionalLight position={[4,3,2]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-4,2,-2]} intensity={1.7} color="#dec0ec" />
      <pointLight position={[-2.4,0.55,0.8]} color="#c78ee0" intensity={0.55} distance={4.8} decay={2} />
      <Environment resolution={mascotConfig.rendering.environmentResolution} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0,4,7]} scale={[9,3,1]} />
        <Lightformer form="rect" intensity={3} color="#fff7ed" position={[-3,4,4]} scale={[4,5,1]} rotation={[0,Math.PI / 4,0]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[4,2,3]} scale={[2,5,1]} rotation={[0,-Math.PI / 4,0]} />
        <Lightformer form="rect" intensity={2} color="#e5c1f0" position={[-3,1,-3]} scale={[2,4,1]} rotation={[0,Math.PI / 4,0]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0,6,0]} scale={[5,3,1]} rotation={[Math.PI / 2,0,0]} />
      </Environment>
    </>
  );
}

export default function MascotScene({ pointer, reducedMotion, paused, sceneElement, onReady, onContextLost }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0,2.12,12], near: 0.1, far: 50, zoom: 100 }}
      dpr={[1, mascotConfig.rendering.maxDpr]}
      frameloop={paused ? "never" : reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMappingExposure: 1 }}
      resize={{ scroll: false, debounce: 100 }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute("aria-hidden", "true");
        gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
        onReady();
      }}
      fallback={<p className="sr-only">The interactive mascot needs WebGL.</p>}
    >
      <FittedCamera />
      <StudioLighting />
      <MascotCharacter pointer={pointer} reducedMotion={reducedMotion} paused={paused} sceneElement={sceneElement} />
      <ContactShadows position={[0,0.015,0]} opacity={0.4} scale={8} blur={2.7} far={4.4} resolution={256} frames={1} color="#684074" />
    </Canvas>
  );
}
