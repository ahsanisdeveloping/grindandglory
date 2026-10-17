import Image from "next/image";
import styles from "@/components/sections/hero.module.css";

export function PlatformIcons() {
  return (
    <ul className={styles.platforms} aria-label="Gaming platforms">
      {["Discord", "Steam", "PlayStation", "Xbox"].map((platform) => (
        <li key={platform} title={platform}><Image src={`/images/platforms/${platform.toLowerCase()}.svg`} alt={platform} width={34} height={34} /></li>
      ))}
    </ul>
  );
}
