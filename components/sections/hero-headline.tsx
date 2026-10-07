"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./hero.module.css";

const pairs = [
  ["GRIND.", "GLORY."],
  ["WORK.", "WINS."],
  ["PREP.", "EDGE."],
  ["CLIMB.", "RANK."],
  ["HUNT.", "LOOT."],
  ["QUESTS.", "GEAR."],
  ["LEVELS.", "POWER."],
  ["HOURS.", "SKINS."],
  ["BUILD.", "BOOST."],
] as const;

/** One clock keeps the effort and reward words paired throughout the loop. */
export function HeroHeadline() {
  const root = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [frame, setFrame] = useState({ index: 0, left: 0, right: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    let index = 0;
    let left = 0;
    let right = 0;
    let phase: "left" | "right" | "hold" | "erase" = "left";
    let delay = 250;
    let inView = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (inView && !document.hidden) timer = setTimeout(tick, delay);
    };
    const tick = () => {
      const [effort, reward] = pairs[index];
      if (phase === "left") {
        left++;
        delay = 110;
        if (left === effort.length) {
          phase = "right";
          delay = 350;
        }
      } else if (phase === "right") {
        right++;
        delay = 110;
        if (right === reward.length) {
          phase = "hold";
          delay = 2600;
        }
      } else {
        phase = "erase";
        left = Math.max(0, left - 1);
        right = Math.max(0, right - 1);
        delay = 55;
        if (left === 0 && right === 0) {
          index = (index + 1) % pairs.length;
          phase = "left";
          delay = 350;
        }
      }
      setFrame({ index, left, right });
      schedule();
    };
    const resume = () => {
      clearTimeout(timer);
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      resume();
    });
    observer.observe(root.current!);
    document.addEventListener("visibilitychange", resume);
    schedule();
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };
  }, [reducedMotion]);

  const index = reducedMotion ? 0 : frame.index;
  return (
    <h1 ref={root} id="hero-title" className={`hero-title ${styles.title}`} data-cycle-index={index}>
      {pairs[index].map((word, row) => (
        <span key={row} className={`hero-title__group ${styles.group}`} data-animate="hero-title">
          <span className={`hero-title__intro ${styles.intro}`}>
            {row === 0 ? "We do the" : "You get the"}
          </span>
          <span className={`hero-title__display ${styles.display}`}>
            <span className="sr-only">{pairs[0][row]}</span>
            {pairs.map((pair) => (
              <span key={pair[row]} className={styles.wordReserve} aria-hidden="true">{pair[row]}</span>
            ))}
            <span className={styles.wordLetters} aria-hidden="true">
              {Array.from(word).map((letter, letterIndex) => (
                <span key={letterIndex} data-letter style={{ opacity: reducedMotion || letterIndex < (row === 0 ? frame.left : frame.right) ? 1 : 0 }}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        </span>
      ))}
    </h1>
  );
}
