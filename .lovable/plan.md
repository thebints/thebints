## The Bints Foundation — Corporate NGO Website

A dignified, editorial-grade website for a women & girls empowerment foundation. Premium magazine-style design, no generic templates, no emoji, no AI slop. Every page treated as an editorial spread.

---

### 🎨 Design System — "Editorial Royal"

- **Primary:** Deep burgundy / wine (`hsl(345 55% 22%)`)
- **Accent:** Brushed antique gold (`hsl(40 55% 52%)`)
- **Surfaces:** Warm ivory (`hsl(38 30% 96%)`), bone, soft champagne
- **Ink:** Near-black charcoal for body text
- **Typography:** **Poppins** loaded via Google Fonts (300 / 400 / 500 / 600 / 700 / 800)
  - Display: Poppins 700–800, generous tracking-tight
  - Body: Poppins 400, comfortable leading
  - Eyebrow labels: Poppins 500 uppercase, wide tracking, gold
- **Iconography:** **Ionicons** (`ionicons` npm package, registered as web components) — outline style for nav, sharp/filled for emphasis. No Lucide.
- **Texture & detail:** Hairline gold dividers, subtle paper-grain noise, drop-cap on opening paragraphs, serif-feel hierarchy achieved through Poppins weight contrast
- **Motion:** Slow, restrained — fade-rise on scroll, gentle parallax on hero imagery, no bouncy micro-interactions

---

### 🧭 Top Navigation (6 menus + Donate CTA)

Sticky header with the foundation wordmark left, menu center, and a solid burgundy **Donate** pill with gold ring on the right. Submenus open as wide editorial mega-menus (not tiny dropdowns) with a short blurb + Ionicon per item.

1. **Home**
2. **About Us** — Founder's Message · Vision & Mission · Core Values (BINTS) · Governance & Leadership · Background
3. **Our Focus** — Women's Economic Empowerment · Girl-Child Education & Mentorship · Asset Ownership & Social Housing · Welfare & Humanitarian Care · Leadership & Personal Development
4. **Programmes** — All 10 flagship programmes grouped (Empowerment · Education · Welfare · Housing Initiative)
5. **Get Involved** — Partner With Us · Volunteer · Mentorship Circle · Concerned Sisters Forum (CSF) · Apply for Support
6. **Media & Contact** — News & Stories · Gallery · Impact Reports · Contact

**Donate** button (always visible, also fixed on mobile bottom bar) → routes to `/donate`.

---

### 📄 Pages & Content (drawn directly from the profile)

**Home**
- Editorial hero: full-bleed photograph of Nigerian woman in dignified setting, large display headline *"Dignity. Opportunity. Sustainable Impact."*, gold underline, twin CTAs (Donate · Our Programmes)
- Foundation introduction band with the BINTS acronym animated in
- 5 Areas of Focus as a numbered editorial grid with Ionicons
- Founder's spotlight — portrait left, pull-quote right, signature
- Flagship programmes carousel (10 cards)
- Impact metrics strip (women empowered, girls supported, businesses, welfare interventions)
- Partnership call-to-action band
- Footer with contact, newsletter, socials

**About Us pages**
- Founder's Message (full letter from Hajia Binta Ibrahim with portrait + signature block)
- Vision & Mission (split editorial layout)
- Core Values — BINTS expanded as a vertical typographic feature
- Governance Structure (org diagram)
- Background & The Gap We Fill

**Our Focus** — one rich page per focus area with overview, what we do, related programmes, and a "Get Involved" CTA. Housing page features the social-housing components as a checklist.

**Programmes** — index page + detail pages for each of the 10 programmes (Women Empowerment, Girl-Child Education Support, Skills for Dignity, Mentorship Circle, Welfare & Care Outreach, Enterprise Support, Back-to-School, Dignity Kit, Widows Support, Housing & Social Housing Initiative).

**Get Involved**
- Partner With Us (the 8 partnership areas from the profile as cards)
- Volunteer (form)
- Mentorship Circle
- CSF — explains the Concerned Sisters Forum relationship
- Apply for Support (intake form)

**Media & Contact**
- News & Stories (article grid, ready for content)
- Gallery (masonry)
- Impact Reports (downloadable cards)
- Contact (Plot 636, David Jemibewon Crescent, Apo-Gudu, Abuja + map embed + form)

**Donate (`/donate`)** — dedicated page with:
- Editorial hero "Your Gift Restores Dignity"
- Suggested giving tiers (₦5k / ₦25k / ₦100k / Custom) with what each enables
- Programme designation selector
- Bank transfer details panel
- Partnership giving / corporate sponsorship contact form
- Transparency note linking to Monitoring & Impact
- (No live payment processor — clean handoff to bank/contact. Live payments can be added later.)

**404** — on-brand editorial NotFound.

---

### 🖼️ Imagery (AI-generated, on-brand)

Generate ~8–10 tasteful photographs using the AI gateway:
- Hero: Nigerian woman portrait, soft natural light, dignified
- Girl-child education classroom moment
- Women in enterprise / market setting
- Mentorship circle gathering
- Housing / community handover
- Welfare outreach
- Founder portrait placeholder (clearly marked for client to swap with real photo of Hajia Binta Ibrahim)
- Texture/pattern accents

All images warm-toned to harmonize with the burgundy/gold/ivory palette.

---

### 🛠️ Technical

- React + Vite + Tailwind (existing stack)
- Routes added for all pages above; submenu items each get real routes
- Ionicons via `ionicons` package registered once in `main.tsx`; thin `<Ion name="..." />` wrapper for typing
- Poppins via Google Fonts `<link>` in `index.html`
- All colors as HSL tokens in `index.css`; Tailwind config extended with the burgundy/gold palette and Poppins font family
- Fully responsive — mobile gets a slide-in drawer with the same 6-menu structure and a sticky Donate bar
- Accessible: semantic landmarks, focus rings in gold, sufficient contrast

---

### ✅ What you'll get after Implement

A complete multi-page editorial NGO website with all 6 top-level menus and submenus wired, real foundation content from your profile, premium burgundy/gold visual identity, Poppins + Ionicons throughout, on-brand AI photography, and a working Donate page ready for partners.