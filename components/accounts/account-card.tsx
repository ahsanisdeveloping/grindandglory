import { ArrowUpRight, Clock3 } from "lucide-react";
import { OfferImage } from "@/components/accounts/offer-image";
import type { AccountOffer } from "@/lib/account-filters";

export function AccountCard({ offer, headingLevel = 2 }: { offer: AccountOffer; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <article className="account-card">
      <a href={offer.url} target="_blank" rel="noopener noreferrer" className="account-card-link">
        <div className="account-card-image"><OfferImage src={offer.image} title={offer.title} /></div>
        <div className="account-card-body">
          <p className="account-game">{offer.game}</p>
          <Heading>{offer.title}</Heading>
          <dl className="account-details">
            {offer.details.map((detail) => <div key={detail.name}><dt>{detail.name}</dt><dd>{detail.value}</dd></div>)}
          </dl>
          <div className="account-card-bottom">
            <span className="account-price">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: offer.currency }).format(offer.amount)}
              <small>{offer.currency}</small>
            </span>
            <span className="account-view">View account <ArrowUpRight size={18} aria-hidden="true" /></span>
          </div>
          <p className="account-delivery"><Clock3 size={14} aria-hidden="true" />{offer.delivery}</p>
        </div>
        <span className="sr-only"> on Eldorado (opens in a new tab)</span>
      </a>
    </article>
  );
}
