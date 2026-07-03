"use client";

import { useEffect, useRef } from "react";
import { useScrub } from "@/components/useScrub";
import Ignite from "@/components/Ignite";
import { HERO_SEQ, SITE } from "@/lib/config";

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function HeroSequence() {
  const { wrapRef, canvasRef, progress, ready } = useScrub(
    HERO_SEQ.prefix,
    HERO_SEQ.count,
    { prefixMobile: HERO_SEQ.prefixMobile, zoom: 0.06 }
  );
  const p = progress;
  const { spark, chain, gate, dawn } = HERO_SEQ;

  /* Décharge plein écran à l'embrasement */
  const surged = useRef(false);
  useEffect(() => {
    if (p >= gate && p < dawn && !surged.current) {
      surged.current = true;
      window.dispatchEvent(new CustomEvent("helia:surge"));
    }
    if (p < gate) surged.current = false;
  }, [p, gate, dawn]);

  /* HUD */
  const volts = Math.round(12 + ease(clamp(p / gate)) * 388);
  const kw = (ease(clamp((p - spark) / (dawn - spark))) * 247.5).toFixed(1);
  const hz = (ease(clamp(p / gate)) * 50).toFixed(1);

  /* Actes — transforms continus */
  const t0 = clamp(p / 0.13);
  const o0 = 1 - ease(t0);
  const act1 = ease(clamp((p - spark) / 0.06)) * (1 - ease(clamp((p - (chain - 0.06)) / 0.06)));
  const act2 = ease(clamp((p - chain) / 0.06)) * (1 - ease(clamp((p - (gate - 0.05)) / 0.05)));
  const gT = ease(clamp((p - gate) / 0.07)) * (1 - ease(clamp((p - (dawn - 0.03)) / 0.05)));
  const dT = ease(clamp((p - dawn) / 0.09));
  const isGold = p >= dawn - 0.02;

  return (
    <div
      ref={wrapRef}
      className="seq"
      style={{ height: `${HERO_SEQ.count * HERO_SEQ.scrollPerFrame}px` }}
      aria-label="Plan-séquence : de l'étincelle à l'aube dorée"
    >
      <div className="seq-sticky">
        <canvas ref={canvasRef} className="seq-canvas" />
        <div className={`seq-loader ${ready ? "off" : ""}`} aria-hidden="true">
          <span className="mono">CHARGEMENT DU RÉSEAU…</span>
        </div>

        {/* HUD onduleur — passe en or à l'aube */}
        <div className={`hud hud-tl ${isGold ? "hud-gold" : ""}`}><span>TENSION</span><strong>{volts} V</strong></div>
        <div className={`hud hud-tr ${isGold ? "hud-gold" : ""}`}><span>PRODUCTION</span><strong>{kw} kWc</strong></div>
        <div className={`hud hud-bl ${isGold ? "hud-gold" : ""}`}><span>FRÉQUENCE</span><strong>{hz} Hz</strong></div>
        <div className={`hud hud-br ${isGold ? "hud-gold" : ""}`}><span>{SITE.city.toUpperCase()}</span><strong>36.8°N · 10.2°E</strong></div>

        <div className="seq-progress" aria-hidden="true">
          <span className={isGold ? "gold" : ""} style={{ transform: `scaleX(${p})` }} />
        </div>

        {/* Ouverture — vole vers la caméra */}
        <div
          className="ovl on"
          style={{
            opacity: o0,
            transform: `translateY(${-t0 * 90}px) scale(${1 + t0 * 0.85})`,
            visibility: o0 < 0.01 ? "hidden" : undefined,
          }}
        >
          <p className="eyebrow">{SITE.brand} · {SITE.brandSub}</p>
          <h1>L&rsquo;ÉNERGIE<br />DU SOLEIL.</h1>
          <p className="scroll-hint">Faites défiler pour réveiller le réseau ↓</p>
        </div>

        {/* Acte 1 — l'étincelle */}
        <div className="ovl ovl-low on" style={{ opacity: act1, visibility: act1 < 0.01 ? "hidden" : undefined }}>
          <p className="mono-line">// une étincelle suffit</p>
        </div>

        {/* Acte 2 — la réaction en chaîne */}
        <div className="ovl ovl-low on" style={{ opacity: act2, visibility: act2 < 0.01 ? "hidden" : undefined }}>
          <p className="mono-line">// réaction en chaîne — {Math.round(clamp((p - chain) / (gate - chain)) * 100)} %</p>
        </div>

        {/* Embrasement */}
        <div
          className={`ovl ${p >= gate && p < dawn ? "on" : ""}`}
          style={{ opacity: gT, transform: `scale(${1.35 - ease(clamp((p - gate) / 0.07)) * 0.35})` }}
        >
          <h2 className="ignite"><Ignite text="MAÎTRISÉE." /></h2>
          <p className="ovl-sub">Chaque cellule connectée. Chaque watt compté.</p>
        </div>

        {/* Aube dorée */}
        <div
          className={`ovl ${p >= dawn ? "on" : ""}`}
          style={{ opacity: dT, transform: `translateY(${(1 - dT) * 40}px)` }}
        >
          <p className="eyebrow eyebrow-gold">Acte final</p>
          <h2 className="dawn-hero"><Ignite text="Et chaque aube," /><br /><Ignite text="votre toit produit." /></h2>
          <a href="#contact" className="btn btn-sun" style={{ pointerEvents: dT > 0.5 ? "auto" : "none" }}>
            Étudier mon projet
          </a>
        </div>
      </div>
    </div>
  );
}
