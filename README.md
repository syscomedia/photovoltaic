# HELIA Énergie — Vitrine photovoltaïque scroll-driven

Site Next.js 15 + TypeScript avec séquence hero pilotée au scroll :
grille photovoltaïque procédurale + veines d'électricité + gate d'ignition
+ lever de soleil. Zéro asset requis pour démarrer.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

## Brancher tes frames Kling (mode vidéo scrubbée)

1. Génère ta vidéo sur Kling (prompts fournis dans la conversation),
   1080p, mouvement lent, un seul plan continu.
2. Extrais les frames :

```bash
ffmpeg -i solar.mp4 -vf "fps=24,scale=1920:-2" public/frames/frame_%04d.webp -quality 78
```

3. Dans `lib/config.ts` :
   - `useFrames: true`
   - `frameCount: <nombre exact de frames>`
   - ajuste `gate` (0–1) sur le moment d'ignition de ta vidéo
     (équivalent de ta frame 70/156 sur le projet penthouse).

Le composant `ScrollCanvas` bascule automatiquement : préchargement des
images, dessin en `cover` sur canvas, même logique de scrub.

## Personnaliser

- Marque, téléphone, email : `lib/config.ts` → `SITE`
- Couleurs / typo : variables CSS dans `app/globals.css` (`:root`)
- Contenu des sections : `components/sections/Sections.tsx`
- Formulaire : brancher le bouton sur une route API
  (`app/api/lead/route.ts`) ou un webhook n8n.

## Déploiement VPS (Nginx + PM2)

```bash
npm run build
pm2 start npm --name helia -- start
```

Nginx : reverse proxy classique vers `localhost:3000` + Certbot SSL —
même recette que tes déploiements Seaura / imbt-consulting.

## Performance

- Canvas plafonné à DPR 2, redraw via requestAnimationFrame
- Rendu 100 % déterministe sur le progress → scrub avant/arrière stable
- `prefers-reduced-motion` respecté (frame fixe, pas de séquence)
- Frames WebP recommandées à 50–80 Ko pièce (~10 Mo pour 156 frames)
