import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer" data-animate="footer-reveal">
      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              Time invested. Glory earned.
              <br />A gaming brand with a player’s mindset.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <span className="footer-label">Explore</span>
            {site.navigation.map((link) => (
              <a className="text-link" key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="footer-elsewhere">
            <span className="footer-label">Elsewhere</span>
            <a
              className="text-link"
              href={site.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Eldorado
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {site.socials.map((social) =>
              social.href ? (
                <a
                  key={social.label}
                  className="text-link"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span className="footer-social-pending" key={social.label}>
                  {social.label}
                  <small>Coming soon</small>
                </span>
              ),
            )}
          </div>
          <a href="#top" className="back-to-top" aria-label="Back to top">
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
        <p className="footer-wordmark" aria-hidden="true">
          GRIND&GLORY
        </p>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Grind&Glory</p>
          <p>
            Independent gaming brand. All game names and artwork belong to their
            respective owners. No publisher affiliation.
          </p>
          <span>Made of play.</span>
        </div>
      </Container>
    </footer>
  );
}
