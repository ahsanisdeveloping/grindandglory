import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Game } from "@/data/games";
import styles from "./game-tile.module.css";

export function GameTile({ game }: { game: Game }) {
  return (
    <li className={styles.tile} data-animate="game-tile">
      <a
        className={styles.link}
        href="#marketplace"
        aria-label={`Explore ${game.name} on our marketplace`}
      >
        <span className={styles.logo}>
          <Image
            src={game.logo}
            alt=""
            width={160}
            height={80}
            className={game.logoTone === "dark" ? styles.darkLogo : undefined}
          />
        </span>
        {/* <span className={styles.name}>{game.name}</span> */}
        <ArrowUpRight className={styles.arrow} aria-hidden="true" />
      </a>
    </li>
  );
}
