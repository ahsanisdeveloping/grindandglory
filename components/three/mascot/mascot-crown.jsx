import { forwardRef, useMemo, useEffect } from "react";
import { createCrownGeometry } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";

export const MascotCrown = forwardRef(function MascotCrown(props, ref) {
  const geometry = useMemo(createCrownGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group ref={ref} position={[0,2.27,0.025]} {...props}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial color={mascotConfig.colors.crown} roughness={0.27} metalness={0.12} clearcoat={0.85} clearcoatRoughness={0.18} />
      </mesh>
    </group>
  );
});
