import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

const webServerEnv = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);
webServerEnv.E2E_AUTH_TOGGLE = "1";

export default defineConfig({
  testDir: "./e2e",
  testMatch: /seo\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    locale: "en-GB",
    extraHTTPHeaders: {
      Accept: "text/html,application/xhtml+xml;q=0.9",
      // With dev Clerk keys, GET / triggers a handshake redirect loop unless auth is off.
      Cookie: "e2e-auth=0",
    },
  },
  webServer: {
    command: `npx next start --port ${port}`,
    url: `${baseURL}/about`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: webServerEnv,
  },
  projects: [{ name: "seo", use: { ...devices["Desktop Chrome"] } }],
});
