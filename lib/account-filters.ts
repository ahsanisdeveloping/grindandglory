// Public listing data only. This module is safe to use in the browser.
export type AccountOffer = {
  id: string;
  title: string;
  gameId: string;
  game: string;
  image: string | null;
  url: string;
  amount: number;
  currency: string;
  delivery: string;
  details: { name: string; value: string }[];
  searchText: string;
};

export type AccountFilters = {
  q: string;
  game: string;
  sort: string;
  min: string;
  max: string;
  page: number;
};

export const defaultAccountFilters: AccountFilters = {
  q: "", game: "", sort: "newest", min: "", max: "", page: 1,
};

export function readAccountFilters(params: Record<string, string | string[] | undefined>): AccountFilters {
  const get = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const price = (key: string) => /^\d{1,7}(\.\d{1,2})?$/.test(get(key)) ? get(key) : "";
  return {
    q: get("q").slice(0, 160),
    game: /^[a-zA-Z0-9-]{1,80}$/.test(get("game")) ? get("game") : "",
    sort: ["newest", "price-asc", "price-desc"].includes(get("sort")) ? get("sort") : "newest",
    min: price("min"), max: price("max"),
    page: Math.min(1000, Math.max(1, Math.floor(Number(get("page")) || 1))),
  };
}

export function filterAccounts(offers: AccountOffer[], filters: AccountFilters) {
  const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  const result = offers.filter((offer) =>
    (!filters.game || offer.gameId === filters.game) &&
    (!filters.min || offer.amount >= Number(filters.min)) &&
    (!filters.max || offer.amount <= Number(filters.max)) &&
    terms.every((term) => offer.searchText.includes(term)),
  );
  if (filters.sort !== "newest") result.sort((a, b) =>
    (a.amount - b.amount) * (filters.sort === "price-asc" ? 1 : -1));
  return result;
}

export function accountsUrl(filters: AccountFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && !(key === "page" && value === 1) && !(key === "sort" && value === "newest")) params.set(key, String(value));
  }
  return `/accounts${params.size ? `?${params}` : ""}`;
}
