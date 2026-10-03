# Weather subsystem

## Architecture

```text
Browser (React Query)
  → fetchCurrentSnapshot / fetchDayForecast (app/lib/weather.ts)
  → GET /api/weather
  → WeatherService (app/lib/weather/service.ts)
        ├── MeteoblueProvider (primary)
        └── OpenMeteoProvider (automatic fallback)
  → Normalized CurrentSnapshot / DayForecast
  → evaluateFlight (domain)
  → UI
```

Geocoding and the map wind grid remain on Open-Meteo (`searchLocations`, `fetchWindGrid`).

## Why Meteoblue primary

Meteoblue provides location-based mLM forecasts with package-level variables useful for paragliding (layer clouds, CAPE, lifted index, 80 m wind, predictability). Open-Meteo remains the resilience layer when Meteoblue is misconfigured, rate-limited, or unavailable.

## Fallback

One Meteoblue attempt (8 s timeout). On failure, Open-Meteo serves the same normalized types with `provider.fallback: true` and `provider.fallbackReason`. Structured logs: `event=weather.request` with provider, fallback, duration, rounded coordinates (no API keys).

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `METEOBLUE_API_KEY` | Server only | Meteoblue Forecast API key. Empty → skip Meteoblue, use Open-Meteo. |

## Meteoblue packages (Free Weather API tier)

Combined request: `basic-1h,wind-3h,clouds-3h,air-3h`.

| Package | Resolution | Used fields |
| --- | --- | --- |
| basic-1h | 1 h | temperature, felt temp, humidity, precip, precip probability, pictocode, 10 m wind, sea-level pressure, UV |
| wind-3h | 3 h | gust, surface pressure, 80 m wind |
| clouds-3h | 3 h | layer/total cloud, visibility |
| air-3h | 3 h | CAPE, lifted index, boundary layer height, CIN |

Air quality (US AQI, PM) is still fetched from Open-Meteo Air Quality alongside Meteoblue forecast data.

## Semantic differences

- Meteoblue 1 h wind is a **mean** over the preceding hour; Open-Meteo exposes model values at the timestamp.
- Gusts/clouds/CAPE from Meteoblue free tier are **3-hourly**; gusts may be carried forward up to 3 h (`windGustOrigin: latest-within-3h`) without the “gust unavailable” caution.
- `weatherCode` (WMO) is only set by Open-Meteo. Meteoblue uses `pictocode` for labels only.
- Sunrise/sunset for Meteoblue days are **calculated** astronomically when not in the selected packages.
- Do not sum `precipitation` and `convective_precipitation`.

## Flight intelligence (new Meteoblue-aware rules)

| Rule | Input | Threshold | Effect |
| --- | --- | --- | --- |
| Snow-heavy precip | `snowFraction`, `precipitation` | fraction ≥ 0.5 and precip ≥ 0.2 mm | no-go (heavy precip reason) |
| Low cloud | `cloudCoverLow` | > 80 % | caution |
| Lifted index | `liftedIndex` | ≤ −2 | caution (unstable air) |
| Wind aloft | `windSpeed80mKmh` − `windSpeed` | ≥ 15 km/h | caution |
| Predictability | daily `predictabilityPercent` | < 30 % | day summary note only |

All legacy thresholds (wind, gust, spread, visibility, CAPE, WMO codes, AQI, UV) are unchanged.

## Caching

Server memory cache for Meteoblue bundles: 20 min TTL, key = lat/lon rounded to 3 decimals. React Query client cache unchanged.

## Free-plan limits

- One-year trial with credit pool (see [meteoblue Free Weather API](https://docs.meteoblue.com/en/weather-apis/free-weather-api/overview)).
- 500 calls/min default rate limit.
- 7-day forecast horizon; this app requests 4 days.

## Attribution

The dashboard footer shows the provider that served the request (`meteoblue` or `Open-Meteo`, with “fallback” when applicable).
