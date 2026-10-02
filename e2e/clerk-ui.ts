import { setupClerkTestingToken } from "@clerk/testing/playwright";
import type { Page } from "@playwright/test";
import { e2ePassword } from "./constants";

const testCode = "424242";

export async function openWithTestingToken(page: Page, path: string) {
  await setupClerkTestingToken({ page });
  await page.goto(path);
}

export async function fillOptionalAuthFields(page: Page, email: string, phoneNumber?: string) {
  const firstName = page.locator("input[name=firstName]");
  if (await firstName.isVisible()) await firstName.fill("Glide");

  const lastName = page.locator("input[name=lastName]");
  if (await lastName.isVisible()) await lastName.fill("Tester");

  const username = page.locator("input[name=username]");
  if (await username.isVisible()) {
    await username.fill(`glide${Date.now().toString().slice(-8)}`);
  }

  const legal = page.locator("input[name=legalAccepted]");
  if (await legal.isVisible()) await legal.check();

  const identifier = page.locator("input[name=identifier]");
  const emailAddress = page.locator("input[name=emailAddress]");
  if (await identifier.isVisible()) {
    await identifier.fill(email);
  } else if (await emailAddress.isVisible()) {
    await emailAddress.fill(email);
  }

  const phone = page.locator("input[name=phoneNumber], input[type=tel]").first();
  if (phoneNumber && (await phone.isVisible())) await phone.fill(phoneNumber);

  const password = page.locator("input[name=password]");
  if (await password.isVisible()) await password.fill(e2ePassword);
}

export async function continueAuth(page: Page) {
  const password = page.locator("input[name=password]");
  const passwordVisibleBefore = await password.isVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  if (!passwordVisibleBefore && (await password.isVisible({ timeout: 8_000 }).catch(() => false))) {
    await password.fill(e2ePassword);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
}

export async function enterTestCodeIfAsked(page: Page) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const code = page.getByRole("textbox", { name: /verification code/i });
    const asked = await code
      .waitFor({ state: "visible", timeout: attempt === 0 ? 8_000 : 4_000 })
      .then(() => true)
      .catch(() => false);
    if (!asked) return;
    await code.fill("");
    await code.pressSequentially(testCode);
    await code.waitFor({ state: "hidden", timeout: 8_000 }).catch(() => undefined);
  }
}

export async function readSignedInUserId(page: Page) {
  return page.evaluate(() => {
    const clerkWindow = window as Window & { Clerk?: { user?: { id?: string } | null } };
    return clerkWindow.Clerk?.user?.id ?? "";
  });
}
