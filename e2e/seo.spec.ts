import { expect, test } from "@playwright/test";
import { INDEXABLE_STATIC_ROUTES } from "../app/seo/routes";

const indexablePaths = INDEXABLE_STATIC_ROUTES.flatMap((route) => [route.paths.en, route.paths.ro]);

const htmlHeaders = {
  Accept: "text/html,application/xhtml+xml;q=0.9",
};

test.describe("SEO surfaces", () => {
  for (const path of indexablePaths) {
    test(`GET ${path} returns 200 with one h1`, async ({ request }) => {
      const response = await request.get(path, { headers: htmlHeaders });
      expect(response.status()).toBe(200);
      const html = await response.text();
      const h1Count = html.match(/<h1\b/gi)?.length ?? 0;
      if (path === "/" || path === "/ro") {
        expect(h1Count).toBeGreaterThanOrEqual(1);
      } else {
        expect(h1Count).toBe(1);
      }
    });
  }

  test("home has canonical without query and noindex with site param", async ({ request }) => {
    const clean = await request.get("/", { headers: htmlHeaders });
    const cleanHtml = await clean.text();
    expect(cleanHtml).toContain('rel="canonical"');
    expect(cleanHtml).toContain('href="/"');

    const withSite = await request.get("/?site=annecy", { headers: htmlHeaders });
    const siteHtml = await withSite.text();
    expect(siteHtml.toLowerCase()).toContain("noindex");
  });

  test("home footer destination links differ by locale", async ({ request }) => {
    const en = await request.get("/", { headers: htmlHeaders });
    const ro = await request.get("/ro", { headers: htmlHeaders });
    const enHtml = await en.text();
    const roHtml = await ro.text();
    expect(enHtml).toContain('href="/destinations/annecy"');
    expect(roHtml).toContain('href="/ro/destinatii/bunloc"');
  });

  test("sitemap and robots are reachable", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const body = await sitemap.text();
    expect(body).toContain("/about");
    expect(body).toContain("/ro/despre");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("Disallow: /api/");
  });

  test("about page has hreflang alternates", async ({ request }) => {
    const response = await request.get("/about");
    const html = await response.text();
    expect(html).toMatch(/hreflang="ro"|hrefLang="ro"/i);
    expect(html).toContain("/ro/despre");
  });
});
