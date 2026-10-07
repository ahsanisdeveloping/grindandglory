"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import { stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./typewriter.module.css";

type TypewriterProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  text: string;
  /** Milliseconds between letters. */
  speed?: number;
  /** Milliseconds before the first letter appears. */
  delay?: number;
};

/** Reveals text once on mount, reserving its full width throughout. */
export function Typewriter({
  text,
  speed = 100,
  delay = 0,
  className,
  ...props
}: TypewriterProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reducedMotion = usePrefersReducedMotion();
  const letters = Array.from(
    new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
    ({ segment }) => segment,
  );

  useEffect(() => {
    const elements = scope.current.querySelectorAll<HTMLElement>("[data-letter]");
    if (reducedMotion) return;

    // Set the initial state after hydration so server/no-JS content stays visible.
    elements.forEach((element) => {
      element.style.opacity = "0";
    });
    const animation = animate(
      elements,
      { opacity: [0, 1], y: ["0.12em", "0em"] },
      {
        duration: 0.12,
        ease: [0.23, 1, 0.32, 1],
        delay: stagger(Math.max(0, speed) / 1000, {
          startDelay: Math.max(0, delay) / 1000,
        }),
      },
    );

    return () => {
      animation.cancel();
      elements.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    };
  }, [animate, delay, reducedMotion, scope, speed, text]);

  return (
    <span ref={scope} className={cn(styles.root, className)} {...props}>
      <span className={styles.accessibleText}>{text}</span>
      <span aria-hidden="true">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={styles.letter}
            data-letter
          >
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}
