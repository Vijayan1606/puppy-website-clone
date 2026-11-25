# 🐾 TeddyPups U.A.E.

> **"every puppy is family"**

A premium, fully animated React website for **TeddyPups U.A.E.** — a Dubai-based boutique specializing in teacup and teddy bear puppies. The site showcases available puppies, supports an import-on-request service sourcing rare breeds from Europe and Korea, and guides families through every step of the adoption journey.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Pages & Routes](#-pages--routes)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Key Components](#-key-components)
- [Data Layer](#-data-layer)
- [Deployment](#-deployment)

---

## 🌟 Overview

TeddyPups U.A.E. is a production-ready **React + TypeScript + Vite** single-page application. It was built to serve as the digital storefront for a premium puppy boutique in Downtown Dubai. The experience is rich and interactive — featuring a hand-crafted animated mascot puppy, a paw-print cursor trail, smooth inertia scrolling, scroll-driven animations, and a WhatsApp-style "how it works" section.

The site supports two customer journeys:

| Journey | Description |
|---|---|
| **In Dubai** | Browse and meet puppies in the showroom before taking one home the same day |
| **Imported** | Reserve a rare teacup breed from certified breeders in Korea or Europe — TeddyPups handles the full import |

---

## ✨ Features

### 🐶 Animated Mascot — TeddyBuddy
- A fully procedural SVG puppy mascot rendered via a custom animation rig (`PupRig` class)
- 12 named poses: `stand`, `walk`, `sit`, `peek`, `snug`, `lie`, `sleep`, `settle`, `hop`, `sniff`, `bow`, `beg`
- 10 interactive tricks: `woof`, `spin`, `beg`, `bow`, `hop`, `love`, `tilt`, `sneeze`, `zoomies`, `peekaboo`
- Real-time physics: tail wagging, ear bounce, blinking, gaze tracking, idle breathing
- Click/tap the mascot to trigger random tricks with speech bubbles and floating hearts
- The mascot walks across the screen on page transitions

### 🐾 Paw-Print Cursor Trail
- On desktop pointer devices, a custom `<canvas>` overlay draws alternating left/right SVG paw prints that follow the cursor and fade out gracefully

### 🎞 Smooth Scroll
- Powered by **Lenis** with configurable lerp easing (0.1) and wheel multiplier
- Respects `prefers-reduced-motion` — degrades to native instant scroll for accessibility
- Hash-link scrolling is intercepted and smoothly animated

### 🎬 Scroll-Driven Animations (RevealScope)
- Elements animate in as they enter the viewport using `IntersectionObserver`
- The `ChatSection` syncs a WhatsApp-style UI panel to the user's scroll position, revealing conversation steps one by one

### 📱 WhatsApp Chat UI
- An interactive mock WhatsApp conversation that reveals breed chips, puppy photos, a video clip, and a delivery-route SVG as the user scrolls
- Direct link to open a real WhatsApp conversation

### 🛤 Route Curtain Transitions
- Page navigations are wrapped in a smooth curtain wipe animation (`RouteCurtain`)

### 🖼 Responsive Media & Lazy Loading
- All puppy images and videos are served via a custom `MediaImage` component with focal-point-aware CSS object-position, blur placeholder data URLs, and responsive `sizes` attributes
- Videos have poster frames and an accessible play/pause toggle

### ♿ Accessibility
- ARIA labels on all interactive elements and decorative SVGs
- Dynamic `<title>` and `<meta description>` / Open Graph tags per route
- Keyboard-navigable, focus-managed routing

---

## 📄 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero lineup, available puppies preview, two-path fork, WhatsApp chat section, trust passport, family testimonials, FAQ preview, final CTA |
| `/puppies` | Puppies | Full filterable puppy grid with breed and origin filters |
| `/puppies/:slug` | Puppy Detail | Individual puppy profile with media gallery, details, and enquiry CTA |
| `/gone-home` | Gone Home | Archive of adopted puppies with a gallery of their journey |
| `/happy-families` | Happy Families | Photo wall of families who adopted through TeddyPups |
| `/how-it-works` | How It Works | Tabbed journey walkthrough for local vs imported puppies |
| `/faq` | FAQ | Accordion of frequently asked questions |
| `/contact` | Contact | Showroom address, WhatsApp link, phone, email, and a letter-style enquiry form |
| `*` | 404 | Custom not-found page |

---

## 📁 Project Structure

```
teddypuppy/
├── public/
│   ├── brand/
│   │   └── logo.png              # Brand logo
│   ├── cursor/
│   │   ├── paw.svg               # Cursor paw icon
│   │   └── paw-press.svg         # Cursor paw (pressed state)
│   ├── media/                    # All puppy images and videos (self-hosted)
│   │   └── <media-id>/           # Each media item in its own folder
│   ├── apple-icon.png
│   └── icon.png
├── src/
│   ├── components/
│   │   ├── TeddyBuddy.tsx        # Animated SVG mascot rig, poses, tricks, PupJourney walk
│   │   ├── PawTrailCanvas.tsx    # Canvas-based paw-print cursor trail
│   │   ├── SmoothScroll.tsx      # Lenis inertia scroll integration
│   │   ├── RouteCurtain.tsx      # Page transition curtain wipe
│   │   ├── RevealScope.tsx       # Scroll-reveal IntersectionObserver hook
│   │   ├── ChatSection.tsx       # WhatsApp-style scroll-synced chat UI
│   │   ├── HeroLineup.tsx        # Hero puppy card lineup
│   │   ├── MeetSection.tsx       # Available puppies grid section
│   │   ├── DuskSection.tsx       # Dark "happy families" photo section
│   │   ├── JourneysSection.tsx   # How-it-works journey tabs
│   │   ├── SceneSection.tsx      # Sky-gradient scene wrapper
│   │   ├── StoryRibbon.tsx       # Horizontal scrolling story ribbon
│   │   ├── NoticeBoard.tsx       # Pinboard-style notice component
│   │   ├── PuppyBrowser.tsx      # Filterable puppy browser
│   │   ├── PuppyGallery.tsx      # Puppy media gallery viewer
│   │   ├── PupSketchCard.tsx     # Individual puppy card (sketch style)
│   │   ├── Polaroid.tsx          # Polaroid-style photo component
│   │   ├── PhotoViewer.tsx       # Lightbox photo viewer
│   │   ├── MediaImage.tsx        # Responsive image/video component
│   │   ├── EnquiryForm.tsx       # Puppy enquiry form
│   │   ├── LetterForm.tsx        # Letter-style contact form
│   │   ├── Header.tsx            # Site header with navigation
│   │   ├── Footer.tsx            # Site footer
│   │   ├── FlightSvg.tsx         # Animated plane SVG (import journey)
│   │   └── icons.tsx             # Shared SVG icon primitives & paw path
│   ├── data/
│   │   ├── puppies.ts            # ALL_PUPPIES array, BREEDS filter list, type definitions
│   │   ├── families.ts           # FAMILY_PHOTOS, FAMILY_TESTIMONIALS
│   │   └── site.ts               # SITE config, FAQS, HOW_IT_WORKS_JOURNEYS, chat data
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PuppiesPage.tsx
│   │   ├── PuppyDetailPage.tsx
│   │   ├── GoneHomePage.tsx
│   │   ├── HappyFamiliesPage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── FaqPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── App.tsx                   # Router, route-level meta tags, AppShell
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles & design tokens
├── index.html                    # HTML shell with meta tags & OG tags
├── vite.config.ts                # Vite config (React, Tailwind v4, asset copying)
├── vercel.json                   # SPA rewrite rule for Vercel
├── tsconfig.json                 # TypeScript config
├── package.json
└── metadata.json                 # App metadata (name, description, capabilities)
```

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript 7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 (Vite plugin) |
| **Routing** | React Router DOM v7 |
| **Smooth Scroll** | Lenis v1 |
| **Animation** | Motion (Framer Motion successor), custom SVG rig |
| **Icons** | Lucide React |
| **AI / Chat** | `@google/genai` (Gemini API) |
| **Backend** | Express (for server-side Gemini API calls) |
| **Deployment** | Vercel (SPA mode) |
| **Package Manager** | npm / Bun |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher (or Bun)
- A **Gemini API key** (for AI-powered features)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd teddypuppy

# Install dependencies
npm install
# or with Bun:
bun install
```

### Running Locally

```bash
npm run dev
```

The development server starts at **http://localhost:3000** (bound to all interfaces).

> Hot Module Replacement (HMR) is enabled by default. Set `DISABLE_HMR=true` to disable it (used by AI-assisted editing tools to prevent UI flickering).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build for production to the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## 🧩 Key Components

### `TeddyBuddy.tsx` — Animated Mascot

The heart of the site. Contains:

- **`PupSvg`** — Static SVG render of the puppy in any pose
- **`PupRig`** — Imperative animation class that runs a `requestAnimationFrame` loop, lerping between poses, handling physics (bounce, ear flop, tail wag, blinking, gaze tracking)
- **`PupStop`** — React component that mounts a live `PupRig` and responds to click events (triggers tricks) and hover (gaze tracking + petting)
- **`PupJourney`** — The mascot that walks across the bottom of the screen on each route change, then settles at a random position

**Poses available:** `stand` · `walk` · `sit` · `peek` · `snug` · `lie` · `sleep` · `settle` · `hop` · `sniff` · `bow` · `beg`

**Tricks available:** `woof` · `spin` · `beg` · `bow` · `hop` · `love` · `tilt` · `sneeze` · `zoomies` · `peekaboo`

### `ChatSection.tsx` — Scroll-Synced WhatsApp UI

A sticky-panel component that tracks which step the user has scrolled to (via `IntersectionObserver`) and progressively reveals a mock WhatsApp conversation: breed chips → puppy photos → a video clip → a delivery-route SVG. The mascot reacts to each new message appearing.

### `PawTrailCanvas.tsx` — Cursor Trail

A full-viewport `<canvas>` element that draws alternating left/right paw prints (using the same SVG `PAW_PATH` constant) wherever the mouse moves. Each print fades out over ~1.4 seconds. Disabled on touch/stylus devices and when `prefers-reduced-motion` is active.

### `SmoothScroll.tsx` — Lenis Integration

Wraps the entire page in Lenis inertia scrolling. Intercepting `<a href="#...">` clicks and smoothly animating to the target. Automatically disables itself on touch devices or when the user prefers reduced motion.

### `SceneSection.tsx` — Sky Gradient Sections

A section wrapper that renders a vertical sky gradient between configurable top/bottom colors, with optional sunset mode. Used to create the seamless color-transition page feel.

### `MediaImage.tsx` — Smart Media Component

Renders both images and videos with:
- Focal-point-aware `object-position` (from `focalX`/`focalY` data)
- Blur placeholder via `blurDataUrl` (Base64 WebP)
- Responsive `sizes` attribute
- Video poster frames with accessible play/pause button

---

## 📊 Data Layer

All content is static TypeScript data (no CMS calls at runtime):

### `src/data/puppies.ts`

- **`PuppyItem`** interface — id, slug, name, breed, gender, age, colour, description, status (`available` | `reserved` | `rehomed`), cover image, media array, origin (`local` | `imported`), breeds, collections, SEO description, prev/next slugs for navigation
- **`ALL_PUPPIES`** — full list of all puppies (available + archived)
- **`AVAILABLE_PUPPIES`** — filtered subset (computed)
- **`BREEDS`** — breed filter options: Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu, Maltese, Bichon, Pomsky

### `src/data/site.ts`

- **`SITE`** — business config: name, tagline, description, WhatsApp link, phone, email, address, social links
- **`FAQS`** — 9 FAQ items covering vaccinations, showroom visits, same-day pickup, importing, and post-adoption support
- **`HOW_IT_WORKS_JOURNEYS`** — step-by-step journey configs for the local and imported paths
- **`HOME_CHAT_STEPS`** — the 3 steps shown in the WhatsApp chat UI
- **`CHAT_SHOWCASE_MEDIA`** — showroom photos and video for the chat UI

### `src/data/families.ts`

- **`FAMILY_PHOTOS`** — photos submitted by adoptive families
- **`FAMILY_TESTIMONIALS`** — customer testimonials

---

## 🚢 Deployment

### Vercel (Recommended)

The project includes a `vercel.json` that rewrites all routes to `index.html` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**To deploy:**

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the `GEMINI_API_KEY` environment variable in Vercel project settings
4. Deploy — Vercel auto-detects Vite and runs `npm run build`

### Manual / Self-Hosted

```bash
npm run build
# Serve the dist/ folder with any static file server
# Ensure all routes are rewritten to index.html
```

---

## 🎨 Design Tokens & Styling

The site uses **Tailwind CSS v4** via its Vite plugin (no `tailwind.config.js` needed). Custom design tokens and component styles live in `src/index.css` using CSS custom properties. Notable tokens include:

- `--header-h` — header height offset used by the `<main>` padding
- `--quilt` — used by the hero scallop pattern SVG fill
- `--ink-soft` — muted text colour
- `font-plush` / `font-scrawl` — custom display and handwriting font utilities

---

## 🤝 Contributing

This is a client project. If you are working on it:

1. Run `npm run lint` before committing — TypeScript errors will fail CI
2. Keep all puppy data in `src/data/puppies.ts` — do not add runtime data fetching
3. All media assets go in `public/media/<media-id>/` following the existing folder structure
4. The mascot animation budget is tight — do not add heavy CSS animations alongside the `PupRig` RAF loop

---

*Built with ❤️ for TeddyPups U.A.E. — Downtown Dubai*
