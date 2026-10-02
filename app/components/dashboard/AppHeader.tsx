"use client";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AppLocale } from "../../i18n";
import type { LocationChoice } from "../../lib/weather";
import type { ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";
import { LanguagePicker } from "./LanguagePicker";
import { AuthControls } from "./AuthControls";

export const AppHeader = ({
  locating,
  onRequestLocation,
  onSelectLocation,
  searchData,
  searchFetching,
  searchText,
  setSearchText,
  locale,
  setLocale,
  themeMode,
  toggleThemeMode,
}: {
  locating: boolean;
  onRequestLocation: () => void;
  onSelectLocation: (location: LocationChoice) => void;
  searchData: LocationChoice[];
  searchFetching: boolean;
  searchText: string;
  setSearchText: (value: string) => void;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}) => {
  const { t } = useLocaleText();
  const themeToggleLabel = themeMode === "dark" ? t.theme.enableLight : t.theme.enableDark;

  return (
    <Stack component="header" spacing={2.5}>
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, lg: 3 },
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", lg: "1fr minmax(320px, 420px)" },
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
                boxShadow: "0 0 12px var(--accent)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                letterSpacing: "0.12em",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {t.flightWindow.liveEyebrow}
            </Typography>
          </Stack>
          <Typography component="h1" variant="h1">
            {t.flightWindow.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 520 }}>
            {t.flightWindow.subtitle}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Autocomplete
            fullWidth
            clearText={t.language.clear}
            closeText={t.language.close}
            filterOptions={(options) => options}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : [option.name, option.detail].filter(Boolean).join(", ")
            }
            inputValue={searchText}
            loading={searchFetching}
            loadingText={t.header.searchLoading}
            noOptionsText={t.header.searchEmpty}
            onChange={(_, nextValue) => {
              if (nextValue && typeof nextValue !== "string") onSelectLocation(nextValue);
            }}
            onInputChange={(_, nextValue) => setSearchText(nextValue)}
            openText={t.language.open}
            options={searchData}
            renderInput={(params) => {
              const inputSlot = params.InputProps ?? {};
              return (
              <TextField
                {...params}
                placeholder={t.flightWindow.searchPlaceholder}
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
                      {searchFetching ? <CircularProgress color="inherit" size={18} /> : null}
                      {inputSlot.endAdornment}
                    </>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    bgcolor: "background.paper",
                    border: "1px solid var(--border-flight)",
                    pr: 0.5,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            );
            }}
          />
          <Tooltip title={t.flightWindow.locateMe}>
            <IconButton
              aria-label={t.flightWindow.locateMe}
              onClick={onRequestLocation}
              disabled={locating}
              sx={{
                borderRadius: 999,
                border: "1px solid var(--border-flight)",
                bgcolor: "background.paper",
                width: 44,
                height: 44,
                flexShrink: 0,
              }}
            >
              {locating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <MyLocationIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <LanguagePicker locale={locale} setLocale={setLocale} t={t} />
          <AuthControls />
          <Tooltip title={themeToggleLabel}>
            <IconButton
              aria-label={themeToggleLabel}
              onClick={toggleThemeMode}
              sx={{
                borderRadius: 999,
                border: "1px solid var(--border-flight)",
                bgcolor: "background.paper",
                width: 44,
                height: 44,
                flexShrink: 0,
              }}
            >
              {themeMode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Stack>
  );
};
