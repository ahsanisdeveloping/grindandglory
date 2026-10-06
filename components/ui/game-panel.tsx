import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Game } from "@/data/games";

export function GamePanel({ game, index }: { game: Game; index: number }) {
  return (
    <article
      className={`game-panel game-panel--${game.id}`}
      data-animate="game-panel"
    >
      <a
        href="#marketplace"
        aria-label={`Explore ${game.name} accounts through our marketplace`}
      >
        <div className="game-panel__image" data-animate="game-media">
          <Image
            src={game.image}
            alt={game.imageAlt}
            fill
            sizes={
              index === 0
                ? "(max-width: 767px) 90vw, 48vw"
                : "(max-width: 767px) 90vw, 28vw"
            }
            style={{ objectPosition: game.imagePosition }}
          />
          <span className="game-panel__wash" aria-hidden="true" />
          <span className="game-panel__art-title" aria-hidden="true">
            {game.name}
          </span>
        </div>
        <div className="game-panel__details">
          <div className="game-panel__title">
            <h3>{game.name}</h3>
            <ArrowUpRight aria-hidden="true" />
          </div>
          <p>{game.description}</p>
          <ul aria-label={`${game.name} account features`}>
            {game.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </a>
    </article>
  );
}
