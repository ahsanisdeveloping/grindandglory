import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { MascotBody } from "./mascot-body";
import { MascotMask } from "./mascot-mask";
import { MascotEyes } from "./mascot-eyes";
import { MascotCrown } from "./mascot-crown";
import { mascotConfig } from "./mascot-config";

export function MascotCharacter({ pointer, reducedMotion, paused, sceneElement }) {
  const character = useRef();
  const eyes = useRef();
  const crown = useRef();
  const pupils = useRef([]);
  const time = useRef(0);
  const nextBlink = useRef(3.7);
  const blinkStart = useRef(-100);
  const telemetryAt = useRef(0);
  const motion = mascotConfig.motion;

  useFrame((_, delta) => {
    if (paused || !character.current) return;
    const dt = Math.min(delta, 0.05);
    if (!reducedMotion) time.current += dt;
    const t = time.current;
    const targetX = reducedMotion ? 0 : pointer.current.x;
    const targetY = reducedMotion ? 0 : pointer.current.y;
    const turn = targetX * motion.turn + (reducedMotion ? 0 : Math.sin(t * 0.53) * 0.015);
    character.current.rotation.y = MathUtils.damp(character.current.rotation.y, turn, motion.damping, dt);
    character.current.rotation.x = MathUtils.damp(character.current.rotation.x, -targetY * motion.tilt, motion.damping, dt);
    character.current.position.y = reducedMotion ? 0 : Math.sin(t * motion.floatSpeed) * motion.float;
    character.current.scale.y = reducedMotion ? 1 : 1 + Math.sin(t * 1.1) * 0.004;
    crown.current.rotation.z = reducedMotion ? 0 : Math.sin(t * 1.05 - 0.7) * 0.009;
    crown.current.rotation.x = -0.06 + (reducedMotion ? 0 : Math.sin(t * 1.2) * 0.012);
    crown.current.rotation.y = -0.065;
    crown.current.position.y = 2.27 + (reducedMotion ? 0 : Math.exp(-t * 3) * Math.sin(t * 7) * 0.055);
    // The clock advances only while the scene is visible, so returning never skips.
    if (!reducedMotion && t > nextBlink.current) {
      blinkStart.current = t;
      nextBlink.current = t + 3.4 + Math.random() * 3.1;
    }
    const blinkProgress = (t - blinkStart.current) / motion.blinkDuration;
    const blink = !reducedMotion && blinkProgress < 1 ? 1 - Math.sin(blinkProgress * Math.PI) * 0.96 : 1;
    eyes.current.scale.y = blink;
    for (const pupil of pupils.current) {
      if (!pupil) continue;
      pupil.position.x = MathUtils.damp(pupil.position.x, targetX * 0.032, 6, dt);
      pupil.position.y = MathUtils.damp(pupil.position.y, targetY * 0.027, 6, dt);
    }
    if (sceneElement.current && t - telemetryAt.current > 0.25) {
      sceneElement.current.setAttribute("data-rotation", character.current.rotation.y.toFixed(4));
      sceneElement.current.setAttribute("data-blink", blink.toFixed(3));
      telemetryAt.current = t;
    }
  });

  return (
    <group ref={character}>
      <MascotBody />
      <MascotMask />
      <MascotEyes ref={eyes} pupils={pupils} />
      <MascotCrown ref={crown} />
    </group>
  );
}
