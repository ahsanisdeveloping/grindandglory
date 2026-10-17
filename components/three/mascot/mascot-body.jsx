import { useMemo, useEffect } from "react";
import { createBodyGeometry, createSmileGeometry, faceDepth } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";

export function MascotBody() {
  const geometry = useMemo(() => createBodyGeometry(), []);
  const smile = useMemo(() => createSmileGeometry(), []);
  useEffect(() => () => { geometry.dispose(); smile.dispose(); }, [geometry, smile]);
  return (
    <>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial color={mascotConfig.colors.ivory} roughness={0.26} metalness={0} clearcoat={0.48} clearcoatRoughness={0.2} />
      </mesh>
      <mesh geometry={smile}><meshPhysicalMaterial color={mascotConfig.colors.plum} roughness={0.24} clearcoat={0.8} /></mesh>
      {[-0.225, 0.225].map((x) => (
        <mesh key={x} position={[x, 0.8, faceDepth(x,0.8) + 0.026]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color={mascotConfig.colors.plum} /></mesh>
      ))}
    </>
  );
}
