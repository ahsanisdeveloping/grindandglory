import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("section", className)}
      data-animate="section"
      {...props}
    >
      {children}
    </section>
  );
}
