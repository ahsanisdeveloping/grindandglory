"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function StickyHeader({ children, revealAfterHero = false }: { children: ReactNode; revealAfterHero?: boolean }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const target = revealAfterHero ? document.querySelector(".hero") : sentinel.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(revealAfterHero ? entry.boundingClientRect.bottom <= 88 : !entry.isIntersecting),
      { rootMargin: revealAfterHero ? "-88px 0px 0px 0px" : "24px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [revealAfterHero]);

  return (
    <>
      <div ref={sentinel} className="header-sentinel" aria-hidden="true" />
      <header className="site-header" data-scrolled={scrolled} data-hero-header={revealAfterHero || undefined}>
        {children}
      </header>
    </>
  );
}
