"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./scroll-controller.module.css";

export function ScrollController() {
  const host = useRef<HTMLDivElement>(null);
  const object = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const interaction = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = host.current!;
    const visual = object.current!;
    const surface = canvas.current!;
    const control = interaction.current!;
    const hero = root.closest<HTMLElement>(".hero")!;
    const anchor = root.parentElement!;
    let disposed = false;
    let release = () => {};
    let syncLoop = () => {};
    let draw: (() => void) | undefined;
    let visible = false;
    let size = 0;
    let progress = 0;

    const update = () => {
      const bounds = hero.getBoundingClientRect();
      progress = reducedMotion ? 0 : Math.min(1, Math.max(0, -bounds.top / bounds.height));
      // Stay in the hero's coordinate system; its overflow clips the entire scene.
      visual.style.transform = `translate(calc(-50% + ${progress * size * 0.18}px), calc(-50% - ${progress * size * 0.16}px)) scale(${1 - progress * 0.12})`;
      root.dataset.progress = progress.toFixed(3);
      root.style.visibility = bounds.bottom > 0 && bounds.top < innerHeight ? "visible" : "hidden";
      if (reducedMotion) draw?.();
    };
    const measure = () => {
      size = Math.min(innerWidth < 768 ? 360 : 650, anchor.clientWidth * 1.3);
      visual.style.setProperty("--controller-size", `${size}px`);
      update();
      draw?.();
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(anchor);
    resizeObserver.observe(hero);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    });
    observer.observe(hero);
    const visibilityChange = () => syncLoop();
    document.addEventListener("visibilitychange", visibilityChange);
    window.addEventListener("scroll", update, { passive: true });
    measure();

    void Promise.all([import("three"), import("./controller-model")]).then(([THREE, { createController }]) => {
      if (disposed) return;
      const context = surface.getContext("webgl2", { alpha: true, antialias: true });
      if (!context) return;
      const renderer = new THREE.WebGLRenderer({ canvas: surface, context, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.z = 9;
      // Broad, balanced illumination keeps both faces soft during a full turn.
      scene.add(new THREE.HemisphereLight(0xf5f5f2, 0x725b6d, 2.2));
      for (const [x, y, z, intensity] of [[-3, 4, 5, 1.6], [3, 2, 4, 0.7], [3, 4, -5, 1.6], [-3, 2, -4, 0.7]]) {
        const light = new THREE.DirectionalLight(0xf5f5f2, intensity);
        light.position.set(x, y, z);
        scene.add(light);
      }
      const model = createController();
      scene.add(model);
      let lastSize = 0;
      let elapsed = 0;
      let lastTime: number | undefined;
      let contextLost = false;
      let rotationX = 0;
      let rotationY = 0;
      let drag: { id: number; x: number; y: number; touch: boolean } | undefined;
      draw = () => {
        if (contextLost) return;
        if (lastSize !== size) { renderer.setSize(size, size, false); lastSize = size; }
        const idle = reducedMotion ? 0 : elapsed;
        model.rotation.set(
          -0.12 + Math.sin(idle * 0.65) * 0.09 + progress * 0.35 + rotationX,
          -0.22 + Math.sin(idle * 0.45) * 0.3 + progress * 2.2 + rotationY,
          -0.08 + Math.sin(idle * 0.5) * 0.05 - progress * 0.22,
        );
        model.position.y = -0.5 + Math.sin(idle * 0.9) * 0.055;
        renderer.render(scene, camera);
        root.dataset.pose = model.rotation.y.toFixed(4);
      };
      const tick = (time: number) => {
        if (lastTime !== undefined && !drag) elapsed += Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        draw?.();
      };
      syncLoop = () => {
        lastTime = undefined;
        renderer.setAnimationLoop(visible && !document.hidden && !reducedMotion && !contextLost ? tick : null);
        if (visible && !document.hidden) draw?.();
      };
      const down = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || drag) return;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, touch: event.pointerType === "touch" };
        control.setPointerCapture(event.pointerId);
        control.dataset.dragging = "true";
      };
      const move = (event: PointerEvent) => {
        if (!drag || drag.id !== event.pointerId) return;
        const sensitivity = Math.PI * 2 / Math.max(size, 1);
        rotationY += (event.clientX - drag.x) * sensitivity;
        // A vertical touch gesture continues to scroll the page.
        if (!drag.touch) rotationX = Math.max(-1.3, Math.min(1.3, rotationX + (event.clientY - drag.y) * sensitivity));
        drag.x = event.clientX;
        drag.y = event.clientY;
        draw?.();
      };
      const end = () => {
        if (!drag) return;
        const id = drag.id;
        drag = undefined;
        control.dataset.dragging = "false";
        if (control.hasPointerCapture(id)) control.releasePointerCapture(id);
      };
      const key = (event: KeyboardEvent) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") { rotationX = 0; rotationY = 0; }
        if (event.key === "ArrowLeft") rotationY -= 0.2;
        if (event.key === "ArrowRight") rotationY += 0.2;
        if (event.key === "ArrowUp") rotationX = Math.max(-1.3, rotationX - 0.2);
        if (event.key === "ArrowDown") rotationX = Math.min(1.3, rotationX + 0.2);
        draw?.();
      };
      control.addEventListener("pointerdown", down);
      control.addEventListener("pointermove", move);
      control.addEventListener("pointerup", end);
      control.addEventListener("pointercancel", end);
      control.addEventListener("lostpointercapture", end);
      control.addEventListener("keydown", key);
      window.addEventListener("blur", end);
      control.disabled = false;
      const lost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        end();
        control.disabled = true;
        visual.dataset.ready = "false";
        syncLoop();
      };
      const restored = () => {
        contextLost = false;
        control.disabled = false;
        syncLoop();
        visual.dataset.ready = "true";
      };
      surface.addEventListener("webglcontextlost", lost);
      surface.addEventListener("webglcontextrestored", restored);
      release = () => {
        end();
        control.disabled = true;
        control.removeEventListener("pointerdown", down);
        control.removeEventListener("pointermove", move);
        control.removeEventListener("pointerup", end);
        control.removeEventListener("pointercancel", end);
        control.removeEventListener("lostpointercapture", end);
        control.removeEventListener("keydown", key);
        window.removeEventListener("blur", end);
        renderer.setAnimationLoop(null);
        surface.removeEventListener("webglcontextlost", lost);
        surface.removeEventListener("webglcontextrestored", restored);
        const materials = new Set<import("three").Material>();
        const geometries = new Set<import("three").BufferGeometry>();
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            geometries.add(child.geometry);
            for (const material of Array.isArray(child.material) ? child.material : [child.material]) materials.add(material);
          }
        });
        materials.forEach((material) => material.dispose());
        geometries.forEach((geometry) => geometry.dispose());
        renderer.dispose();
        visual.dataset.ready = "false";
      };
      syncLoop();
      draw();
      visual.dataset.ready = "true";
    }).catch(() => { /* Preserve the decorative fallback if WebGL is unavailable. */ });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", visibilityChange);
      release();
    };
  }, [reducedMotion]);

  return <div ref={host} className={styles.scene} data-controller-scene>
    <div ref={object} className={styles.object} aria-hidden="true">
      <div className={styles.fallback} />
      <div className={styles.fallbackCrown} />
      <canvas ref={canvas} />
    </div>
    <button ref={interaction} type="button" className={styles.interaction} disabled
      aria-label="Rotate the crowned controller"
      aria-describedby="controller-instructions" />
    <span id="controller-instructions" className="sr-only">Drag left or right to rotate. With a mouse, drag up or down to tilt. Use the arrow keys to rotate and Home to reset.</span>
    <span className={styles.hint} aria-hidden="true">Drag to rotate</span>
  </div>;
}
