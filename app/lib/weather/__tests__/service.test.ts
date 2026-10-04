import assert from "node:assert/strict";
import test, { afterEach, beforeEach, mock } from "node:test";
import { clearMeteoblueCacheForTests, getCurrentSnapshot } from "../service";

const location = {
  id: "test",
  name: "Test",
  latitude: 45.6,
  longitude: 25.6,
  source: "search" as const,
};

const openMeteoCurrent = {
  timezone: "Europe/Bucharest",
  elevation: 500,
  current: {
    time: "2026-10-03T12:00",
    temperature_2m: 20,
    relative_humidity_2m: 50,
    apparent_temperature: 19,
    is_day: 1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 0,
    cloud_cover: 10,
    surface_pressure: 1010,
    visibility: 20_000,
    wind_speed_10m: 10,
    wind_direction_10m: 90,
    wind_gusts_10m: 15,
    cape: 100,
  },
};

beforeEach(() => {
  clearMeteoblueCacheForTests();
  process.env.METEOBLUE_API_KEY = "test-key";
});

afterEach(() => {
  mock.restoreAll();
  delete process.env.METEOBLUE_API_KEY;
});

test("missing API key falls back to Open-Meteo without calling Meteoblue", async () => {
  delete process.env.METEOBLUE_API_KEY;
  const fetchMock = mock.fn(async (url: string | URL) => {
    const href = String(url);
    assert.equal(href.includes("my.meteoblue.com"), false);
    if (href.includes("api.open-meteo.com/v1/forecast")) {
      return new Response(JSON.stringify(openMeteoCurrent), { status: 200 });
    }
    if (href.includes("air-quality")) {
      return new Response(
        JSON.stringify({
          current: {
            european_aqi: 10,
            us_aqi: 20,
            pm10: 5,
            pm2_5: 3,
            uv_index: 4,
          },
        }),
        { status: 200 },
      );
    }
    return new Response("{}", { status: 404 });
  });
  mock.method(globalThis, "fetch", fetchMock);

  const snapshot = await getCurrentSnapshot(location, "en-GB");
  assert.equal(snapshot.provider.fallback, true);
  assert.equal(snapshot.provider.fallbackReason, "configuration");
  assert.equal(snapshot.sample.weatherCode, 0);
});

test("Meteoblue HTTP failure falls back with reason", async () => {
  const fetchMock = mock.fn(async (url: string | URL) => {
    const href = String(url);
    if (href.includes("my.meteoblue.com")) {
      return new Response("error", { status: 500 });
    }
    if (href.includes("api.open-meteo.com/v1/forecast")) {
      return new Response(JSON.stringify(openMeteoCurrent), { status: 200 });
    }
    if (href.includes("air-quality")) {
      return new Response(
        JSON.stringify({
          current: {
            european_aqi: null,
            us_aqi: null,
            pm10: null,
            pm2_5: null,
            uv_index: null,
          },
        }),
        { status: 200 },
      );
    }
    return new Response("{}", { status: 404 });
  });
  mock.method(globalThis, "fetch", fetchMock);

  const snapshot = await getCurrentSnapshot(location, "en-GB");
  assert.equal(snapshot.provider.id, "open-meteo");
  assert.equal(snapshot.provider.fallback, true);
  assert.equal(snapshot.provider.fallbackReason, "http");
});
