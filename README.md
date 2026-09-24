# Vinancial Capital

Marketing site + inquiry form for Vinancial Capital, built with React + Vite + TypeScript + Tailwind CSS + Lucide React, and three.js (via @react-three/fiber + @react-three/drei) for the hero's 3D machine.

## Running it

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
npm run test       # run the unit tests once
npm run test:watch # watch mode
```

`dist/` is a static build — upload it as-is to Hostinger (or any static host).

**Important for deployment:** this site uses client-side routing (a small hand-rolled router, not a full framework router), so only `index.html` really exists as a file — `/about`, `/calculator` and `/privacy` are rendered by JavaScript after that file loads. That means a **direct visit or refresh on any page other than `/` will 404** unless the host is told to serve `index.html` for any unmatched path. `dist/.htaccess` (copied automatically from `public/.htaccess`) does this for Apache, which is what Hostinger's shared hosting runs — just make sure it uploads along with everything else (some FTP clients hide dotfiles by default, so double-check it's there). If you deploy somewhere else (Netlify, Vercel, Cloudflare Pages, etc.), it'll need the equivalent "SPA fallback" / rewrite-all-to-index.html setting instead.

## Where things live (single source of truth)

- **Contact details, URLs, keys** → `src/config/site.ts`
- **All copy (ES/EN/FR)** → `src/i18n/es.ts`, `src/i18n/en.ts`, `src/i18n/fr.ts` (same keys in all three — enforced both by TypeScript and by a test in `src/i18n/i18n.test.ts`)
- **Colors and fonts** → `src/index.css` (CSS variables) + `tailwind.config.ts`
- **Form field list + allowed values** → `src/lib/application.ts`
- **3D machine config** → `src/config/machines.ts`

## Values to fill in before launch (`src/config/site.ts`)

| Constant | What it is | Status |
|---|---|---|
| `APPS_SCRIPT_URL` | The deployed Google Apps Script Web App URL that receives form submissions | **TODO — placeholder URL, must be replaced** |
| `PRIVACY_URL` | Link to the privacy policy | Points to `/privacy`, which now has a real starter policy (`src/pages/Privacy.tsx`, copy in `src/i18n/*.ts`) — **have a lawyer review it before launch**, it's a plain-language starting point, not legal advice, especially given the financial/credit data this form collects |
| `CONSENT_COMPANY_NAME` | Name shown in the consent checkbox text | `"Vinancial Capital"` |
| `SITE.email`, `SITE.phoneDisplay`, `SITE.phoneE164`, `SITE.whatsappUrl`, `SITE.address` | Contact details | Filled in from the brief — double check before launch |
| `SITE.founder.linkedInUrl` | Founder's LinkedIn | Filled in from the brief |

## Fonts and logo

- **Fonts:** the brief asked for **Ethnocentric** (headings) and **Avenir Next** (body) — neither is free to use on a commercial site (Avenir Next is Adobe/Linotype-owned; Ethnocentric's free license is personal-use only). Until real licensed webfont files are provided, this build uses the closest free Google Fonts alternatives: **Orbitron** for headings/wordmark (`font-slab` in `tailwind.config.ts`) and **Poppins** for body/UI (`font-sans`). To swap in the real fonts once licensed: replace the Google Fonts `<link>` in `index.html` with your font kit (or self-host the `.woff2` files under `public/fonts/` and add `@font-face` rules in `src/index.css`), then update the two `fontFamily` entries in `tailwind.config.ts` and the two hardcoded `font-family` declarations in `src/index.css`.
- **Logo:** the real mark, generated from the provided artwork via favicon.io as `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` and `site.webmanifest` (wired in through `<link>` tags in `index.html`), each with the flat white background removed so the mark sits on a transparent background. The largest of those, `public/android-chrome-512x512.png`, is also reused for the navbar/footer wordmark (`src/components/layout/Wordmark.tsx`) and the hero background watermark (`src/components/home/Hero.tsx`), so there is only one source image for the mark across the whole site. If you get a vector source file (SVG/AI/EPS ideally) later, swap it in at those same paths for crisper scaling at large sizes.

## 3D machine models

The hero shows one of three machines (excavator, semi-truck, commercial oven) depending on the selected industry, defined in `src/config/machines.ts`.

**Right now, with no `.glb` files in the repo, the hero shows a stylized placeholder.** It's a simple machine built from basic geometric shapes (boxes, cylinders) directly in code, with the same hover/touch interactivity (spinning wheels/tracks, a lifting arm, an opening oven door) as the real models will have. See `src/components/three/PlaceholderMachine.tsx`. This isn't meant to be the final look. It's there so the site works and feels alive before real assets exist. Once you add real `.glb` files below, the site tries to load them first on every page load and only falls back to the placeholder if a file is missing or fails to load, so no code changes are needed to make the switch.

1. **Add the files.** Drop the `.glb` files here:
   - `public/models/excavator.glb`
   - `public/models/semi-truck.glb`
   - `public/models/oven.glb`

   Also add a static poster image per industry (shown while the model loads, and permanently if WebGL is unavailable or the visitor has "reduce motion" turned on):
   - `public/models/construction.webp`
   - `public/models/trucking.webp`
   - `public/models/restaurant.webp`

2. **Find the node names.** Every interactive part (wheels, tracks, the excavator arm/bucket, the oven door) needs to reference the exact node name inside the `.glb`. Once a model is loading in dev, its node names are printed to the browser console automatically (see `logGLTFNodeNames` in `src/config/machines.ts`, wired into `src/components/three/MachineModel.tsx`) — open the browser console with the site running locally, load the hero, and you'll see a list like:

   ```
   [Vinancial Capital] GLTF node names:
   Wheel_FL (Mesh)
   Wheel_FR (Mesh)
   Body (Mesh)
   ...
   ```

3. **Wire them up.** Edit `src/config/machines.ts` and replace the placeholder `nodeName` values (currently `'TODO_track_left'`, `'TODO_wheel_front_left'`, etc.) with the real names from step 2, and adjust `motion` (spin axis/speed, or hinge axis/max angle) to match how each part should move.

Until real models are added, the hero falls back to the poster image for that industry (or shows nothing if the poster is also missing — add the `.webp` files to avoid that).

## Language and currency detection

- The site opens in Spanish. The navbar has a country/language picker (`src/components/layout/LanguagePicker.tsx`, flags in `public/flags/`, from the MIT-licensed flag-icons set) that switches to English or French and remembers the choice in `localStorage` (`vc_lang`), which the inline script in `index.html` reads before first paint, so `<html lang>` always matches the visible text.
- Currency (CAD vs USD) is auto-detected from the visitor's locale region or timezone — see `src/lib/currency.ts`.

## Testing notes

- `npm run test` covers: i18n key parity across the three languages, the application form's field list/derivation/validation, and the calculator's math (including the exact-to-the-cent examples from the spec).
- The 3D hero, language auto-detection, and form flows were smoke-tested in a headless browser across `es-MX`, `fr-CA`, `en-US`, and `pt-BR` (→ English fallback) locales, at a 390px mobile viewport, with no console errors other than the expected ones from the still-missing `.glb` files.
- Still to verify manually once real assets are in: Lighthouse mobile score, `prefers-reduced-motion` on a real device, and the full form submission against a live Apps Script deployment.

## Backend changes needed in Apps Script (`Code.gs`)

This repo only contains the frontend. The following changes need to be made to the separately-deployed Apps Script backend:

1. **Confirm the `FIELDS` list still matches** `src/lib/application.ts`'s `FIELDS` export exactly:
   `tipo_financiamiento, servicio_financiero, servicio_otro, situacion, monto_solicitado, urgencia, empresa, provincia_estado, industria, sitio_web, tipo_negocio, tiempo_operando, ingresos_anuales, vivienda, codeudor, puntaje_credito, historial_legal, nombre, apellido, correo, telefono, consentimiento` — plus `idioma`, `pagina`, and `website` (honeypot — reject the submission if this arrives non-empty; a real visitor never fills it in, only bots that fill in every field do).
   Also add `otro` to the allowed `servicio_financiero` values (it maps to `tipo_financiamiento = equipo`), and accept `servicio_otro` (free text, max 500 chars, only filled when `servicio_financiero` is `otro`). Every field is now required on the frontend.
2. **Confirmation email to the applicant.** In `doPost`, right after the row is saved, add:

   ```js
   MailApp.sendEmail({
     to: data.correo,
     name: 'Vinancial Capital',
     replyTo: 'support@vinancialcapital.com',
     subject: 'Recibimos tu solicitud – Vinancial Capital',
     body:
       'Hola ' + data.nombre + ',\n\n' +
       'Gracias por escribirnos. Recibimos tu solicitud (número ' + id + ') y la estamos revisando.\n' +
       'Te contactamos en 1 día hábil. Si tienes preguntas, responde a este correo o escríbenos por WhatsApp: https://wa.me/14374296575\n\n' +
       'Vicente Correa\nVinancial Capital',
   });
   ```

   (`data` is the parsed JSON body and `id` the application id you already return.) Re-deploy the Web App as a **new version** afterwards, and approve the Gmail permission Apps Script asks for.
3. **CORS:** the frontend POSTs with `Content-Type: text/plain;charset=utf-8` specifically to avoid a CORS preflight (which Apps Script can't answer), so the body arrives as a JSON string in `e.postData.contents` — make sure `doPost` parses it that way rather than expecting `e.parameter`.

**Note on spam protection:** reCAPTCHA was removed from this build (per request). The only spam guard left is the honeypot field above. That's normally enough to stop simple bots, but if spam becomes a real problem later, reCAPTCHA v3 can be added back on both ends.

## Known limitations / follow-ups

- The real `.glb` model files aren't in this repo yet. The hero currently shows a stylized procedural placeholder machine built from basic shapes (`src/components/three/PlaceholderMachine.tsx`) so it isn't empty — drop real `.glb` files into `public/models/` (see "3D machine models" above) and the site automatically switches to them on the next page load, no code changes needed beyond filling in the node names.
- `/privacy` has a real starter policy now, but it needs a lawyer's review before launch (see the table above).
- Fonts are free stand-ins (Orbitron/Poppins), not the licensed Ethnocentric/Avenir Next from the brief — see "Fonts and logo" above.
- The logo is a hand-recreated approximation, not the original source file — see "Fonts and logo" above.
