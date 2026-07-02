"use client";

import { useRef } from "react";
import { Reveal, Counter } from "@/components/Reveal";
import { SITE } from "@/lib/config";

/* ---------------- Expertise ---------------- */
const SERVICES = [
  {
    code: "PV-01",
    title: "Résidentiel",
    desc: "Toitures de villas et maisons : autoconsommation, injection réseau STEG, batteries de stockage. Dimensionnement précis selon votre facture.",
    kpi: "3–12 kWc",
  },
  {
    code: "PV-02",
    title: "Industriel & tertiaire",
    desc: "Usines, entrepôts, hôtels, cliniques : ombrières, grandes toitures, contrats d'exploitation. Retour sur investissement calculé au dinar près.",
    kpi: "50 kWc – 1 MWc",
  },
  {
    code: "PV-03",
    title: "Pompage solaire",
    desc: "Irrigation agricole autonome : pompes immergées alimentées directement par le soleil, sans gasoil, sans réseau.",
    kpi: "Jusqu'à 45 kW",
  },
  {
    code: "PV-04",
    title: "Maintenance & monitoring",
    desc: "Supervision temps réel de votre production, nettoyage, thermographie par drone, intervention sous 48 h.",
    kpi: "Suivi 24/7",
  },
];

export function Services() {
  return (
    <section id="expertise" className="section">
      <Reveal>
        <p className="eyebrow">Expertise</p>
        <h2 className="section-title">
          Quatre métiers.
          <br />
          <span className="volt-text">Un seul courant.</span>
        </h2>
      </Reveal>
      <div className="cards">
        {SERVICES.map((s, i) => (
          <Reveal key={s.code} delay={i * 90}>
            <article
              className="card"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div className="card-top">
                <span className="mono">{s.code}</span>
                <span className="mono card-kpi">{s.kpi}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="card-vein" aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Projets ---------------- */
const PROJECTS = [
  {
    name: "Ombrière — Zone industrielle Mghira",
    spec: "480 kWc · 1 180 panneaux",
    tag: "Industriel",
    grad: "linear-gradient(135deg,#0B1B2E 0%,#0E3A55 55%,#123),radial-gradient(circle at 70% 20%,rgba(53,228,255,.35),transparent 60%)",
  },
  {
    name: "Villa — Gammarth",
    spec: "9,8 kWc · batterie 15 kWh",
    tag: "Résidentiel",
    grad: "linear-gradient(150deg,#141018 0%,#2A1F33 60%,#123),radial-gradient(circle at 30% 80%,rgba(255,194,75,.3),transparent 55%)",
  },
  {
    name: "Ferme agricole — Kairouan",
    spec: "Pompage 30 kW · 120 m de profondeur",
    tag: "Agricole",
    grad: "linear-gradient(140deg,#0D1410 0%,#1E2E1A 60%,#123),radial-gradient(circle at 60% 30%,rgba(120,255,180,.22),transparent 60%)",
  },
  {
    name: "Hôtel — Hammamet",
    spec: "210 kWc · eau chaude solaire hybride",
    tag: "Tertiaire",
    grad: "linear-gradient(145deg,#101223 0%,#1E2447 60%,#123),radial-gradient(circle at 80% 70%,rgba(53,228,255,.28),transparent 55%)",
  },
];

export function Projects() {
  return (
    <section id="projets" className="section">
      <Reveal>
        <p className="eyebrow">Réalisations</p>
        <h2 className="section-title">
          Des toits qui <span className="volt-text">travaillent</span>.
        </h2>
        <p className="section-lede">
          Résidentiel, industriel, agricole : chaque installation est
          dimensionnée, posée et suivie par nos équipes.
        </p>
      </Reveal>
      <div className="projects">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 80}>
            <article className="project" style={{ background: p.grad }}>
              <span className="project-tag mono">{p.tag}</span>
              <div className="project-info">
                <h3>{p.name}</h3>
                <p className="mono">{p.spec}</p>
              </div>
              <div className="project-grid" aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Chiffres ---------------- */
export function Stats() {
  return (
    <section className="section stats-band">
      <div className="stats">
        <Reveal>
          <div className="stat">
            <Counter to={4.2} decimals={1} suffix=" MWc" />
            <span>installés depuis 2019</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="stat">
            <Counter to={312} suffix="" />
            <span>installations livrées</span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="stat">
            <Counter to={5800} suffix=" t" />
            <span>de CO₂ évitées / an</span>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <div className="stat">
            <Counter to={70} suffix=" %" />
            <span>d&rsquo;économie moyenne sur la facture</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Méthode (vraie séquence → numérotation justifiée) ---- */
const STEPS = [
  {
    n: "01",
    t: "Audit énergétique",
    d: "Analyse de vos factures STEG, relevé du toit, étude d'ombrage. Gratuit et sans engagement.",
  },
  {
    n: "02",
    t: "Conception & simulation",
    d: "Dimensionnement PVsyst, choix des équipements, simulation de production sur 25 ans, dossier ANME/STEG.",
  },
  {
    n: "03",
    t: "Installation",
    d: "Pose par nos équipes certifiées en 2 à 5 jours. Structure, câblage, onduleurs, mise en service.",
  },
  {
    n: "04",
    t: "Suivi & garantie",
    d: "Monitoring en ligne, maintenance préventive, garanties constructeur jusqu'à 25 ans sur les panneaux.",
  },
];

export function Process() {
  return (
    <section id="process" className="section">
      <Reveal>
        <p className="eyebrow">Méthode</p>
        <h2 className="section-title">
          Du devis au <span className="volt-text">premier kilowatt</span>.
        </h2>
      </Reveal>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} as="li" delay={i * 90} className="step">
            <span className="step-n mono">{s.n}</span>
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
            <span className="step-wire" aria-hidden="true" />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}


/* ---------------- Aube (vidéo villa en boucle) ---------------- */
export function Dawn() {
  return (
    <section className="dawn">
      <video
        className="dawn-video"
        src="/media/villa.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="dawn-veil" aria-hidden="true" />
      <div className="dawn-content">
        <Reveal>
          <p className="eyebrow">Du premier rayon au dernier kilowatt</p>
          <h2 className="dawn-title">Votre toit devient<br />une centrale.</h2>
          <a href="#contact" className="btn btn-sun">Étudier mon projet</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const formRef = useRef<HTMLDivElement>(null);
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h2 className="section-title">
          Branchez votre projet.
        </h2>
        <p className="section-lede">
          Réponse sous 24 h. Étude et devis gratuits.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="contact-grid" ref={formRef}>
          <div className="contact-form">
            <label>
              Nom complet
              <input type="text" name="name" placeholder="Votre nom" />
            </label>
            <label>
              Téléphone
              <input type="tel" name="phone" placeholder="+216 __ ___ ___" />
            </label>
            <label>
              Facture STEG mensuelle (DT)
              <input type="number" name="bill" placeholder="ex. 240" />
            </label>
            <label>
              Votre projet
              <textarea
                name="msg"
                rows={4}
                placeholder="Toiture villa, usine, pompage agricole…"
              />
            </label>
            <button
              type="button"
              className="btn btn-sun"
              onClick={() => alert("Brancher ici ton endpoint / n8n webhook 😉")}
            >
              Demander mon étude gratuite
            </button>
          </div>
          <aside className="contact-side">
            <p className="mono">COORDONNÉES</p>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <p>{SITE.city}</p>
            <div className="contact-note">
              <p className="mono">// astuce</p>
              <p>
                Le bouton du formulaire est prêt à recevoir un webhook n8n ou
                une route API Next.js (<code>/app/api/lead/route.ts</code>).
              </p>
            </div>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="mono">
        {SITE.brand} {SITE.brandSub} — {new Date().getFullYear()}
      </p>
      <p className="mono footer-dim">
        Conçu pour convertir la lumière. Et les visiteurs.
      </p>
    </footer>
  );
}
