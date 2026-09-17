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
| `PRIVACY_URL` | Link to the privacy policy | Points to `/privacy`, which doesn't exist yet — either add that page or point this at wherever the policy lives |
| `CONSENT_COMPANY_NAME` | Name shown in the consent checkbox text | Currently `"Mehmi Financial Group"` per the brief — confirm this is correct |
| `SITE.email`, `SITE.phoneDisplay`, `SITE.phoneE164`, `SITE.whatsappUrl`, `SITE.address` | Contact details | Filled in from the brief — double check before launch |
| `SITE.founder.linkedInUrl` | Founder's LinkedIn | Filled in from the brief |

Also: the FAQ has a placeholder answer for "How much does it cost to talk to you?" — the literal string `TODO_CONFIRM_FEES` in all three `i18n` files (`faq.feesAnswer`). A console warning fires in dev for as long as it's still there. Replace it with the real answer (or "It's free") before launch.

## 3D machine models

The hero shows one of three machines (excavator, semi-truck, food truck) depending on the selected industry, defined in `src/config/machines.ts`.

1. **Add the files.** Drop the `.glb` files here:
   - `public/models/excavator.glb`
   - `public/models/semi-truck.glb`
   - `public/models/food-truck.glb`

   Also add a static poster image per industry (shown while the model loads, and permanently if WebGL is unavailable or the visitor has "reduce motion" turned on):
   - `public/models/construction.webp`
   - `public/models/trucking.webp`
   - `public/models/restaurant.webp`

2. **Find the node names.** Every interactive part (wheels, tracks, the excavator arm/bucket, the food truck's service window) needs to reference the exact node name inside the `.glb`. Once a model is loading in dev, its node names are printed to the browser console automatically (see `logGLTFNodeNames` in `src/config/machines.ts`, wired into `src/components/three/MachineModel.tsx`) — open the browser console with the site running locally, load the hero, and you'll see a list like:

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

- No language switcher exists on purpose (a previous toggle confused Google Translate). Language is auto-detected once, from `navigator.languages`, matched against `es`/`fr`/`en` — first match wins, otherwise English. This happens in an inline script in `index.html` before first paint, so `<html lang>` always matches the visible text.
- Currency (CAD vs USD) is auto-detected from the visitor's locale region or timezone — see `src/lib/currency.ts`.

## Testing notes

- `npm run test` covers: i18n key parity across the three languages, the application form's field list/derivation/validation, and the calculator's math (including the exact-to-the-cent examples from the spec).
- The 3D hero, language auto-detection, and form flows were smoke-tested in a headless browser across `es-MX`, `fr-CA`, `en-US`, and `pt-BR` (→ English fallback) locales, at a 390px mobile viewport, with no console errors other than the expected ones from the still-missing `.glb` files.
- Still to verify manually once real assets are in: Lighthouse mobile score, `prefers-reduced-motion` on a real device, and the full form submission against a live Apps Script deployment.

## Backend changes needed in Apps Script (`Code.gs`)

This repo only contains the frontend. The following changes need to be made to the separately-deployed Apps Script backend:

1. **Confirm the `FIELDS` list still matches** `src/lib/application.ts`'s `FIELDS` export exactly:
   `tipo_financiamiento, servicio_financiero, situacion, monto_solicitado, urgencia, empresa, provincia_estado, industria, sitio_web, tipo_negocio, tiempo_operando, ingresos_anuales, vivienda, codeudor, puntaje_credito, historial_legal, nombre, apellido, correo, telefono, consentimiento` — plus `idioma`, `pagina`, and `website` (honeypot — reject the submission if this arrives non-empty; a real visitor never fills it in, only bots that fill in every field do).
2. **CORS:** the frontend POSTs with `Content-Type: text/plain;charset=utf-8` specifically to avoid a CORS preflight (which Apps Script can't answer), so the body arrives as a JSON string in `e.postData.contents` — make sure `doPost` parses it that way rather than expecting `e.parameter`.

**Note on spam protection:** reCAPTCHA was removed from this build (per request). The only spam guard left is the honeypot field above. That's normally enough to stop simple bots, but if spam becomes a real problem later, reCAPTCHA v3 can be added back on both ends.

## Known limitations / follow-ups

- The `.glb` model files and their poster images are not included in this repo — see "3D machine models" above.
- `/privacy` has no page yet; `PRIVACY_URL` currently points there anyway.
- `APPS_SCRIPT_URL` needs a real value before launch.
