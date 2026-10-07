import Image from "next/image";
import purpleMark from "@/app/assets/iconlogopurple.png";
import whiteMark from "@/app/assets/iconlogowhite.png";
import { cn } from "@/lib/utils";

export function BrandMark({
  light = false,
  className,
  preload = false,
}: {
  light?: boolean;
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={light ? whiteMark : purpleMark}
      alt=""
      aria-hidden="true"
      className={cn("brand-mark", className)}
      sizes="(max-width: 767px) 70vw, 45vw"
      preload={preload}
    />
  );
}

export function Logo({
  light = false,
  className,
  onClick,
}: {
  light?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href="#top"
      className={cn("logo", className)}
      aria-label="Grind and Glory, back to top"
      onClick={onClick}
    >
      <Image
        src={light ? whiteMark : purpleMark}
        alt=""
        width={56}
        height={45}
        sizes="56px"
        className="logo__mark"
      />
      <span className="logo__wordmark relative top-[6px]">Grind&Glory</span>
    </a>
  );
}
