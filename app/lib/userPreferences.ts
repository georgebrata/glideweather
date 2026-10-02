import { z } from "zod";
import type { ThemeMode } from "../theme/flightTokens";
import type { LocationChoice } from "./weather";

export type ClerkUserWriter = {
  unsafeMetadata: Record<string, unknown>;
  update: (params: { unsafeMetadata: Record<string, unknown> }) => Promise<unknown>;
};

const StoredLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  detail: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().optional(),
});

export const ThemePreferenceSchema = z.enum(["light", "dark", "system"]);
export type ThemePreference = z.infer<typeof ThemePreferenceSchema>;

export const UserPreferencesSchema = z.object({
  defaultLocation: StoredLocationSchema.nullable().optional(),
  theme: ThemePreferenceSchema.optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function resolveThemeMode(preference: ThemePreference): ThemeMode {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function parseUserPreferences(metadata: unknown): UserPreferences | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const preferences = (metadata as { preferences?: unknown }).preferences;
  const parsed = UserPreferencesSchema.safeParse(preferences);
  return parsed.success ? parsed.data : null;
}

export function storedLocationToChoice(
  location: NonNullable<UserPreferences["defaultLocation"]>,
): LocationChoice {
  return {
    id: location.id,
    name: location.name,
    detail: location.detail,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    source: "search",
  };
}

export function locationChoiceToStored(location: LocationChoice) {
  return {
    id: location.id,
    name: location.name,
    detail: location.detail,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  };
}

export function mergeUserPreferences(
  metadata: unknown,
  patch: Partial<UserPreferences>,
): UserPreferences {
  const current = parseUserPreferences(metadata) ?? {};
  return UserPreferencesSchema.parse({ ...current, ...patch });
}

export async function updateUserPreferences(
  user: ClerkUserWriter,
  patch: Partial<UserPreferences>,
): Promise<void> {
  const preferences = mergeUserPreferences(user.unsafeMetadata, patch);
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      preferences,
    },
  });
}
