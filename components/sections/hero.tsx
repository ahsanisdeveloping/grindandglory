import { BrandLogo } from "@/components/hero/brand-logo";
import { FloatingDecorations } from "@/components/hero/floating-decorations";
import { HeroNavigation } from "@/components/hero/hero-navigation";
import { PlatformIcons } from "@/components/hero/platform-icons";
import { MascotViewport } from "@/components/three/mascot/mascot-viewport";
import { MobileMenu } from "@/components/layout/mobile-menu";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={`hero ${styles.hero}`} aria-labelledby="hero-title">
      <BrandLogo />
      <div className={styles.mobileMenu}><MobileMenu /></div>
      <div className={styles.left}>
        <span className={styles.pill}>premium gaming accounts</span>
        <h1 id="hero-title">rare accounts.<br />real flex.</h1>
        <HeroNavigation />
      </div>
      <div className={styles.mascot}><MascotViewport /></div>
      <div className={styles.right}>
        <span className={styles.pill}>meet your new grind mate</span>
        <h2>we do the grind.<br />you get the glory.</h2>
        <p>Premium gaming progression,<br className={styles.desktopBreak} /> achievement and rarity, made simple.</p>
        <PlatformIcons />
      </div>
      <FloatingDecorations />
    </section>
  );
}
