import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DESTINATIONS,
  footerDestinationsForContentLocale,
  ROMANIA_FOOTER_DESTINATION_IDS,
  WORLDWIDE_FOOTER_DESTINATION_IDS,
} from "../../content/destinations";
import { getGuideCopy } from "../../content/guides";
import {
  INDEXABLE_STATIC_ROUTES,
  pathForRoute,
  resolveRouteFromPath,
  STATIC_ROUTES,
} from "../routes";
import { buildPageMetadata } from "../metadata";
import { hreflangCode } from "../locale";

describe("SEO route registry", () => {
  it("indexable routes have distinct en and ro paths", () => {
    for (const route of INDEXABLE_STATIC_ROUTES) {
      assert.notEqual(route.paths.en, route.paths.ro);
      assert.match(route.paths.ro, /^\/ro/);
    }
  });

  it("resolveRouteFromPath maps guide URLs", () => {
    assert.deepEqual(resolveRouteFromPath("/about"), { key: "about", locale: "en" });
    assert.deepEqual(resolveRouteFromPath("/ro/despre"), { key: "about", locale: "ro" });
    assert.deepEqual(resolveRouteFromPath("/destinations/annecy"), {
      key: "destination",
      locale: "en",
    });
  });

  it("metadata canonical points to self", () => {
    for (const route of INDEXABLE_STATIC_ROUTES) {
      for (const locale of ["en", "ro"] as const) {
        const meta = buildPageMetadata(route.key, locale);
        const canonical = meta.alternates?.canonical;
        assert.equal(canonical, route.paths[locale]);
        const languages = meta.alternates?.languages as Record<string, string>;
        assert.equal(languages[hreflangCode("en")], route.paths.en);
        assert.equal(languages[hreflangCode("ro")], route.paths.ro);
        assert.equal(languages["x-default"], route.paths.en);
      }
    }
  });

  it("every destination slug is unique", () => {
    const slugs = new Set(DESTINATIONS.map((d) => d.slug));
    assert.equal(slugs.size, DESTINATIONS.length);
  });
});

describe("destination footer sets", () => {
  it("worldwide set spans multiple regions", () => {
    const items = footerDestinationsForContentLocale("en");
    const regions = new Set(items.map((d) => d.region));
    assert.ok(regions.has("europe"));
    assert.ok(regions.has("asia"));
    assert.ok(regions.has("africa"));
    assert.ok(regions.has("oceania"));
    assert.ok(regions.has("northAmerica"));
    assert.ok(regions.has("southAmerica"));
    assert.equal(items.length, WORLDWIDE_FOOTER_DESTINATION_IDS.length);
  });

  it("romanian locale uses Romania-focused footer", () => {
    const items = footerDestinationsForContentLocale("ro");
    assert.equal(items.length, ROMANIA_FOOTER_DESTINATION_IDS.length);
    assert.ok(items.every((d) => d.region === "romania"));
  });
});

describe("FAQ structured copy", () => {
  it("faq questions match between visible copy and locales", () => {
    const en = getGuideCopy("en").faqItems;
    const ro = getGuideCopy("ro").faqItems;
    assert.equal(en.length, ro.length);
    assert.ok(en.length >= 5);
  });
});

describe("sitemap source routes", () => {
  it("includes home and guides", () => {
    const keys = new Set(STATIC_ROUTES.map((r) => r.key));
    assert.ok(keys.has("faq"));
    assert.ok(keys.has("destinationsHub"));
    assert.equal(pathForRoute("home", "en"), "/");
    assert.equal(pathForRoute("home", "ro"), "/ro");
  });
});
