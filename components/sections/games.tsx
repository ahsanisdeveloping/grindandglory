import { ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GamePanel } from "@/components/ui/game-panel";
import { games } from "@/data/games";

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
        <div className="games-grid" data-animate="games-track">
          {games.map((game, index) => (
            <GamePanel key={game.id} game={game} index={index} />
          ))}
        </div>
        <p className="games-footnote">
          A look at our gaming world. Current availability and account details
          are listed on the marketplace.
        </p>
      </Container>
    </Section>
  );
}
