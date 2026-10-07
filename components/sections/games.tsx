import { ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GameTile } from "@/components/ui/game-tile";
import { games } from "@/data/games";
import styles from "./games.module.css";

export function Games() {
  return (
    <Section
      id="games"
      tabIndex={-1}
      className="games"
      aria-labelledby="games-title"
    >
      <Container>
        <Eyebrow>The games we live in</Eyebrow>
        <div className="games-heading">
          <h2
            className="section-title"
            id="games-title"
            data-animate="text-reveal"
          >
            Different worlds.
            <br />
            Same obsession.
          </h2>
          <ArrowDownRight strokeWidth={1} aria-hidden="true" />
        </div>
        <ul className={styles.grid} aria-label="Popular multiplayer games">
          {games.map((game) => (
            <GameTile key={game.id} game={game} />
          ))}
        </ul>
        <p className="games-footnote">
          A look at our gaming world. Current availability and account details
          are listed on the marketplace.
        </p>
      </Container>
    </Section>
  );
}
