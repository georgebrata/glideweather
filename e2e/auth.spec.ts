import { expect, test } from "@playwright/test";
import { ephemeralTestPhone } from "./constants";
import { continueAuth, enterTestCodeIfAsked, fillOptionalAuthFields, openWithTestingToken, readSignedInUserId } from "./clerk-ui";
import { clerkClient, ensurePasswordUser, trackCreatedUser } from "./users";

test.describe.configure({ mode: "serial" });

test("signed-out visitors see sign-in and sign-up", async ({ page }) => {
  await openWithTestingToken(page, "/");

  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
  await expect(page.locator(".cl-userButtonTrigger")).toHaveCount(0);
});

test("profile redirects signed-out visitors to sign-in", async ({ page }) => {
  await openWithTestingToken(page, "/profile");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Sign in to GlideWeather" })).toBeVisible();
});

test("a new user can sign up from the header", async ({ page }) => {
  const email = `glide-signup-${Date.now()}+clerk_test@example.com`;
  const phoneNumber = ephemeralTestPhone();
  trackCreatedUser({ userId: "", email });

  await openWithTestingToken(page, "/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.locator(".cl-signUp-root").waitFor();
  await fillOptionalAuthFields(page, email, phoneNumber);
  await continueAuth(page);
  await enterTestCodeIfAsked(page);

  await expect(page.locator(".cl-userButtonTrigger")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toHaveCount(0);

  const userId = await readSignedInUserId(page);
  if (userId) trackCreatedUser({ userId, email });
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

  await expect(page.locator(".cl-userButtonTrigger")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign up" })).toHaveCount(0);
});
