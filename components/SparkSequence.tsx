"use client";

import { useEffect, useRef } from "react";
import { useScrub } from "@/components/useScrub";
import Ignite from "@/components/Ignite";
import { SPARK_SEQ } from "@/lib/config";

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function SparkSequence() {
  const { wrapRef, canvasRef, progress } = useScrub(
    SPARK_SEQ.prefix,
    SPARK_SEQ.count,
    { prefixMobile: SPARK_SEQ.prefixMobile }
  );
  const p = progress;
  const S = SPARK_SEQ.strike;
  const before = p < S - 0.12;
  const strike = p >= S - 0.12 && p < S + 0.28;

  const surged = useRef(false);
  useEffect(() => {
    if (strike && !surged.current) {
      surged.current = true;
      window.dispatchEvent(new CustomEvent("helia:surge"));
    }
    if (before) surged.current = false;
  }, [strike, before]);

  /* Transforms continus */
  const aIn = ease(clamp(p / 0.1));
  const aOut = ease(clamp((p - (S - 0.2)) / 0.1));
  const bT = ease(clamp((p - (S - 0.1)) / 0.1));
  const bOut = ease(clamp((p - (S + 0.18)) / 0.1));
  const cT = ease(clamp((p - (S + 0.26)) / 0.12));

  return (
    <div
      ref={wrapRef}
      className="seq"
      style={{ height: `${SPARK_SEQ.count * SPARK_SEQ.scrollPerFrame}px` }}
      aria-label="L'impact : la lumière devient courant"
    >
      <div className="seq-sticky">
        <canvas ref={canvasRef} className="seq-canvas" />

        <div
          className="ovl ovl-left on"
          style={{
            opacity: aIn * (1 - aOut),
            transform: `translateX(${(1 - aIn) * -60 + aOut * -80}px)`,
            visibility: aIn * (1 - aOut) < 0.01 ? "hidden" : undefined,
          }}
        >
          <p className="eyebrow">La physique</p>
          <h2 className="spark-title">Un rayon frappe<br />la cellule.</h2>
        </div>

        <div
          className={`ovl ${strike ? "on" : ""}`}
          style={{
            opacity: bT * (1 - bOut),
            transform: `scale(${0.7 + bT * 0.3})`,
          }}
        >
          <h2 className="spark-big">
            <Ignite text="⚡ 1 000 W/m²" />
          </h2>
          <p className="ovl-sub">C&rsquo;est la puissance que le soleil livre, gratuitement, à votre toit.</p>
        </div>

        <div
          className="ovl ovl-right on"
          style={{
            opacity: cT,
            transform: `translateX(${(1 - cT) * 60}px)`,
            visibility: cT < 0.01 ? "hidden" : undefined,
          }}
        >
          <h2 className="spark-title">Nous, on la<br /><span className="volt-text">capture</span>.</h2>
          <p className="ovl-sub">Panneaux haut rendement · onduleurs intelligents · zéro perte inutile</p>
        </div>
      </div>
    </div>
  );
}
