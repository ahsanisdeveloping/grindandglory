"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function OfferImage({ src, title, previewArtwork }: { src: string | null; title: string; previewArtwork?: { src: string; label: string } }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const image = src && !failed ? (
    // Marketplace images are served directly so their source resolution is preserved.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} width={640} height={400} loading="lazy" referrerPolicy="no-referrer" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} style={previewArtwork && !loaded ? { opacity: 0 } : undefined} />
  ) : previewArtwork ? null : (
    <span className="offer-image-fallback"><ImageOff aria-hidden="true" size={28} /><span>Preview unavailable</span></span>
  );
  return <>
    {previewArtwork && (!loaded || failed) && <span className="offer-preview-artwork" style={{ backgroundImage: `url("${previewArtwork.src}")` }} aria-hidden="true"><span>{previewArtwork.label}</span></span>}
    {image}
  </>;
}
