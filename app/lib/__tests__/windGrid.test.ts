import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { windPointsFromResponse } from "../windGrid";

describe("wind grid response", () => {
  it("reads the array Open-Meteo returns for multiple coordinates", () => {
    const points = windPointsFromResponse([
      {
        latitude: 45.875,
        longitude: 25.125,
        current: { wind_speed_10m: 0.5, wind_direction_10m: 45 },
      },
      {
        latitude: 45.9375,
        longitude: 25.125,
        current: { wind_speed_10m: null, wind_direction_10m: 117 },
      },
    ]);

    assert.deepEqual(points, [
      { latitude: 45.875, longitude: 25.125, speed: 0.5, direction: 45 },
      { latitude: 45.9375, longitude: 25.125, speed: null, direction: 117 },
    ]);
  });

  it("returns no points instead of throwing on an unexpected payload", () => {
    assert.deepEqual(windPointsFromResponse({ latitude: [1], longitude: [2] }), []);
  });
});
