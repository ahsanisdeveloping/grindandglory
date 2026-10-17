import { useMemo } from "react";
import { AdditiveBlending, Color } from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 glowColor;
  uniform float strength;
  void main() {
    float radius = length((vUv - 0.5) * 2.0);
    float falloff = pow(max(0.0, 1.0 - radius), 3.0);
    gl_FragColor = vec4(glowColor, falloff * strength);
    #include <colorspace_fragment>
  }
`;

// Local, depth-tested light spill: no full-screen bloom or extra render passes.
export function SoftGlow({ color, intensity, ...props }) {
  const uniforms = useMemo(() => ({
    glowColor: { value: new Color(color) },
    strength: { value: intensity },
  }), [color, intensity]);

  return (
    <mesh {...props} raycast={() => null}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} blending={AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
