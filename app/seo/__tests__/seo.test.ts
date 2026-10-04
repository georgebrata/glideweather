import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DESTINATIONS, footerDestinationsForContentLocale } from "../../content/destinations";
import { CONTENT_LOCALES, contentLocaleDefinition } from "../../../content-locales";
import { getGuideCopy } from "../../content/guides";
import {
  INDEXABLE_STATIC_ROUTES,
  pathForRoute,
  resolveRouteFromPath,
  STATIC_ROUTES,
} from "../routes";
import { buildPageMetadata } from "../metadata";
import { hreflangCode } from "../locale";
import { homeJsonLd, jsonLdDocument } from "../jsonld";

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
    assert.deepEqual(resolveRouteFromPath("/feedback"), { key: "feedback", locale: "en" });
    assert.deepEqual(resolveRouteFromPath("/ro/pareri"), { key: "feedback", locale: "ro" });
    assert.deepEqual(resolveRouteFromPath("/de/ueber-uns"), { key: "about", locale: "de" });
    assert.deepEqual(resolveRouteFromPath("/at/fluggebiete/emberger-alm"), {
      key: "destination",
      locale: "at",
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
  it("every content locale footer lists six sites", () => {
    for (const entry of CONTENT_LOCALES) {
      const items = footerDestinationsForContentLocale(entry.id);
      assert.equal(items.length, 6, entry.id);
      assert.equal(items.length, contentLocaleDefinition(entry.id).footerDestinationIds.length);
    }
    assert.ok(footerDestinationsForContentLocale("en").some((item) => item.id === "long-mynd"));
    assert.ok(footerDestinationsForContentLocale("ro").every((item) => item.region === "romania"));
    assert.ok(footerDestinationsForContentLocale("de").every((item) => item.countryCode === "DE"));
    assert.ok(footerDestinationsForContentLocale("ie").every((item) => item.countryCode === "IE"));
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
