import "server-only";
import type { AccountOffer } from "@/lib/account-filters";

const origin = "https://www.eldorado.gg";
// Fixed verified seller. No browser input can select another user or endpoint.
const sellerId = "217bb5f0-3001-709d-1fab-8babde64e1fa";
const imageOrigin = "https://fileserviceusprod.blob.core.windows.net/offerimages/";

export type AccountInventory = {
  offers: AccountOffer[];
  games: { id: string; name: string }[];
  count: number;
  totalPages: number;
  error: boolean;
};

type RawOffer = {
  id: string;
  userId: string;
  category: string;
  gameId: string;
  gameSeoAlias: string;
  offerTitle: string;
  description?: string;
  mainOfferImage?: { largeImage?: string; smallImage?: string };
  pricePerUnit: { amount: number; currency: string };
  pricePerUnitInUSD?: { amount: number; currency: string };
  guaranteedDeliveryTime: string;
  tradeEnvironmentValues?: { name: string; value: string }[];
  attributes?: { name: string; value?: { name?: string } }[];
};
type RawPage = {
  results: { offer: RawOffer }[] | null;
  recordCount: number;
  totalPages: number;
};

async function request(pageIndex: number): Promise<unknown> {
  if (!Number.isInteger(pageIndex) || pageIndex < 1 || pageIndex > 20) throw new Error("Invalid inventory page");
  const query = new URLSearchParams({ userId: sellerId, category: "Account", pageIndex: String(pageIndex), pageSize: "50", offerSortingCriterion: "Date", isAscending: "false" });
  const response = await fetch(`${origin}/api/flexibleOffers?${query}`, {
    method: "GET",
    redirect: "error",
    credentials: "omit",
    headers: { Accept: "application/json", swagger: "Swager request" },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Eldorado returned ${response.status}`);
  return response.json();
}

function gameName(alias: string) {
  const names: Record<string, string> = {
    "valorant-accounts": "VALORANT",
    "apex-legends-accounts": "Apex Legends",
    "lol-accounts": "League of Legends",
    "league-of-legends-accounts": "League of Legends",
    "fortnite-accounts": "Fortnite",
  };
  return names[alias] ?? alias.replace(/-accounts$/, "").replaceAll("-", " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

function parsePage(value: unknown, userId: string): RawPage {
  if (!value || typeof value !== "object") throw new Error("Invalid offer response");
  const page = value as RawPage;
  if (!(Array.isArray(page.results) || page.results === null) ||
    !Number.isInteger(page.recordCount) || page.recordCount < 0 ||
    !Number.isInteger(page.totalPages) || page.totalPages < 0 || page.totalPages > 20 ||
    (page.results?.length ?? 0) > 50) {
    throw new Error("Invalid offer response");
  }
  for (const entry of page.results ?? []) {
    const offer = entry?.offer;
    if (!offer || offer.userId !== userId || offer.category !== "Account" ||
      !/^[a-f0-9-]{36}$/i.test(offer.id) || typeof offer.offerTitle !== "string" || offer.offerTitle.length > 2000 ||
      !/^[a-z0-9-]{1,120}$/.test(offer.gameSeoAlias) || typeof offer.gameId !== "string" ||
      !Number.isFinite(offer.pricePerUnit?.amount) ||
      offer.pricePerUnit.amount < 0 || !/^[A-Z]{3}$/.test(offer.pricePerUnit?.currency) ||
      (offer.pricePerUnitInUSD && (!Number.isFinite(offer.pricePerUnitInUSD.amount) || offer.pricePerUnitInUSD.amount < 0 || offer.pricePerUnitInUSD.currency !== "USD"))) {
      throw new Error("Invalid account offer");
    }
  }
  return page;
}

export async function getAccountInventory(): Promise<AccountInventory> {
  try {
    const first = parsePage(await request(1), sellerId);
    const catalogue = [...(first.results ?? [])];
    // Fetch every inventory page so game choices, search and counts cover the whole store.
    // The upstream searchQuery parameter does not reliably filter public seller offers.
    for (let start = 2; start <= first.totalPages; start += 4) {
      const pages = await Promise.all(Array.from({ length: Math.min(4, first.totalPages - start + 1) }, async (_, offset) => {
        return parsePage(await request(start + offset), sellerId);
      }));
      for (const page of pages) catalogue.push(...(page.results ?? []));
    }
    const unique = [...new Map(catalogue.map((entry) => [entry.offer.id, entry])).values()];
    const games = new Map<string, string>();
    for (const { offer } of unique) games.set(offer.gameId, gameName(offer.gameSeoAlias));
    const money = (offer: RawOffer) => offer.pricePerUnitInUSD ?? offer.pricePerUnit;
    return {
      error: false,
      count: unique.length,
      totalPages: Math.ceil(unique.length / 12),
      games: [...games].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
      offers: unique.map(({ offer }) => {
        const image = offer.mainOfferImage?.largeImage ?? offer.mainOfferImage?.smallImage;
        return {
          id: offer.id,
          title: offer.offerTitle,
          searchText: [offer.offerTitle, offer.description, gameName(offer.gameSeoAlias),
            ...(offer.tradeEnvironmentValues ?? []).map((detail) => detail.value),
            ...(offer.attributes ?? []).map((detail) => detail.value?.name),
          ].join(" ").slice(0, 16000).toLowerCase(),
          gameId: offer.gameId,
          game: gameName(offer.gameSeoAlias),
          image: image && /^[\w.-]{1,250}$/.test(image) ? new URL(encodeURIComponent(image), imageOrigin).href : null,
          url: `${origin}/${encodeURIComponent(offer.gameSeoAlias)}/oa/${encodeURIComponent(offer.id)}`,
          amount: money(offer).amount,
          currency: money(offer).currency,
          delivery: offer.guaranteedDeliveryTime === "Instant" ? "Instant delivery" : (offer.guaranteedDeliveryTime ?? "See listing for delivery").replace(/([a-z])([A-Z0-9])/g, "$1 $2"),
          details: [
            ...(offer.tradeEnvironmentValues ?? []).map(({ name, value }) => ({ name, value })),
            ...(offer.attributes ?? []).filter((a) => ["Rank", "Level", "Weapon Skins"].includes(a.name))
              .map((a) => ({ name: a.name, value: a.value?.name ?? "" })),
          ].filter((a) => a.value).slice(0, 3),
        };
      }),
    };
  } catch (error) {
    console.error("Unable to load Eldorado accounts:", error instanceof Error ? error.message : "Unknown error");
    return { offers: [], games: [], count: 0, totalPages: 0, error: true };
  }
}
