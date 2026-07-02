"use client";

import { useEffect, useRef } from "react";

/* Éclair fractal par déplacement de point médian */
type Pt = { x: number; y: number };
type Bolt = { segs: Pt[][]; life: number; hue: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

function makeBolt(x0: number, y0: number, x1: number, y1: number, chaos: number): Pt[][] {
  const branches: Pt[][] = [];
  const subdivide = (pts: Pt[], depth: number): Pt[] => {
    if (depth === 0) return pts;
    const out: Pt[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const nx = -(b.y - a.y) / (len || 1), ny = (b.x - a.x) / (len || 1);
      const d = (Math.random() - 0.5) * len * chaos;
      out.push({ x: mx + nx * d, y: my + ny * d }, b);
    }
    return subdivide(out, depth - 1);
  };
  const main = subdivide([{ x: x0, y: y0 }, { x: x1, y: y1 }], 5);
  branches.push(main);
  // Branches secondaires
  for (let i = 4; i < main.length - 4; i += 6) {
    if (Math.random() < 0.55) {
      const p = main[i];
      const ang = Math.atan2(y1 - y0, x1 - x0) + (Math.random() - 0.5) * 1.6;
      const blen = 40 + Math.random() * 120;
      branches.push(
        subdivide(
          [p, { x: p.x + Math.cos(ang) * blen, y: p.y + Math.sin(ang) * blen }],
          3
        )
      );
    }
  }
  return branches;
}

export default function EnergyLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<Bolt[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const energyRef = useRef(0);       // charge accumulée par la vitesse de scroll
  const flashRef = useRef(0);        // décharge plein écran
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    const MAX_BOLTS = isMobile ? 4 : 8;
    const MAX_SPARKS = isMobile ? 120 : 260;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawnEdgeBolt = (big = false) => {
      if (boltsRef.current.length >= MAX_BOLTS) return;
      const left = Math.random() < 0.5;
      const x = left ? w * (0.02 + Math.random() * 0.08) : w * (0.9 + Math.random() * 0.08);
      const y0 = Math.random() * h * 0.5;
      const y1 = y0 + h * (0.25 + Math.random() * 0.45);
      const drift = (Math.random() - 0.5) * w * 0.08;
      boltsRef.current.push({
        segs: makeBolt(x, y0, x + drift, y1, 0.55),
        life: 1,
        hue: big ? 1 : 0,
      });
    };

    const spawnCrossBolt = () => {
      const y = h * (0.2 + Math.random() * 0.6);
      boltsRef.current.push({
        segs: makeBolt(-20, y, w + 20, y + (Math.random() - 0.5) * h * 0.3, 0.35),
        life: 1,
        hue: 1,
      });
    };

    const spawnSparks = (n: number) => {
      for (let i = 0; i < n; i++) {
        const left = Math.random() < 0.5;
        sparksRef.current.push({
          x: left ? Math.random() * w * 0.06 : w - Math.random() * w * 0.06,
          y: Math.random() * h,
          vx: (left ? 1 : -1) * (0.5 + Math.random() * 2.2),
          vy: (Math.random() - 0.5) * 1.6,
          life: 1,
        });
      }
      if (sparksRef.current.length > MAX_SPARKS) sparksRef.current.splice(0, sparksRef.current.length - MAX_SPARKS);
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const energy = energyRef.current;

      /* Rails latéraux chargés par la vitesse de scroll */
      if (energy > 0.02) {
        const railA = Math.min(0.5, energy) * 0.5;
        for (const rx of [1, w - 1]) {
          const g = ctx.createLinearGradient(rx - 14, 0, rx + 14, 0);
          g.addColorStop(0, "rgba(53,228,255,0)");
          g.addColorStop(0.5, `rgba(53,228,255,${railA})`);
          g.addColorStop(1, "rgba(53,228,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(rx - 14, 0, 28, h);
        }
      }

      /* Flash de décharge plein écran */
      if (flashRef.current > 0.01) {
        const f = flashRef.current;
        const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
        g.addColorStop(0, `rgba(190,245,255,${0.38 * f})`);
        g.addColorStop(0.5, `rgba(53,228,255,${0.16 * f})`);
        g.addColorStop(1, "rgba(53,228,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        flashRef.current *= 0.9;
      }

      /* Éclairs */
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      boltsRef.current = boltsRef.current.filter((b) => {
        const a = b.life;
        ctx.shadowColor = "rgba(53,228,255,0.95)";
        ctx.shadowBlur = 18;
        for (let s = 0; s < b.segs.length; s++) {
          const seg = b.segs[s];
          const main = s === 0;
          ctx.strokeStyle = main
            ? `rgba(215,250,255,${0.9 * a})`
            : `rgba(120,225,255,${0.55 * a})`;
          ctx.lineWidth = (main ? (b.hue ? 2.6 : 1.8) : 1) * a;
          ctx.beginPath();
          ctx.moveTo(seg[0].x, seg[0].y);
          for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i].x, seg[i].y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        b.life -= 0.06 + Math.random() * 0.04; // scintillement de décroissance
        return b.life > 0;
      });

      /* Étincelles */
      sparksRef.current = sparksRef.current.filter((s) => {
        ctx.fillStyle = `rgba(160,240,255,${0.85 * s.life})`;
        ctx.fillRect(s.x, s.y, 1.6 + s.life, 1.6 + s.life);
        s.x += s.vx; s.y += s.vy; s.vy += 0.015;
        s.life -= 0.022;
        return s.life > 0;
      });

      energyRef.current *= 0.92;

      const alive =
        boltsRef.current.length || sparksRef.current.length ||
        flashRef.current > 0.01 || energyRef.current > 0.02;
      if (alive) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        runningRef.current = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const wake = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastYRef.current);
      const dt = Math.max(16, now - lastTRef.current);
      lastYRef.current = window.scrollY;
      lastTRef.current = now;
      const v = Math.min(1, dy / dt / 2.4); // vitesse normalisée
      energyRef.current = Math.min(1, energyRef.current + v * 0.5);

      if (v > 0.08) spawnSparks(Math.ceil(v * 5));
      if (energyRef.current > 0.45 && Math.random() < energyRef.current * 0.5) {
        spawnEdgeBolt();
      }
      wake();
    };

    /* Décharge majeure déclenchée par les séquences (gate / strike) */
    const onSurge = () => {
      flashRef.current = 1;
      spawnCrossBolt();
      spawnCrossBolt();
      for (let i = 0; i < 4; i++) spawnEdgeBolt(true);
      spawnSparks(50);
      wake();
    };

    /* Curseur chargé (desktop uniquement) */
    const fine = window.matchMedia("(pointer: fine)").matches;
    let mx = -100, my = -100, pmx = -100, pmy = -100;
    const onMove = (e: MouseEvent) => {
      pmx = mx; pmy = my; mx = e.clientX; my = e.clientY;
      const mv = Math.hypot(mx - pmx, my - pmy);
      if (mv > 14 && sparksRef.current.length < MAX_SPARKS) {
        const n = Math.min(3, Math.floor(mv / 18));
        for (let i = 0; i < n; i++) {
          sparksRef.current.push({
            x: mx + (Math.random() - 0.5) * 8,
            y: my + (Math.random() - 0.5) * 8,
            vx: (mx - pmx) * 0.06 + (Math.random() - 0.5) * 1.2,
            vy: (my - pmy) * 0.06 + (Math.random() - 0.5) * 1.2,
            life: 0.8,
          });
        }
        energyRef.current = Math.min(1, energyRef.current + 0.02);
        wake();
      }
    };
    if (fine) window.addEventListener("mousemove", onMove, { passive: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("helia:surge", onSurge);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("helia:surge", onSurge);
      if (fine) window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="energy-layer" aria-hidden="true" />;
}
