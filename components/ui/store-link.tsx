import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StoreLink({
  children,
  variant = "default",
  size = "default",
  className,
}: {
  children?: React.ReactNode;
  variant?: "default" | "outline" | "light" | "ghost";
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("store-link", className)}
    >
      <a href={site.storeUrl} target="_blank" rel="noopener noreferrer">
        {children ??
          (site.storeUrlIsPlaceholder ? "Visit Eldorado" : "Visit store")}
        <ArrowUpRight aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  );
}
