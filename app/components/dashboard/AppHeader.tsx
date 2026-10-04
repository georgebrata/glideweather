"use client";

import { Loader2, Moon, Sun, Target } from "lucide-react";
import type { AppLocale } from "../../i18n";
import type { LocationChoice } from "../../lib/weather";
import type { ThemeMode } from "../../theme/flightTokens";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { AuthControls } from "./AuthControls";
import { LanguagePicker } from "./LanguagePicker";
import { LocationSearchCombobox } from "./LocationSearchCombobox";
import { useLocaleText } from "./LocaleContext";
import { useHydrated } from "@/app/hooks/useHydrated";

export const AppHeader = ({
  authEnabled,
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
  authEnabled: boolean;
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
  const hydrated = useHydrated();
  const displayTheme = hydrated ? themeMode : "dark";
  const themeToggleLabel = displayTheme === "dark" ? t.theme.enableLight : t.theme.enableDark;

  return (
    <header className="flex flex-col gap-4">
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_minmax(320px,420px)] lg:gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_12px_var(--accent)] animate-live-dot" />
            <p className="eyebrow">{t.flightWindow.liveEyebrow}</p>
          </div>
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-5xl">
            {t.flightWindow.title}
          </h1>
          <p className="max-w-lg text-base text-muted-foreground">{t.flightWindow.subtitle}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <LocationSearchCombobox
              options={searchData}
              inputValue={searchText}
              onInputValueChange={setSearchText}
              onSelect={onSelectLocation}
              placeholder={t.flightWindow.searchPlaceholder}
              ariaLabel={t.header.searchLabel}
              loading={searchFetching}
              loadingText={t.header.searchLoading}
              emptyText={t.header.searchEmpty}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="instrument"
                  size="icon-round"
                  aria-label={t.flightWindow.locateMe}
                  disabled={locating}
                  onClick={onRequestLocation}
                  className="shrink-0"
                >
                  {locating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Target className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.flightWindow.locateMe}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <LanguagePicker locale={locale} setLocale={setLocale} t={t} />
            {authEnabled ? <AuthControls /> : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="instrument"
                  size="icon-round"
                  aria-label={themeToggleLabel}
                  onClick={toggleThemeMode}
                >
                  {displayTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{themeToggleLabel}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};
