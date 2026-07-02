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
    { prefixMobile: HERO_SEQ.prefixMobile, zoom: 0.07 }
  );
  const p = progress;
  const phase = p >= HERO_SEQ.gate ? 2 : p >= 0.14 ? 1 : 0;

  const surged = useRef(false);
  useEffect(() => {
    if (phase === 2 && !surged.current) {
      surged.current = true;
      window.dispatchEvent(new CustomEvent("helia:surge"));
    }
    if (phase < 2) surged.current = false;
  }, [phase]);

  const volts = Math.round(12 + ease(clamp(p / HERO_SEQ.gate)) * 388);
  const kw = (ease(clamp((p - 0.08) / 0.8)) * 247.5).toFixed(1);
  const hz = (ease(clamp(p / HERO_SEQ.gate)) * 50).toFixed(1);

  /* Transforms continus pilotés par le scroll (pas de simple on/off) */
  const t0 = clamp(p / 0.15);                 // sortie du titre d'ouverture
  const o0 = 1 - ease(t0);
  const gT = ease(clamp((p - HERO_SEQ.gate) / 0.1)); // entrée du titre gate
  const endFade = ease(clamp((p - 0.93) / 0.07));    // fondu de fin

  return (
    <div
      ref={wrapRef}
      className="seq"
      style={{ height: `${HERO_SEQ.count * HERO_SEQ.scrollPerFrame}px` }}
      aria-label="Le réseau solaire s'allume au défilement"
    >
      <div className="seq-sticky">
        <canvas ref={canvasRef} className="seq-canvas" />
        <div className={`seq-loader ${ready ? "off" : ""}`} aria-hidden="true">
          <span className="mono">CHARGEMENT DU RÉSEAU…</span>
        </div>

        {/* HUD onduleur */}
        <div className="hud hud-tl"><span>TENSION</span><strong>{volts} V</strong></div>
        <div className="hud hud-tr"><span>PRODUCTION</span><strong>{kw} kWc</strong></div>
        <div className="hud hud-bl"><span>FRÉQUENCE</span><strong>{hz} Hz</strong></div>
        <div className="hud hud-br"><span>{SITE.city.toUpperCase()}</span><strong>36.8°N · 10.2°E</strong></div>

        <div className="seq-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${p})` }} />
        </div>

        {/* Titre d'ouverture — vole vers la caméra en avançant */}
        <div
          className="ovl on"
          style={{
            opacity: o0,
            transform: `translateY(${-t0 * 90}px) scale(${1 + t0 * 0.85})`,
            pointerEvents: o0 < 0.05 ? "none" : undefined,
            visibility: o0 < 0.01 ? "hidden" : undefined,
          }}
        >
          <p className="eyebrow">{SITE.brand} · {SITE.brandSub}</p>
          <h1>L&rsquo;ÉNERGIE<br />DU SOLEIL.</h1>
          <p className="scroll-hint">Faites défiler pour allumer le réseau ↓</p>
        </div>

        {/* Compteur de propagation */}
        <div className={`ovl ovl-low ${phase === 1 ? "on" : ""}`}>
          <p className="mono-line">// le courant se propage — {Math.round(p * 100)} %</p>
        </div>

        {/* Titre gate — punch d'ignition, lettre par lettre */}
        <div
          className={`ovl ${phase === 2 ? "on" : ""}`}
          style={{
            opacity: gT * (1 - endFade),
            transform: `scale(${1.35 - gT * 0.35})`,
          }}
        >
          <h2 className="ignite">
            <Ignite text="MAÎTRISÉE." />
          </h2>
          <p className="ovl-sub">Chaque cellule connectée. Chaque watt compté.</p>
        </div>
      </div>
    </div>
  );
}
