# Weather subsystem — agent guide

## Weather architecture

- **Domain:** `app/lib/weather/domain.ts` — `WeatherSample`, `CurrentSnapshot`, `DayForecast`, `evaluateFlight`, formatters.
- **Providers:** `openMeteo.ts`, `meteoblue.ts`.
- **Orchestration:** `service.ts` — primary/fallback, cache, logging.
- **HTTP:** `app/api/weather/route.ts` — server-only Meteoblue key.
- **Client facade:** `app/lib/weather.ts` — same exports the UI already uses.

## Provider selection

1. Try Meteoblue if `METEOBLUE_API_KEY` is set.
2. On any `WeatherProviderError`, call Open-Meteo with `provider.fallback: true`.

## Fallback strategy

Deterministic: every Meteoblue failure class maps to Open-Meteo. Both failing → HTTP 502 from `/api/weather`.

## Domain models

Never pass raw Meteoblue or Open-Meteo JSON outside provider files. Extend `WeatherSample` with optional, unit-explicit fields.

## Normalization

- Timestamps: local `YYYY-MM-DDTHH:mm` without `Z` for `formatTime`.
- Visibility: convert using Meteoblue `units.visibility` (km → m).
- Gust carry: max 3 h lookback; set `windGustOrigin` and `windGustSourceTime`.

## Flight intelligence

All scoring lives in `evaluateFlight`. Document new rules in `docs/weather.md`. Do not add unconditional “safe to fly” copy.

## Testing

`npm test` runs `app/lib/weather/__tests__`. Update tests when changing thresholds or provider mapping.

## Environment variables

- `METEOBLUE_API_KEY` — server only, never `NEXT_PUBLIC_*`.

## Extension rules

- Never remove Open-Meteo without an explicit product decision.
- Never expose provider JSON to components.
- Never bypass normalization.
- Never add a weather-derived safety conclusion without documenting inputs and limits.
- Update `docs/weather.md`, this file, and tests when changing the domain model.

## Common failure modes

- Missing API key → Open-Meteo only (expected locally).
- Meteoblue schema drift → Zod failure → fallback; fix field names in `meteoblue.ts`.
- 3 h gust gaps → marginal scores if gust unavailable caution triggers; use carry logic.
