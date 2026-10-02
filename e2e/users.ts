import { createClerkClient, type ClerkClient } from "@clerk/backend";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createdUsersFile, e2ePassword } from "./constants";

export type TrackedUser = {
  userId: string;
  email: string;
};

function usersFilePath() {
  return path.join(process.cwd(), createdUsersFile);
}

export function clerkClient(): ClerkClient {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is required for end-to-end tests.");
  }
  return createClerkClient({ secretKey });
}

export function trackCreatedUser(user: TrackedUser) {
  const filePath = usersFilePath();
  mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = readTrackedUsers();
  existing.push(user);
  writeFileSync(filePath, JSON.stringify(existing));
}

export function readTrackedUsers(): TrackedUser[] {
  const filePath = usersFilePath();
  if (!existsSync(filePath)) return [];
  const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (entry): entry is TrackedUser =>
      typeof entry === "object" &&
      entry !== null &&
      "userId" in entry &&
      "email" in entry &&
      typeof entry.userId === "string" &&
      typeof entry.email === "string",
  );
}

export function clearTrackedUsersFile() {
  const filePath = usersFilePath();
  if (existsSync(filePath)) unlinkSync(filePath);
}

export async function deleteTrackedUsers(client: ClerkClient, users: TrackedUser[]) {
  for (const user of users) {
    try {
      if (user.userId) {
        await client.users.deleteUser(user.userId);
        continue;
      }
    } catch {
      // Fall through and delete by email when the id is missing or already gone.
    }

    if (!user.email) continue;
    const { data: found } = await client.users.getUserList({ emailAddress: [user.email] });
    for (const match of found) {
      await client.users.deleteUser(match.id);
    }
  }
}

export async function ensurePasswordUser(client: ClerkClient, email: string, phoneNumber: string) {
  const { data: users } = await client.users.getUserList({ emailAddress: [email] });
  if (users.length > 0) {
    await client.users.updateUser(users[0].id, {
      password: e2ePassword,
      skipPasswordChecks: true,
    });
    return users[0];
  }

  return client.users.createUser({
    emailAddress: [email],
    phoneNumber: [phoneNumber],
    password: e2ePassword,
    firstName: "Glide",
    lastName: "Tester",
    skipPasswordChecks: true,
  });
}
