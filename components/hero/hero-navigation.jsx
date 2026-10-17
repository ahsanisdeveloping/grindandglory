import { ArrowUpRight } from "lucide-react";
import styles from "@/components/sections/hero.module.css";

export const heroLinks = [
  { label: "The collection", href: "#accounts" },
  { label: "Why us", href: "#about" },
  { label: "How it works", href: "#process" },
  { label: "Get in touch", href: "#contact" },
];

export function HeroNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Explore Grind and Glory">
      {heroLinks.map(({ label, href }) => (
        <a href={href} key={href}><span>{label}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
      ))}
    </nav>
  );
}
