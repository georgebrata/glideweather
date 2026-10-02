import { test as teardown } from "@playwright/test";
import { clerkClient, clearTrackedUsersFile, deleteTrackedUsers, readTrackedUsers } from "./users";

teardown("delete users created by auth tests", async () => {
  const users = readTrackedUsers();
  if (users.length === 0) return;

  await deleteTrackedUsers(clerkClient(), users);
  clearTrackedUsersFile();
});
