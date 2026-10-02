import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

test("a signed-in user can save and reload profile preferences", async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto("/profile");

  await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();
  await expect(page.getByLabel("Flying device")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Delete account" })).toBeDisabled();

  await page.getByRole("combobox", { name: "Default theme" }).click();
  await page.getByRole("option", { name: "Dark", exact: true }).click();
  await page.keyboard.press("Escape");

  const locationInput = page.getByPlaceholder("Search a launch site or location...");
  await locationInput.fill("London");
  const option = page.getByRole("option").first();
  await option.waitFor();
  await option.click();

  const selectedLocation = page.getByTestId("profile-selected-location");
  await expect(selectedLocation).toContainText(/London/i);
  const savedLocation = (await selectedLocation.textContent()) ?? "";

  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByText("Preferences saved")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();
  await expect(page.getByTestId("profile-selected-location")).toHaveText(savedLocation);
  await expect(page.getByRole("combobox", { name: "Default theme" })).toContainText("Dark");
  await expect(page.getByLabel("Flying device")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Delete account" })).toBeDisabled();
});
