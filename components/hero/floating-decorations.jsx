import { Sparkle } from "lucide-react";
import Image from "next/image";
import styles from "@/components/sections/hero.module.css";

export function FloatingDecorations() {
  return (
    <div className={styles.decorations} aria-hidden="true">
      <Sparkle className={styles.starOne} />
      <Sparkle className={styles.starTwo} />
      <Sparkle className={styles.starThree} fill="currentColor" strokeWidth={0} />
      {[styles.crownOne, styles.crownTwo].map((className) => (
        <span className={className} key={className}><Image src="/images/brand/hero-mark.png" alt="" width={44} height={49} /></span>
      ))}
    </div>
  );
}
