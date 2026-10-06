"use client";

import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/logo";
import { StoreLink } from "@/components/ui/store-link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(href);
      section?.focus({ preventScroll: true });
      section?.scrollIntoView();
    });
  }

  return (
    <div className="mobile-menu">
      <IconButton
        className="menu-toggle"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls={open ? "mobile-navigation" : undefined}
        onClick={() => setOpen(true)}
        disableRipple
      >
        <Menu aria-hidden="true" size={24} />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        transitionDuration={0}
        slotProps={{
          paper: {
            className: "menu-drawer",
            role: "dialog",
            "aria-modal": true,
            "aria-label": "Navigation menu",
          },
        }}
      >
        <div className="menu-drawer__top">
          <Logo onClick={() => navigate("#top")} />
          <IconButton
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            disableRipple
          >
            <X aria-hidden="true" />
          </IconButton>
        </div>
        <nav id="mobile-navigation" aria-label="Mobile navigation">
          {site.navigation.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => navigate(link.href)}
            >
              {link.label}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="menu-drawer__bottom">
          <p>
            We do the grind.
            <br />
            You get the glory.
          </p>
          <StoreLink />
        </div>
      </Drawer>
    </div>
  );
}
