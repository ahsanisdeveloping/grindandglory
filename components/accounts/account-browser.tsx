"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { FilterSelect } from "@/components/accounts/filter-select";
import { AccountCard } from "@/components/accounts/account-card";
import { accountsUrl, defaultAccountFilters, filterAccounts, readAccountFilters, type AccountFilters, type AccountOffer } from "@/lib/account-filters";

const budgets = [
  { value: "", label: "Any price", min: "", max: "" },
  { value: "under25", label: "Under $25", min: "", max: "25" },
  { value: "25to50", label: "$25 to $50", min: "25", max: "50" },
  { value: "50to100", label: "$50 to $100", min: "50", max: "100" },
  { value: "over100", label: "$100+", min: "100", max: "" },
];

export function AccountBrowser({ offers, games, initialFilters }: {
  offers: AccountOffer[];
  games: { id: string; name: string }[];
  initialFilters: AccountFilters;
}) {
  const searchParams = useSearchParams();
  const filters = readAccountFilters(Object.fromEntries(searchParams.entries()));
  // Next's native history integration updates URL state without a server/API request.
  const update = (patch: Partial<AccountFilters>) => {
    window.history.replaceState(null, "", accountsUrl({ ...filters, page: 1, ...patch }));
  };
  const matching = useMemo(() => filterAccounts(offers, filters), [offers, filters]);
  const page = filters.page || initialFilters.page;
  const visible = matching.slice((page - 1) * 12, page * 12);
  const totalPages = Math.ceil(matching.length / 12);
  const filtered = Boolean(filters.q || filters.game || filters.min || filters.max);
  const budget = budgets.find((b) => b.min === filters.min && b.max === filters.max)?.value ?? "custom";

  return (
    <>
      <div className="accounts-toolbar" role="search" aria-label="Filter accounts">
        <label className="accounts-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search accounts</span>
          <input type="search" placeholder="Find your account" value={filters.q} maxLength={160}
            onChange={(event) => update({ q: event.target.value })} />
        </label>
        <div className="accounts-selects">
          <FilterSelect label="Game" value={filters.game}
            options={[{ value: "", label: "All games" }, ...games.map((game) => ({ value: game.id, label: game.name })),
              ...(filters.game && !games.some((game) => game.id === filters.game) ? [{ value: filters.game, label: "Selected game" }] : [])]}
            onChange={(game) => update({ game })} />
          <FilterSelect label="Price range" value={budget} className="accounts-budget"
            options={[...budgets, ...(budget === "custom" ? [{ value: "custom", label: "Custom price" }] : [])]}
            onChange={(value) => {
              const selected = budgets.find((b) => b.value === value) ?? budgets[0];
              update({ min: selected.min, max: selected.max });
            }} />
          <FilterSelect label="Sort by" value={filters.sort} className="accounts-sort"
            options={[{ value: "newest", label: "Newest first" }, { value: "price-asc", label: "Price: low to high" }, { value: "price-desc", label: "Price: high to low" }]}
            onChange={(sort) => update({ sort })} />
        </div>
      </div>
      <div className="accounts-results-heading">
        <p role="status" aria-live="polite"><strong>{matching.length}</strong> {filtered ? "matching" : "available"} account{matching.length === 1 ? "" : "s"}</p>
        {filtered ? <button className="accounts-reset" onClick={() => update(defaultAccountFilters)}>Clear filters <X size={14} aria-hidden="true" /></button> : <span>From our Eldorado collection</span>}
      </div>
      {visible.length ? (
        <ul className="accounts-grid">{visible.map((offer) => <li key={offer.id}><AccountCard offer={offer} /></li>)}</ul>
      ) : (
        <div className="accounts-empty">
          <Search size={28} aria-hidden="true" />
          <h2>{filtered ? "No accounts match just yet." : page > 1 ? "You’ve reached the end." : "More glory is on the way."}</h2>
          <p>{filtered ? "Try another game, search or price range." : "Check back for the next collection."}</p>
          {(filtered || page > 1) && <button className="accounts-action" onClick={() => update(defaultAccountFilters)}>Browse all accounts <ArrowRight size={16} aria-hidden="true" /></button>}
        </div>
      )}
      {totalPages > 1 && <nav className="accounts-pagination" aria-label="Account listing pages">
        <button disabled={page <= 1} onClick={() => update({ page: page - 1 })}><ArrowLeft size={18} aria-hidden="true" />Previous</button>
        <p>Page {page} of {totalPages}</p>
        <button disabled={page >= totalPages} onClick={() => update({ page: page + 1 })}>Next<ArrowRight size={18} aria-hidden="true" /></button>
      </nav>}
    </>
  );
}
