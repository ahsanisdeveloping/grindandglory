import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AccountCard } from "@/components/accounts/account-card";
import { getAccountInventory } from "@/lib/eldorado";
import "@/components/accounts/accounts.css";

export async function Accounts() {
  const inventory = await getAccountInventory();
  const selected = inventory.offers.slice(0, 3);
  return (
    <Section id="accounts" className="home-accounts" tabIndex={-1} aria-labelledby="home-accounts-title">
      <Container>
        <div className="home-accounts-intro">
          <div>
          <h2 id="home-accounts-title" className="section-title" data-animate="text-reveal">We put in the hours.<br />You take it <span className="display-word">from here.</span></h2>
          <p className="section-intro">A new rank. A rare find. Your next chapter is already in play.</p>
          </div>
          <Link href="/accounts" className="home-accounts-link">Explore accounts <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </div>
        {selected.length ? <ul className="accounts-grid home-accounts-grid" aria-label="Latest account listings">
          {selected.map((offer) => <li key={offer.id}><AccountCard offer={offer} headingLevel={3} /></li>)}
        </ul> : <p className="home-accounts-empty">{inventory.error ? "Our collection is taking a moment to load. Explore accounts to try again." : "The next collection is on its way. Check back for more glory."}</p>}
        <div className="home-accounts-footnote"><p>{inventory.error ? "Our accounts. Your next move." : `${inventory.count} accounts. Your next move.`}</p><span>Full listings & checkout on Eldorado <ArrowUpRight size={14} aria-hidden="true" /></span></div>
      </Container>
    </Section>
  );
}
