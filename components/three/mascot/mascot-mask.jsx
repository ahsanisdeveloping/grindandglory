import { useMemo, useEffect } from "react";
import { createMaskGeometry, createDpadGeometry, faceDepth } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";

export function MascotMask() {
  const mask = useMemo(() => createMaskGeometry(), []);
  const dpad = useMemo(() => createDpadGeometry(), []);
  useEffect(() => () => { mask.dispose(); dpad.dispose(); }, [mask, dpad]);
  return (
    <group position={[0,0.11,0]}>
      <mesh geometry={mask} castShadow>
        <meshPhysicalMaterial color={mascotConfig.colors.plum} roughness={0.24} metalness={0.15} clearcoat={0.9} clearcoatRoughness={0.15} />
      </mesh>
      <mesh geometry={dpad} position={[-1.23, 1.48, faceDepth(-1.23, 1.48) + 0.12]} rotation={[0, -0.18, -0.07]}>
        <meshPhysicalMaterial color={mascotConfig.colors.buttons} roughness={0.28} clearcoat={0.6} />
      </mesh>
      {[[1.24,1.67],[1.43,1.48],[1.24,1.29],[1.05,1.48]].map(([x,y]) => (
        <mesh key={`${x}-${y}`} position={[x,y,faceDepth(x,y) + 0.155]} scale={[0.085,0.092,0.05]}>
          <sphereGeometry args={[1,24,16]} /><meshPhysicalMaterial color={mascotConfig.colors.buttons} roughness={0.24} clearcoat={0.7} />
        </mesh>
      ))}
      <mesh position={[0,1.2,faceDepth(0,1.2) + 0.14]} rotation={[0,0,Math.PI / 2]}>
        <capsuleGeometry args={[0.035,0.21,5,16]} /><meshPhysicalMaterial color={mascotConfig.colors.buttons} roughness={0.26} />
      </mesh>
    </group>
  );
}
