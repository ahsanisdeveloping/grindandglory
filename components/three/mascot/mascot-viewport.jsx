"use client";

import Image from "next/image";
import { Component, Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./mascot.module.css";

const MascotScene = lazy(() => import("./mascot-scene"));

const desktopQuery = "(min-width: 768px)";
function subscribeDesktop(onChange) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const getServerSnapshot = () => false;

function MascotPoster() {
  return <Image src="/images/mascot/mobile-mascot.webp" alt="" fill className={styles.poster} sizes="(max-width: 767px) calc(100vw - 16px), (max-width: 1199px) 56vw, 760px" preload />;
}

export function MascotViewport() {
  // Start with server-rendered artwork. The heavy scene module is never mounted
  // or requested on mobile; switching to desktop opts into the dynamic import.
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerSnapshot);
  if (desktop) return <DesktopMascotViewport />;
  return (
    <div className={styles.viewport} data-mascot-scene data-renderer="image" data-ready="true" data-paused="true">
      <div className={styles.ambientShadow} aria-hidden="true" />
      <div className={styles.contactShadow} aria-hidden="true" />
      <MascotPoster />
      <span className="sr-only">An ivory mascot wearing a glossy plum controller mask, glowing lavender eyes, and the Grind and Glory crown.</span>
    </div>
  );
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function DesktopMascotViewport() {
  const element = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const target = element.current;
    const hero = target.closest(".hero");
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(target);
    const visibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const move = (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      pointer.current.y = Math.max(-1, Math.min(1, 1 - (event.clientY - rect.top) / rect.height * 2));
    };
    const reset = () => { pointer.current.x = 0; pointer.current.y = 0; };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  const paused = !visible || !documentVisible;
  return (
    <div ref={element} className={styles.viewport} data-mascot-scene data-renderer={failed ? "image" : "webgl"} data-ready={ready || failed} data-paused={paused || reducedMotion || failed}>
      <div className={styles.ambientShadow} aria-hidden="true" />
      <div className={styles.contactShadow} aria-hidden="true" />
      <MascotPoster />
      {!failed && (
        <SceneBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <MascotScene pointer={pointer} reducedMotion={reducedMotion} paused={paused} sceneElement={element} onReady={() => setReady(true)} onContextLost={() => setFailed(true)} />
          </Suspense>
        </SceneBoundary>
      )}
      {(!ready || failed) && (
        <div className="sr-only" role="status">
          {failed ? "Showing a still mascot. The interactive view is unavailable." : "Loading your interactive grind mate."}
        </div>
      )}
      <span className="sr-only">An ivory 3D mascot wearing a glossy plum controller mask and the Grind and Glory crown.{!failed && " Its eyes follow your cursor."}</span>
    </div>
  );
}
