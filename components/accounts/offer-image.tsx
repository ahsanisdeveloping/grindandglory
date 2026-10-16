"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function OfferImage({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    // Marketplace images are served directly so their source resolution is preserved.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} width={640} height={400} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
  ) : (
    <span className="offer-image-fallback"><ImageOff aria-hidden="true" size={28} /><span>Preview unavailable</span></span>
  );
}
