import { Container } from "@/components/layout/container";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Logo } from "@/components/ui/logo";
import { StoreLink } from "@/components/ui/store-link";
import { site } from "@/data/site";

export function Header() {
  return (
    <header className="site-header" data-animate="header">
      <Container className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {site.navigation.map((link) => (
            <a className="text-link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <StoreLink variant="outline" size="sm" className="header-store" />
        <MobileMenu />
      </Container>
    </header>
  );
}
