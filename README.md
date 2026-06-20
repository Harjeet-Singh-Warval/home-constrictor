<div align="center">
<img width="1200" alt="Pody Banner" src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=475&fit=crop" />
</div>

# Pody — Specialized Modular & Tiny Homes

An AI-powered marketing and design-quoting website for **Warval Cabin Systems LLC**, showcasing modular tiny home models with an intelligent customization engine.

## Features

- **Hero Carousel** — Full-screen slideshow with animated transitions
- **Model Gallery** — Interactive bento-grid showcasing 3 models (Cedar Lane, Pine Ridge, Willow Creek)
- **Structural Anatomy** — Toggleable floorplans with detailed spec sheets per model
- **Services Accordion** — Expandable service descriptions
- **AI Customizer** — Gemini-powered quote generator that produces architectural specs and cost breakdowns based on user preferences
- **Testimonials** — Carousel with client reviews
- **Newsletter** — Email signup form
- **Responsive** — Mobile-friendly with hamburger menu

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 15 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS v4, Motion |
| AI | Google Gemini (`@google/genai`) |
| Icons | Lucide React |
| Fonts | Montserrat + Geist |

## Getting Started

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Set your Gemini API key (optional — falls back to mock data)
# Copy .env.example to .env.local and add GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean Next.js cache |

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `APP_URL` | Hosted app URL |
| `DISABLE_HMR` | Set to `"true"` to disable HMR |

## Project Structure

```
app/          — Next.js App Router (pages, API routes)
hooks/        — Custom React hooks
lib/          — Utility functions
src/assets/   — Static images
```

## License

MIT
