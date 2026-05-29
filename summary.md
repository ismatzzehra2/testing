# Rasioe Website — Build Progress

## Goal
Complete official website for "Rasioe" (راسیوے) — premium fine dining & family restaurant in Skardu — per spec in `New Text Document.txt`.

## Palette & Typography
- **Colors:** Black (#080806) backgrounds only, gold (#c9a84c) accents — no white/grey/gradients
- **Fonts:** Playfair Display (headings), Cinzel (nav/labels), Cormorant Garamond (body), Noto Nastaliq Urdu (Urdu)
- **Style:** Sharp corners (border-radius: 0), 0.5px gold lines, diamond ornaments, corner bracket frames, Art Deco

## Done
- `New Text Document.txt` — Full project spec (brand ID, ownership, contact, all sections, SEO, a11y)
- `index.html` (~796 lines) — Single-page site: splash, nav, hero (video+owner welcome), featured dishes, stats, about (owner card + partner card + chef team), menu (10 cats, ~55 items bilingual + 10 deals), gallery (4 tabs+lightbox), video showcase, testimonials, events (3 cards+enquiry form), blog, instagram, reservations (form+sidebar), contact (info+map+tourist guide+form), newsletter, footer (owner signature), WhatsApp float, back-to-top, schema JSON-LD
- `style.css` (~2173+ lines) — Full design system: splash animation, hero parallax, staggered menu entrance, owner cards grid (double-frame gold + initials avatar), chef grid, Urdu desc toggle, event form, tourist guide steps, footer signature, scroll reveal, responsive breakpoints
- `script.js` (~365 lines) — Nav scroll, active link, hamburger, menu-scoped lang toggle (class-based), tabs+search, lightbox (keyboard), forms (reservation → WhatsApp, contact → WhatsApp, event → WhatsApp, newsletter), counters (IObserver), scroll reveal, back-to-top, smooth anchors, min date, splash screen (3s+click), WhatsApp order buttons, Today's Special badge, parallax hero
- `sitemap.xml` — SEO sitemap
- `robots.txt` — Robots exclusion + sitemap reference

## Blocked (awaiting assets)
- Owner photo `WhatsApp_Image_2026-04-08_at_7_52_05_PM.jpeg` — all owner refs use Unsplash placeholder
- Real food/team/venue photos — all use Unsplash placeholders
- Hero video (MP4 exterior footage) — placeholder gradient used
- PDF menu file — download button shows toast "coming soon"

## Key Decisions
- Single-page layout with anchor sections
- Lang toggle scoped to `.menu-section` only (class `.lang-ur` toggles EN/UR names+descs via CSS)
- Splash: fades out 3s or click, preserves scroll position
- Owner cards: 2-col grid — Zaffar Abbas (photo, double-frame gold border) + Ali (initials avatar "A")
- 10 Family Deals (PKR 450–7,490) with labels: BEST VALUE, COUPLE, FRIENDS, etc.
- WhatsApp: +923499740602 (spec v2)
- Email: zafarabbas1@gmail.com
- Social: instagram.com/zafarbayya / facebook.com/zafarabbas

## Next Steps
1. Upload owner photo to `/images/owner.jpg` — replaces 3 Unsplash refs
2. Replace all Unsplash images with real Rasioe WebP photos
3. Replace hero video placeholder with actual MP4 footage
4. Create real PDF menu, add `download` attr to button
5. Set up form backend (Formspree/Netlify Forms) for all 4 forms
6. Minify CSS/JS for production
7. Deploy to domain + verify SEO/schema

## Files
- `C:\Users\ismat\Desktop\Zafar\rosoi\New Text Document.txt` — spec
- `C:\Users\ismat\Desktop\Zafar\rosoi\index.html` — main site
- `C:\Users\ismat\Desktop\Zafar\rosoi\style.css` — styles
- `C:\Users\ismat\Desktop\Zafar\rosoi\script.js` — interactions
- `C:\Users\ismat\Desktop\Zafar\rosoi\sitemap.xml` — SEO
- `C:\Users\ismat\Desktop\Zafar\rosoi\robots.txt` — SEO
