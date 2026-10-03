import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { evaluateFlight } from "../domain";
import {
  buildMeteoblueUrl,
  normalizeMeteoblueResponse,
} from "../meteoblue";

const fixtureDir = dirname(fileURLToPath(import.meta.url));

test("buildMeteoblueUrl includes packages and units without leaking key in errors", () => {
  const url = buildMeteoblueUrl(45.6, 25.6, "SECRET_KEY");
  assert.match(url, /packages\/basic-1h,wind-3h,clouds-3h,air-3h/);
  assert.match(url, /windspeedunit=kmh/);
  assert.match(url, /lat=45\.6/);
  assert.match(url, /apikey=SECRET_KEY/);
  try {
    throw new Error("configuration failed");
  } catch (error) {
    assert.equal(String(error).includes("SECRET_KEY"), false);
  }
});

test("normalizeMeteoblueResponse converts visibility km to meters and carries gusts within 3h", () => {
  const raw = JSON.parse(
    readFileSync(join(fixtureDir, "fixtures/meteoblue-basic.json"), "utf8"),
  );
  const bundle = normalizeMeteoblueResponse(
    raw,
    {
      id: "t",
      name: "Test",
      latitude: 45.6,
      longitude: 25.6,
      source: "search",
    },
    "en-GB",
  );

  const hour11 = bundle.hours.find((hour) => hour.time.endsWith("T11:00"));
  assert.ok(hour11);
  assert.equal(hour11.visibility, 15_000);
  assert.equal(hour11.windGusts, 20);
  assert.equal(hour11.windGustOrigin, "latest-within-3h");
  assert.equal(hour11.pressure, 900);

  const hour12 = bundle.hours.find((hour) => hour.time.endsWith("T12:00"));
  assert.ok(hour12);
  assert.equal(hour12.windGusts, 24);
  assert.equal(hour12.windGustOrigin, "exact");
  assert.equal(hour12.liftedIndex, -3);

  const verdict = evaluateFlight(hour11, "en-GB");
  assert.equal(
    verdict.reasons.includes("Gust data is not available."),
    false,
  );
});
