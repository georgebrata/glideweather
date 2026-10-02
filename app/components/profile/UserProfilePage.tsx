"use client";

import { useUser } from "@clerk/nextjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  locationChoiceToStored,
  parseUserPreferences,
  resolveThemeMode,
  type ThemePreference,
  updateUserPreferences,
} from "../../lib/userPreferences";
import { searchLocations, type LocationChoice } from "../../lib/weather";
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
    <Stack spacing={2.5} sx={{ border: "1px solid var(--border-flight)", borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ letterSpacing: "0.08em", color: "text.secondary" }}>
          {t.profile.defaultLocation}
        </Typography>
        <Autocomplete
          fullWidth
          clearText={t.language.clear}
          closeText={t.language.close}
          filterOptions={(options) => options}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : [option.name, option.detail].filter(Boolean).join(", ")
          }
          inputValue={searchText}
          loading={searchQuery.isFetching}
          loadingText={t.header.searchLoading}
          noOptionsText={t.header.searchEmpty}
          onChange={(_, nextValue) => {
            if (nextValue && typeof nextValue !== "string") {
              setDefaultLocation(nextValue);
              setSearchText("");
            }
          }}
          onInputChange={(_, nextValue) => setSearchText(nextValue)}
          openText={t.language.open}
          options={searchQuery.data ?? []}
          value={defaultLocation}
          renderInput={(params) => {
            const inputSlot = params.InputProps ?? {};
            return (
              <TextField
                {...params}
                placeholder={t.flightWindow.searchPlaceholder}
                inputProps={{
                  ...params.inputProps,
                  "aria-label": t.profile.defaultLocation,
                }}
                InputProps={{
                  ...inputSlot,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                      {inputSlot.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {searchQuery.isFetching ? <CircularProgress color="inherit" size={18} /> : null}
                      {inputSlot.endAdornment}
                    </>
                  ),
                }}
              />
            );
          }}
        />
        {defaultLocation ? (
          <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
            <Typography variant="body2" data-testid="profile-selected-location">
              {[defaultLocation.name, defaultLocation.detail].filter(Boolean).join(", ")}
            </Typography>
            <Button variant="text" onClick={() => setDefaultLocation(null)} sx={{ textTransform: "none" }}>
              {t.profile.clearLocation}
            </Button>
          </Stack>
        ) : null}
      </Stack>

      <TextField
        select
        label={t.profile.defaultTheme}
        value={themePreference}
        onChange={(event) => setThemePreference(event.target.value as ThemePreference)}
        fullWidth
      >
        {themeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField label={t.profile.flyingDevice} value={t.profile.comingSoon} disabled fullWidth helperText={t.profile.comingSoon} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
        <Button variant="contained" onClick={() => void handleSave()} disabled={saveState === "saving"}>
          {saveState === "saving" ? t.profile.saving : t.profile.save}
        </Button>
        <Button variant="outlined" disabled>
          {t.profile.deleteAccount}
        </Button>
      </Stack>

      {saveState === "saved" ? <Alert severity="success">{t.profile.saved}</Alert> : null}
      {saveState === "error" ? <Alert severity="error">{t.profile.saveError}</Alert> : null}
    </Stack>
  );
};

export const UserProfilePage = () => {
  const { t } = useLocaleText();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Stack spacing={3} sx={{ mx: "auto", maxWidth: 720, px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start", textTransform: "none" }}>
          {t.profile.backToApp}
        </Button>

        <Stack spacing={1}>
          <Typography component="h1" variant="h1">
            {t.profile.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {t.profile.subtitle}
          </Typography>
        </Stack>

        <UserProfileForm key={user.id} user={user} />
      </Stack>
    </Box>
  );
};
