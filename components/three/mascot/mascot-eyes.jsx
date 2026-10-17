import { forwardRef } from "react";
import { faceDepth } from "./mascot-geometry";
import { mascotConfig } from "./mascot-config";
import { SoftGlow } from "./soft-glow";

export const MascotEyes = forwardRef(function MascotEyes({ pupils }, ref) {
  const light = mascotConfig.illumination;
  return (
    <group ref={ref} position={[0,1.4,0]}>
      {[-0.67,0.67].map((x,index) => (
        <group key={x} position={[x,0,faceDepth(x,1.29) + 0.13]} rotation={[0,x * 0.09,0]}>
          <mesh><sphereGeometry args={[0.334,40,32]} /><meshPhysicalMaterial color="#170d1d" roughness={0.3} clearcoat={0.7} /></mesh>
          <mesh position={[0,-0.025,0.108]} scale={[0.287,0.292,0.205]}>
            <sphereGeometry args={[1,40,32]} /><meshPhysicalMaterial color={mascotConfig.colors.iris} emissive={light.color} emissiveIntensity={light.irisEmission} roughness={0.24} metalness={0} clearcoat={1} />
          </mesh>
          <mesh position={[0,-0.014,0.177]} rotation={[0,0,Math.PI]}>
            <torusGeometry args={[0.292,0.014,10,48,Math.PI]} />
            <meshBasicMaterial color="#cc8df4" toneMapped={false} />
          </mesh>
          <SoftGlow position={[0,-0.14,0.24]} scale={[0.94,0.7,1]} color={light.color} intensity={light.eyeHalo} />
          <pointLight position={[0,-0.23,0.48]} color={light.color} intensity={light.eyeBounce} distance={0.9} decay={2} />
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
