"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Moteur de scrub avec inertie : le progress affiché glisse vers la cible
 * (lerp) au lieu de la suivre brutalement → le feeling soyeux des sites
 * Apple/Vercel. Préchargement par vagues, frames mobiles dédiées,
 * léger zoom cinématique optionnel.
 */
export function useScrub(
  prefix: string,
  count: number,
  opts?: { prefixMobile?: string; zoom?: number }
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const targetRef = useRef(0);   // progress réel du scroll
  const currentRef = useRef(0);  // progress lissé (affiché)
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const lastDrawnRef = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const zoom = opts?.zoom ?? 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      lastDrawnRef.current = -1;
    }
    const p = currentRef.current;
    const want = Math.min(count - 1, Math.round(p * (count - 1)));
    let idx = -1;
    for (let d = 0; d < count; d++) {
      if (loadedRef.current[want - d] ?? false) { idx = want - d; break; }
      if (loadedRef.current[want + d] ?? false) { idx = want + d; break; }
    }
    if (idx < 0) return;
    // Redessine si la frame change OU si le zoom bouge encore
    if (idx === lastDrawnRef.current && zoom === 0) return;
    const img = imgsRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const z = 1 + zoom * (1 - p); // dézoome doucement en avançant
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * z;
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    lastDrawnRef.current = idx;
  }, [count, zoom]);

  /* Boucle d'inertie : ne tourne que quand il y a de l'écart à rattraper */
  const tick = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const k = isMobile ? 0.16 : 0.11; // facteur de lissage
    const delta = targetRef.current - currentRef.current;
    if (Math.abs(delta) < 0.0004) {
      currentRef.current = targetRef.current;
      draw();
      setProgress(currentRef.current);
      runningRef.current = false;
      return;
    }
    currentRef.current += delta * k;
    draw();
    setProgress((prev) =>
      Math.abs(prev - currentRef.current) > 0.003 ? currentRef.current : prev
    );
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const wake = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const pfx = isMobile && opts?.prefixMobile ? opts.prefixMobile : prefix;
    const src = (i: number) => `${pfx}${String(i + 1).padStart(4, "0")}.webp`;

    loadedRef.current = new Array(count).fill(false);
    imgsRef.current = new Array(count);
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < count; i += step) {
        if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
    }
    let firstWave = 0;
    order.forEach((i, rank) => {
      const img = new Image();
      img.decoding = "async";
      if (rank < Math.ceil(count / 8)) img.fetchPriority = "high";
      img.onload = () => {
        loadedRef.current[i] = true;
        if (rank < Math.ceil(count / 8) && ++firstWave >= Math.ceil(count / 8) - 1)
          setReady(true);
        lastDrawnRef.current = -1;
        wake();
      };
      img.src = src(i);
      imgsRef.current[i] = img;
    });

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      targetRef.current = clamp(-rect.top / total);
      wake();
    };
    const onResize = () => { lastDrawnRef.current = -1; wake(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, prefix, wake]);

  return { wrapRef, canvasRef, progress, ready };
}
