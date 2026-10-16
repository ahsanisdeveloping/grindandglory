import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { AccountBrowser } from "@/components/accounts/account-browser";
import { getAccountInventory } from "@/lib/eldorado";
import { readAccountFilters } from "@/lib/account-filters";
import { site } from "@/data/site";
import "@/components/accounts/accounts.css";

export const metadata: Metadata = {
  title: "Gaming accounts | Grind&Glory",
  description: "Explore Grind&Glory's gaming accounts. Find your next rank, collection and chapter, with full listings on Eldorado.",
};

async function Inventory({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = readAccountFilters(await searchParams);
  const inventory = await getAccountInventory();
  return (
    <section id="inventory" className="accounts-inventory" aria-label="Available account listings">
      {inventory.error ? (
        <div className="accounts-empty" role="alert">
          <h2>Our listings couldn’t load.</h2>
          <p>Try again shortly, or explore the collection on Eldorado.</p>
          <a className="accounts-action" href={site.storeUrl} target="_blank" rel="noopener noreferrer">Visit store <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      ) : <AccountBrowser offers={inventory.offers} games={inventory.games} initialFilters={filters} />}
      <p className="accounts-marketplace-note">Your next chapter, purchased on Eldorado. Full details, current pricing and checkout live on the marketplace. <ArrowUpRight size={16} aria-hidden="true" /></p>
    </section>
  );
}

export default function AccountsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div id="top" className="accounts-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <div className="accounts-breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">Accounts</span></div>
          <div className="accounts-hero">
            <p className="accounts-eyebrow">The account collection</p>
            <h1>Skip the grind.<br />Find your <span>glory.</span></h1>
            <p className="accounts-intro">Ranks earned. Collections built. Your next chapter is already in play.</p>
          </div>
          <Suspense fallback={<div className="account-skeleton" role="status"><span className="sr-only">Loading account listings</span>{[0, 1, 2].map((i) => <div key={i}><div /><span /><span /></div>)}</div>}>
            <Inventory searchParams={searchParams} />
          </Suspense>
          <Link href="/" className="accounts-back">More about Grind&Glory <ArrowRight size={16} aria-hidden="true" /></Link>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
