# GlideWeather

**GlideWeather** is a real-time weather console for paragliding pilots. It aggregates forecast data from **meteoblue** (primary, server-side) with **Open-Meteo** as automatic fallback, plus Open-Meteo air quality and geocoding, into a conservative launch verdict. The interface is English by default and Romanian for Romanian locales. Place search works worldwide.

- Production: [glideweather.app](https://glideweather.app)
- Test: [glideweather.vercel.app](https://glideweather.vercel.app)

---

## Purpose

Paragliding relies heavily on precise local meteorological conditions. Standard weather apps do not evaluate critical flight parameters such as wind speed limits, gust spread (turbulence indicator), cloud cover, visibility, or atmospheric instability (CAPE).

This application synthesizes key flight parameters into a single actionable signal with a 0–100 flight suitability score and detailed risk warnings, helping pilots make informed, safety-first decisions before heading to takeoff.

---

## Key Features

- **Real-Time Flight Verdict & Scoring (0–100):** Evaluates live weather samples against conservative paragliding safety thresholds:
  - **Poți zbura (Good Window):** Favorable wind, low gust spread, high visibility, and stable atmosphere.
  - **La limită (Marginal):** Borderline conditions or moderate gust spreads requiring caution.
  - **Nu zbura (No-Go):** Excessive wind/gusts, severe turbulence potential, precipitation, low visibility, thunderstorm risk, or high CAPE (> 1500 J/kg).
- **Location Detection & Search:**
  - Auto-locates takeoff sites using browser Geolocation (GPS).
  - Search any spot or locality worldwide using Open-Meteo Geocoding.
- **3-Day Forecast & Launch Window Scanner:**
  - Hour-by-hour daylight scanning to identify the top launch windows for the day.
  - Daily summaries featuring min/max temperatures, max wind/gusts, sunrise/sunset, UV index, and rain probabilities.
- **Interactive Telemetry & Metrics:**
  - 360° Wind direction compass & speed dial.
  - Gust spread calculator.
  - Atmospheric instability (CAPE) monitoring.
  - Visibility, pressure, humidity, air quality (AQI, PM2.5, PM10), and UV index.
- **Languages:** English interface by default, full Romanian copy, and a country picker covering Europe plus major regions worldwide. Geocoding uses the selected language when Open-Meteo supports it.
- **Theme Support:** Dark mode and light mode, with the launch verdict, wind dial, and launch windows kept in view.

---

## Tech Stack

### Core Framework & Build Tools
- **[Next.js 16](https://nextjs.org/)** (App Router architecture)
- **[vinext](https://github.com/cloudflare/vinext)** / **Vite 8** – Lightweight Next.js-compatible runner powered by Vite and Cloudflare Workers runtime
- **React 19** & **TypeScript 5.9**

### UI & Styling
- **[Material UI (MUI v9)](https://mui.com/)** (`@mui/material`, `@mui/icons-material`)
- **[Emotion](https://emotion.sh/)** (`@emotion/react`, `@emotion/styled`)
- **[Tailwind CSS v4](https://tailwindcss.com/)** & PostCSS

### State Management & Data Fetching
- **[TanStack React Query v5](https://tanstack.com/query)** – Query caching, background refetching, and stale-time management
- **[Zod v4](https://zod.dev/)** – Strict schema parsing and validation for API responses

### Weather Data APIs
- **meteoblue Forecast API (primary):** `basic-1h`, `wind-3h`, `clouds-3h`, `air-3h` packages via `/api/weather` (requires `METEOBLUE_API_KEY` on the server)
- **Open-Meteo Forecast API (fallback):** Same normalized domain model when Meteoblue fails or the key is unset
- **Open-Meteo Air Quality API:** AQI, PM2.5, PM10, and UV index (alongside either forecast provider)
- **Open-Meteo Geocoding API:** Location search and coordinate lookup

See [docs/weather.md](docs/weather.md) for architecture, field mapping, and flight-intelligence rules.

### Persistence & Storage (Prepared)
- **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`) with Cloudflare D1 support

---

## Getting Started

### Prerequisites
- **Node.js**: `>=22.13.0`
- **npm**: `>=10.0.0`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd glideweather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal) in your browser.

### Building for Production

Build and verify the output using vinext:
```bash
npm run build
```

---

## Project Structure

```text
├── app/
│   ├── components/
│   │   └── GlideWeatherApp.tsx       # Dashboard: location controls, verdict, launch windows
│   ├── lib/
│   │   ├── weather.ts                # Client facade (calls /api/weather)
│   │   └── weather/                  # Domain, Meteoblue, Open-Meteo, service layer
│   ├── api/weather/route.ts          # Server weather endpoint
│   ├── brand.ts                      # Product name, verdict titles, metadata copy
│   ├── globals.css                   # Global styles & Tailwind import
│   ├── layout.tsx                    # Root Next.js layout
│   └── page.tsx                      # Entry home page
├── db/                               # Drizzle schema definitions
├── drizzle.config.ts                 # Drizzle Kit migration configuration
├── vite.config.ts                    # Vite build configuration
└── package.json
```

---

## Available Scripts

- `npm run dev`: Starts the local development server via `vinext dev`.
- `npm run build`: Builds the production bundle using `vinext build`.
- `npm run vercel-build`: Builds for Vercel using `next build`.
- `npm run lint`: Runs ESLint across the project.
- `npm run db:generate`: Generates Drizzle database migrations.

---

## Disclaimer

This app is an automated decision aid and weather visualization console. It is **not** an authorization for flight. Pilots are solely responsible for evaluating actual local conditions on site, including wind velocity, rotor, convective development, airspace regulations, and personal piloting skill limits.
