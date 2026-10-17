import { forwardRef } from "react";
import { faceDepth } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";

export const MascotEyes = forwardRef(function MascotEyes({ pupils }, ref) {
  return (
    <group ref={ref} position={[0,1.4,0]}>
      {[-0.67,0.67].map((x,index) => (
        <group key={x} position={[x,0,faceDepth(x,1.29) + 0.13]} rotation={[0,x * 0.09,0]}>
          <mesh><sphereGeometry args={[0.334,40,32]} /><meshPhysicalMaterial color="#170d1d" roughness={0.3} clearcoat={0.7} /></mesh>
          <mesh position={[0,-0.025,0.108]} scale={[0.287,0.292,0.205]}>
            <sphereGeometry args={[1,40,32]} /><meshPhysicalMaterial color={mascotConfig.colors.iris} roughness={0.24} metalness={0} clearcoat={1} />
          </mesh>
          <group ref={(node) => { pupils.current[index] = node; }}>
            <mesh position={[0,0.045,0.241]} scale={[0.232,0.238,0.151]}>
              <sphereGeometry args={[1,40,32]} /><meshPhysicalMaterial color={mascotConfig.colors.pupil} roughness={0.13} clearcoat={1} clearcoatRoughness={0.08} />
            </mesh>
            <mesh position={[-0.092,0.155,0.364]} scale={[0.078,0.084,0.032]}><sphereGeometry args={[1,24,20]} /><meshBasicMaterial color="#ffffff" /></mesh>
            <mesh position={[0.095,-0.065,0.37]} scale={[0.022,0.022,0.012]}><sphereGeometry args={[1,16,12]} /><meshBasicMaterial color="#e5c9ef" /></mesh>
          </group>
        </group>
      ))}
    </group>
  );
});
