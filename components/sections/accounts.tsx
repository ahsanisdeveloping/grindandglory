import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AccountCard } from "@/components/accounts/account-card";
import { getAccountInventory } from "@/lib/eldorado";
import "@/components/accounts/accounts.css";

function previewArtwork(game: string) {
  const name = game.toLowerCase();
  if (name.includes("valorant")) return { src: "/images/games/valorant.webp", label: "VALORANT · Game artwork" };
  if (name.includes("league of legends")) return { src: "/images/games/league.webp", label: "League of Legends · Game artwork" };
  if (name.includes("fortnite")) return { src: "/images/games/fortnite.webp", label: "Fortnite · Game artwork" };
  return { src: "/images/brand/pattern.webp", label: "Grind&Glory · Collection artwork" };
}

export function AccountsLoading() {
  return <Section id="accounts" className="home-accounts" aria-label="Loading account collection">
    <Container>
      <p className="eyebrow">The account collection</p>
      <div className="home-accounts-loading" role="status">
        <span className="sr-only">Loading account listings</span>
        {[0, 1, 2, 3].map((index) => <div key={index} aria-hidden="true"><div /><span /><span /></div>)}
      </div>
    </Container>
  </Section>;
}

export async function Accounts() {
  const inventory = await getAccountInventory();
  const selected = inventory.offers.slice(0, 4);
  return (
    <Section id="accounts" className="home-accounts" tabIndex={-1} aria-labelledby="home-accounts-title">
      <Container>
        <div className="home-accounts-topline">
          <p className="eyebrow">The account collection</p>
          <span><ShieldCheck size={15} aria-hidden="true" /> Checkout on Eldorado</span>
        </div>
        <div className="home-accounts-intro">
          <div>
          <h2 id="home-accounts-title" className="section-title" data-animate="text-reveal">Your next account.<br /><span className="display-word">Already in play.</span></h2>
          <p className="section-intro">Ranks earned. Collections built. Find your next move.</p>
          </div>
          <Link href="/accounts" className="home-accounts-link">Explore accounts{!inventory.error && inventory.count > 0 && <span className="home-accounts-count">{inventory.count}</span>}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        {selected.length ? <ul className="accounts-grid home-accounts-grid" aria-label="Latest account listings">
          {selected.map((offer) => <li key={offer.id}><AccountCard offer={offer} headingLevel={3} previewArtwork={previewArtwork(offer.game)} /></li>)}
        </ul> : <p className="home-accounts-empty">{inventory.error ? "Our collection is taking a moment to load. Explore accounts to try again." : "The next collection is on its way. Check back for more glory."}</p>}
        <div className="home-accounts-footnote"><p>{selected.length ? `Showing ${selected.length} of ${inventory.count} accounts` : "Our accounts. Your next move."}</p><span>Full details and current availability on Eldorado <ArrowUpRight size={14} aria-hidden="true" /></span></div>
      </Container>
    </Section>
  );
}
