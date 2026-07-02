"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav ${solid ? "nav-solid" : ""}`}>
      <a href="#top" className="nav-brand">
        <span className="nav-bolt" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
              fill="currentColor"
            />
          </svg>
        </span>
        {SITE.brand}
      </a>
      <nav className="nav-links">
        <a href="#expertise">Expertise</a>
        <a href="#projets">Projets</a>
        <a href="#process">Méthode</a>
        <a href="#contact" className="btn btn-ghost">
          Devis gratuit
        </a>
      </nav>
    </header>
  );
}
