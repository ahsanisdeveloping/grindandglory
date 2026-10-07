"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, inView, scroll, stagger } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ease = [0.23, 1, 0.32, 1] as const;
const revealSelector = [
  '[data-animate="text-reveal"]',
  '[data-animate="process-pin"]',
  '[data-animate="why-media"]',
  '[data-animate="final-title"]',
  ".section-note",
  ".section-intro",
  ".manifesto-bottom",
  ".games-heading > p",
  ".games-footnote",
  ".marketplace-detail",
  ".marketplace-layout > div:first-child > .button",
  ".final-cta__layout > div > p",
  ".final-cta__layout > div > .button",
  ".final-cta__mark",
].join(",");
const staggerSelector = [
  '[data-animate="grind-item"]',
  '[data-animate="process-step"]',
  '[data-animate="reason"]',
  '[data-animate="brand-statement"] > span',
  ".footer-top > *",
  ".footer-wordmark",
  ".footer-bottom",
].join(",");

/** Adds motion to the server-rendered page without altering section layouts. */
export function SiteMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion) return;

    const controls: { cancel: () => void }[] = [];
    const disposers: (() => void)[] = [];
    const originalStyles = new Map<HTMLElement, string | null>();
    const remember = (elements: HTMLElement[]) => {
      elements.forEach((element) => {
        if (!originalStyles.has(element)) {
          originalStyles.set(element, element.getAttribute("style"));
        }
      });
    };
    const reveal = (elements: HTMLElement[], delay = 0, distance = 24, interval = 0.09) => {
      if (!elements.length) return;
      remember(elements);
      controls.push(
        animate(
          elements,
          { opacity: [0, 1], y: [distance, 0] },
          { duration: 0.65, ease, delay: stagger(interval, { startDelay: delay }) },
        ),
      );
    };
    const select = (selector: string, parent: ParentNode = root) =>
      Array.from(parent.querySelectorAll<HTMLElement>(selector));

    reveal(select('[data-animate="header"]'), 0, -12);
    reveal(select(".hero-topline, .hero-title__intro"), 0.08, 16);
    reveal(select('[data-animate="hero-copy"]'), 0.35, 18);

    // Reveal once when each section enters; never hide offscreen content or
    // animate an ancestor of a keyboard-focused control.
    const sections = select("main > section:not(.hero), .site-footer");
    sections.forEach((section) => {
      disposers.push(
        inView(
          section,
          () => {
            if (section.contains(document.activeElement)) return;
            reveal(select(revealSelector, section));
            reveal(select(staggerSelector, section), 0.12, 32);
            reveal(select('[data-animate="game-tile"]', section), 0.12, 16, 0.045);
          },
          { amount: "some", margin: "0px 0px -8% 0px" },
        ),
      );
    });

    // Overscan keeps the decorative pattern covered while it moves on scroll.
    select('[data-animate="pattern-parallax"]').forEach((pattern) => {
      remember([pattern]);
      const animation = animate(
        pattern,
        { y: [-28, 28], scale: 1.15 },
        { ease: "linear", autoplay: false },
      );
      controls.push(animation);
      disposers.push(
        scroll(animation, {
          target: pattern.parentElement!,
          offset: ["start end", "end start"],
        }),
      );
    });

    // Pointer-only feedback keeps keyboard navigation immediate.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      select(".button, .back-to-top").forEach((element) => {
        remember([element]);
        let interaction: { stop: () => void } | undefined;
        const move = (raised: boolean) => {
          interaction?.stop();
          interaction = animate(
            element,
            { y: raised ? -3 : 0 },
            { type: "spring", stiffness: 400, damping: 30 },
          );
        };
        const enter = (event: PointerEvent) => {
          if (event.pointerType === "mouse") move(true);
        };
        const leave = () => move(false);
        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointerleave", leave);
        disposers.push(() => {
          interaction?.stop();
          element.removeEventListener("pointerenter", enter);
          element.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      disposers.forEach((dispose) => dispose());
      controls.forEach((control) => control.cancel());
      originalStyles.forEach((style, element) => {
        if (style === null) element.removeAttribute("style");
        else element.setAttribute("style", style);
      });
    };
  }, [reducedMotion]);

  return (
    <div id="top" ref={scope}>
      {children}
    </div>
  );
}
