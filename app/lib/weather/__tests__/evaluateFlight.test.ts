import assert from "node:assert/strict";
import test from "node:test";
import { evaluateFlight, type WeatherSample } from "../domain";

const base = (): WeatherSample => ({
  time: "2026-10-03T12:00",
  temperature: 20,
  apparentTemperature: 19,
  humidity: 50,
  pressure: 1013,
  precipitation: 0,
  precipitationProbability: 0,
  weatherCode: 1,
  weatherLabel: "Clear",
  cloudCover: 20,
  visibility: 20_000,
  windSpeed: 12,
  windDirection: 180,
  windGusts: 18,
  cape: 200,
  uvIndex: 4,
  europeanAqi: 20,
  usAqi: 40,
  pm10: 10,
  pm25: 5,
  isDay: true,
  windGustOrigin: "exact",
});

test("evaluateFlight wind thresholds", () => {
  assert.equal(evaluateFlight({ ...base(), windSpeed: 3 }, "en-GB").status, "no-go");
  assert.equal(evaluateFlight({ ...base(), windSpeed: 7 }, "en-GB").status, "marginal");
  assert.equal(evaluateFlight({ ...base(), windSpeed: 24 }, "en-GB").status, "marginal");
  assert.equal(evaluateFlight({ ...base(), windSpeed: 30 }, "en-GB").status, "no-go");
});

test("evaluateFlight gust and spread thresholds", () => {
  assert.equal(evaluateFlight({ ...base(), windGusts: 36 }, "en-GB").status, "no-go");
  assert.equal(
    evaluateFlight({ ...base(), windSpeed: 16, windGusts: 30 }, "en-GB").status,
    "marginal",
  );
  assert.equal(
    evaluateFlight({ ...base(), windSpeed: 12, windGusts: 24 }, "en-GB").status,
    "marginal",
  );
  assert.equal(
    evaluateFlight({ ...base(), windSpeed: 10, windGusts: 27 }, "en-GB").status,
    "no-go",
  );
});

test("evaluateFlight skips gust unavailable when origin is latest-within-3h with null gust", () => {
  const sample = {
    ...base(),
    windGusts: null,
    windGustOrigin: "latest-within-3h" as const,
  };
  const verdict = evaluateFlight(sample, "en-GB");
  assert.equal(
    verdict.cautions.some((reason) => reason.includes("Gust data")),
    false,
  );
});

test("evaluateFlight meteoblue-oriented cautions", () => {
  assert.equal(
    evaluateFlight({ ...base(), cloudCoverLow: 85 }, "en-GB").status,
    "marginal",
  );
  assert.equal(
    evaluateFlight({ ...base(), liftedIndex: -3 }, "en-GB").status,
    "marginal",
  );
  assert.equal(
    evaluateFlight({ ...base(), windSpeed: 12, windSpeed80mKmh: 30 }, "en-GB").status,
    "marginal",
  );
  assert.equal(
    evaluateFlight(
      { ...base(), precipitation: 0.5, snowFraction: 0.6 },
      "en-GB",
    ).status,
    "no-go",
  );
});
