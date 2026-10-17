"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./mascot.module.css";

const MascotScene = dynamic(() => import("./mascot-scene"), { ssr: false });

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function MascotViewport() {
  const element = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const target = element.current;
    const hero = target.closest(".hero");
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(target);
    const media = window.matchMedia("(max-width: 767px)");
    const updateCompact = () => setCompact(media.matches);
    updateCompact();
    media.addEventListener("change", updateCompact);
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
      media.removeEventListener("change", updateCompact);
      document.removeEventListener("visibilitychange", visibility);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  const paused = userPaused || !visible || !documentVisible;
  return (
    <div ref={element} className={styles.viewport} data-mascot-scene data-ready={ready && !failed} data-paused={paused || reducedMotion}>
      <div className={styles.ambientShadow} aria-hidden="true" />
      {!failed && (
        <SceneBoundary onError={() => setFailed(true)}>
          <MascotScene pointer={pointer} reducedMotion={reducedMotion} paused={paused} compact={compact} sceneElement={element} onReady={() => setReady(true)} onContextLost={() => setFailed(true)} />
        </SceneBoundary>
      )}
      {(!ready || failed) && (
        <div className={styles.loading} data-scene-loading role="status">
          {failed ? <><span>Your grind mate is taking a break.</span><a href="#accounts">Explore the collection</a></> : <span>Meeting your grind mate…</span>}
        </div>
      )}
      <noscript>
        <style>{"[data-mascot-scene] [data-scene-loading] { display: none; }"}</style>
        <p className={styles.loading}>Enable JavaScript to meet your interactive grind mate.</p>
      </noscript>
      <span className="sr-only">An ivory 3D mascot wearing a glossy plum controller mask and the Grind and Glory crown. Its eyes follow your cursor.</span>
      {ready && !failed && !reducedMotion && (
        <button className={styles.pause} type="button" onClick={() => setUserPaused((value) => !value)} aria-label={userPaused ? "Play mascot animation" : "Pause mascot animation"} aria-pressed={userPaused}>
          {userPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
