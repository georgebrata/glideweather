"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  locationChoiceToStored,
  parseUserPreferences,
  resolveThemeMode,
  type ThemePreference,
  updateUserPreferences,
} from "../../lib/userPreferences";
import { searchLocations, type LocationChoice } from "../../lib/weather";
import { formatLocationLabel, LocationSearchCombobox } from "../dashboard/LocationSearchCombobox";
import { useLocaleText } from "../dashboard/LocaleContext";
import { writeThemeMode } from "../dashboard/themeStore";

type ProfileUser = NonNullable<ReturnType<typeof useUser>["user"]>;

const UserProfileForm = ({ user }: { user: ProfileUser }) => {
  const { locale, t } = useLocaleText();
  const preferences = parseUserPreferences(user.unsafeMetadata);
  const [themePreference, setThemePreference] = useState<ThemePreference>(preferences?.theme ?? "system");
  const [defaultLocation, setDefaultLocation] = useState<LocationChoice | null>(
    preferences?.defaultLocation
      ? {
          ...preferences.defaultLocation,
          source: "search",
        }
      : null,
  );
  const [searchText, setSearchText] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const searchQuery = useQuery({
    queryKey: ["profile-location-search", searchText, locale],
    queryFn: () => searchLocations(searchText, locale),
    enabled: searchText.trim().length >= 3,
    staleTime: 1000 * 60 * 20,
  });

  const themeOptions = useMemo(
    () =>
      [
        { value: "light" as const, label: t.profile.themeLight },
        { value: "dark" as const, label: t.profile.themeDark },
        { value: "system" as const, label: t.profile.themeSystem },
      ] satisfies { value: ThemePreference; label: string }[],
    [t.profile.themeDark, t.profile.themeLight, t.profile.themeSystem],
  );

  const handleSave = useCallback(async () => {
    setSaveState("saving");
    try {
      await updateUserPreferences(user, {
        theme: themePreference,
        defaultLocation: defaultLocation ? locationChoiceToStored(defaultLocation) : null,
      });
      await user.reload();
      writeThemeMode(resolveThemeMode(themePreference));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [defaultLocation, themePreference, user]);

  return (
    <div className="instrument-console flex flex-col gap-5 rounded-3xl p-4 md:p-5">
      <div className="flex flex-col gap-2">
        <Label className="eyebrow normal-case">{t.profile.defaultLocation}</Label>
        <LocationSearchCombobox
          options={searchQuery.data ?? []}
          inputValue={searchText}
          onInputValueChange={setSearchText}
          onSelect={(next) => {
            setDefaultLocation(next);
            setSearchText("");
          }}
          placeholder={t.flightWindow.searchPlaceholder}
          loading={searchQuery.isFetching}
          loadingText={t.header.searchLoading}
          emptyText={t.header.searchEmpty}
          ariaLabel={t.profile.defaultLocation}
        />
        {defaultLocation ? (
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm" data-testid="profile-selected-location">
              {formatLocationLabel(defaultLocation)}
            </p>
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => setDefaultLocation(null)}>
              {t.profile.clearLocation}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-theme">{t.profile.defaultTheme}</Label>
        <Select value={themePreference} onValueChange={(value) => setThemePreference(value as ThemePreference)}>
          <SelectTrigger id="profile-theme" aria-label={t.profile.defaultTheme} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="flying-device">{t.profile.flyingDevice}</Label>
        <Input id="flying-device" aria-label={t.profile.flyingDevice} disabled value={t.profile.comingSoon} />
        <p className="text-xs text-muted-foreground">{t.profile.comingSoon}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="button" onClick={() => void handleSave()} disabled={saveState === "saving"}>
          {saveState === "saving" ? t.profile.saving : t.profile.save}
        </Button>
        <Button type="button" variant="outline" disabled>
          {t.profile.deleteAccount}
        </Button>
      </div>

      {saveState === "saved" ? (
        <Alert className="border-primary/30 bg-primary/10">
          <AlertDescription>{t.profile.saved}</AlertDescription>
        </Alert>
      ) : null}
      {saveState === "error" ? (
        <Alert variant="destructive">
          <AlertDescription>{t.profile.saveError}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export const UserProfilePage = () => {
  const { t } = useLocaleText();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="nocturne-canvas grid min-h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="nocturne-canvas min-h-screen text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <Button variant="ghost" className="w-fit gap-2 px-0" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            {t.profile.backToApp}
          </Link>
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{t.profile.title}</h1>
          <p className="text-muted-foreground">{t.profile.subtitle}</p>
        </div>

        <UserProfileForm key={user.id} user={user} />
      </div>
    </main>
  );
};
