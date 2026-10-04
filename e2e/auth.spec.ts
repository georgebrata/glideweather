import { expect, test, type Page } from "@playwright/test";
import { ephemeralTestPhone } from "./constants";
import { continueAuth, enterTestCodeIfAsked, fillOptionalAuthFields, openWithTestingToken, readSignedInUserId } from "./clerk-ui";
import { clerkClient, ensurePasswordUser, trackCreatedUser } from "./users";

test.describe.configure({ mode: "serial" });

async function expectSignedOut(page: Page) {
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
  await expect(page.locator(".cl-userButtonTrigger")).toHaveCount(0);
}

async function expectSignedIn(page: Page) {
  await expect(page.locator(".cl-userButtonTrigger")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sign up" })).toHaveCount(0);
}

async function signOut(page: Page) {
  await page.locator(".cl-userButtonTrigger").click();
  const accountPanel = page.getByRole("dialog", { name: "Account panel" });
  await accountPanel.getByRole("button", { name: "Sign out" }).click();
  await expectSignedOut(page);
  await page.waitForLoadState("load");
}

async function openPath(page: Page, path: string) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(path);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (attempt === 1 || !message.includes("ERR_ABORTED")) {
        throw error;
      }
    }
  }
}

test("signed-out visitors see sign-in and sign-up", async ({ page }) => {
  await openWithTestingToken(page, "/");
  await expectSignedOut(page);
});

test("signed-out auth routes lead to Clerk", async ({ page }) => {
  await openWithTestingToken(page, "/profile");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.locator(".cl-signIn-root")).toBeVisible();

  await openWithTestingToken(page, "/sign-in");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.locator(".cl-signIn-root")).toBeVisible();

  await openWithTestingToken(page, "/sign-up");
  await expect(page).toHaveURL(/\/sign-up/);
  await expect(page.locator(".cl-signUp-root")).toBeVisible();
});

test("an unknown account cannot sign in", async ({ page }) => {
  const email = `glide-missing-${Date.now()}+clerk_test@example.com`;

  await openWithTestingToken(page, "/");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.locator(".cl-signIn-root").waitFor();
  await fillOptionalAuthFields(page, email);
  await continueAuth(page);

  await expect(page.locator(".cl-signIn-root")).toBeVisible();
  await expect(page.locator(".cl-userButtonTrigger")).toHaveCount(0);
});

test("a new user can sign up, open profile, and sign out", async ({ page }) => {
  const email = `glide-signup-${Date.now()}+clerk_test@example.com`;
  const phoneNumber = ephemeralTestPhone();
  trackCreatedUser({ userId: "", email });

  await openWithTestingToken(page, "/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.locator(".cl-signUp-root").waitFor();
  await fillOptionalAuthFields(page, email, phoneNumber);
  await continueAuth(page);
  await enterTestCodeIfAsked(page);

  await expectSignedIn(page);
  const userId = await readSignedInUserId(page);
  if (userId) trackCreatedUser({ userId, email });

  await page.reload();
  await expectSignedIn(page);

  await page.locator(".cl-userButtonTrigger").click();
  await page.getByRole("dialog", { name: "Account panel" }).getByRole("button", { name: "Profile" }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();

  await page.goto("/");
  await signOut(page);

  await openPath(page, "/profile");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.locator(".cl-signIn-root")).toBeVisible();
});

test("an existing user can sign in from the header", async ({ page }) => {
  const email = `glide-signin-${Date.now()}+clerk_test@example.com`;
  const user = await ensurePasswordUser(clerkClient(), email, ephemeralTestPhone());
  trackCreatedUser({ userId: user.id, email });

  await openWithTestingToken(page, "/");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.locator(".cl-signIn-root").waitFor();
  await fillOptionalAuthFields(page, email);
  await continueAuth(page);
  await enterTestCodeIfAsked(page);

  await expectSignedIn(page);
  await page.reload();
  await expectSignedIn(page);
});

test("auth stays off when the auth flag is disabled", async ({ page }) => {
  await page.context().addCookies([
    { name: "e2e-auth", value: "0", domain: "localhost", path: "/" },
  ]);
  await openWithTestingToken(page, "/");

  await expect(page.getByRole("button", { name: "Sign in" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sign up" })).toHaveCount(0);
  await expect(page.locator(".cl-userButtonTrigger")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Paragliding flight window" })).toBeVisible();

  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/sign-up");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/$/);
});
