import { forwardRef, useMemo, useEffect } from "react";
import { createCrownGeometry, createCrownGemGeometry } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";
import { SoftGlow } from "./soft-glow";

export const MascotCrown = forwardRef(function MascotCrown(props, ref) {
  const geometry = useMemo(createCrownGeometry, []);
  const gem = useMemo(() => createCrownGemGeometry(), []);
  const light = mascotConfig.illumination;
  useEffect(() => () => { geometry.dispose(); gem.dispose(); }, [geometry, gem]);
  return (
    <group ref={ref} position={[0,2.27,0.025]} {...props}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial color={mascotConfig.colors.crown} roughness={0.27} metalness={0.12} clearcoat={0.85} clearcoatRoughness={0.18} />
      </mesh>
      <mesh geometry={gem} position={[0,0.5025,0.56]}>
        <meshPhysicalMaterial attach="material-0" color="#f5eaff" emissive={light.color} emissiveIntensity={light.gemEmission} roughness={0.14} clearcoat={1} toneMapped={false} />
        <meshPhysicalMaterial attach="material-1" color="#e8ccfa" emissive="#e6bcff" emissiveIntensity={light.gemEmission} roughness={0.2} clearcoat={1} toneMapped={false} />
      </mesh>
      <SoftGlow position={[0,0.5025,0.62]} scale={[0.85,1.15,1]} color={light.color} intensity={light.gemHalo} />
      <pointLight position={[0,0.51,0.83]} color={light.color} intensity={light.gemBounce} distance={1.4} decay={2} />
    </group>
  );
});
