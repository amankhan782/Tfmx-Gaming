# TFMX Gaming website

A cinematic Next.js website for TFMX Gaming and Indian Car Simulator, using the supplied game-world screenshots.

## Included
- Responsive cinematic landing page and world gallery
- Lightweight procedural Three.js/R3F hero scene
- GSAP scroll reveals and parallax image motion
- Early Access and collaboration forms
- Server-side Resend email integration (requires credentials)
- Privacy and terms pages
- Supplied game images in `public/game-world`

## Requirements
- Node.js 20+
- npm
- A Resend account and a verified sending domain for live email delivery

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## Configure email
1. Create a Resend account and verify a domain you control.
2. Create an API key.
3. Set `RESEND_API_KEY` in `.env.local`.
4. Set `FROM_EMAIL` to an address on your verified domain, for example `TFMX Gaming <hello@yourdomain.com>`.
5. Set `OWNER_EMAIL=amanbgm782@gmail.com`.
6. Restart the dev server and submit a test from both forms.

The API sends a notification to the owner and attempts an acknowledgement to the applicant. If email credentials are absent, the endpoint returns a configuration error and the UI does not claim the form was submitted.

## Deploy
Deploy as a Node.js Next.js app (Vercel or another compatible host). Add the same environment variables in the hosting dashboard. Use a durable rate limiter (Redis/Upstash or platform middleware) before public launch; the included in-memory limiter is a basic single-instance safeguard and resets when the server restarts.

## Important production notes
- Replace `https://example.com` in `src/app/layout.tsx` with the production domain.
- Add your actual social profile URLs when available.
- The current hero scene is a stylized procedural 3D illustration, not a reconstruction of a Unity scene. The supplied screenshots are used as the website's game-world gallery and showcase imagery.
- The sound control starts/stops a quiet synthesized low-frequency ambience after a user click. It is a subtle placeholder, not a recorded vehicle engine or finished sound design; replace or layer it with original/licensed audio before launch.
- Add a persistent database if you need an auditable application archive. The current implementation routes submissions by email.
- Run `npm run build` before production deployment.

## Cinematic scroll-drive update

This update replaces the basic block-style hero scene with a procedural 3D city drive. The camera and car travel forward as the visitor scrolls through the tall hero section; the scene includes layered buildings, lit windows, road markings, street lamps, trees, moving traffic, a vehicle model, a live HUD label, and a scroll progress line. Existing section reveals and image parallax remain in place, with extra background parallax on the game and join sections.

### Apply this update to an existing local copy

1. Stop the running development server in the VS Code terminal with `Ctrl + C`.
2. Extract this update ZIP into the same project folder that contains `package.json` and choose **Replace files** when Windows asks.
3. Keep your existing `.env.local` and `node_modules` folder; do not delete them.
4. In the VS Code terminal run `npm run dev` and refresh `http://localhost:3000` with `Ctrl + Shift + R`.

The scene is a custom real-time WebGL interpretation for the TFMX site, not a recreation of GTA 6 or a photorealistic game capture. Performance depends on the visitor's GPU and browser; the scene uses a capped pixel ratio to reduce GPU load.

## Full-site cinematic update

This version expands the world gallery to include all 18 supplied game-world visuals. Each image card has scroll reveal, image parallax, hover depth/tilt and a scan-light pass. The studio, project, map, timeline and contact sections also use depth-based scroll reveals and motion treatments. A global scroll progress line, cinematic grain, responsive navigation, early-access, team and general contact modals are included. The hero remains a custom procedural Three.js/R3F city drive.

### Contact delivery

- WhatsApp opens a prefilled chat to the studio number configured in `src/components/Experience.tsx`.
- Email opens the visitor's email app addressed to the studio mailbox.
- The contact, early-access and collaboration forms send an email notification to `OWNER_EMAIL` through Resend.
- Form email delivery is **not active** until a Resend API key and a verified sender domain are configured in `.env.local` (or the hosting provider's environment settings). Never publish or share the API key. Keep `.env.local` private and do not commit it.

To enable form email delivery, set:

```env
RESEND_API_KEY=re_your_real_key
FROM_EMAIL=TFMX Gaming <hello@your-verified-domain.com>
OWNER_EMAIL=amanbgm782@gmail.com
```

Restart the Next.js server after changing environment variables. Test a contact form submission and verify the message reaches the owner inbox. Until configured, WhatsApp and direct email links remain available as alternatives.

All visual treatments and sounds are original procedural effects or supplied project visuals. This site does not include copied GTA 6 assets, maps, source code, music or sound recordings.
