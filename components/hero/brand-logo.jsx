import Image from "next/image";
import styles from "@/components/sections/hero.module.css";

export function BrandLogo() {
  return (
    <a className={styles.brand} href="#top" aria-label="Grind and Glory, back to top">
      <Image src="/images/brand/hero-wordmark.png" alt="Grind&Glory" width={620} height={85} className={styles.wordmark} sizes="(max-width: 767px) 260px, 420px" preload />
    </a>
  );
}
