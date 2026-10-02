import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { authStateFile, profileUserEmail, profileUserPhone } from "./constants";
import { openWithTestingToken } from "./clerk-ui";
import { clerkClient, deleteTrackedUsers, ensurePasswordUser, readTrackedUsers, clearTrackedUsersFile } from "./users";

setup.describe.configure({ mode: "serial" });

setup("configure Clerk testing token", async () => {
  const missing = ["CLERK_SECRET_KEY", "CLERK_PUBLISHABLE_KEY"].filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing end-to-end environment variables: ${missing.join(", ")}`);
  }

  await clerkSetup({ dotenv: false });

  const client = clerkClient();
  await deleteTrackedUsers(client, readTrackedUsers());
  clearTrackedUsersFile();
  await ensurePasswordUser(client, profileUserEmail, profileUserPhone);
});

setup("authenticate profile user", async ({ page }) => {
  const statePath = path.join(process.cwd(), authStateFile);
  mkdirSync(path.dirname(statePath), { recursive: true });

  await openWithTestingToken(page, "/");
  await clerk.signIn({
    page,
    emailAddress: profileUserEmail,
  });
  await page.goto("/profile");
  await page.getByRole("heading", { name: "Your profile" }).waitFor();
  await page.context().storageState({ path: statePath });
});
