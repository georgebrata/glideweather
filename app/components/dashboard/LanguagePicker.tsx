"use client";

import { Languages } from "lucide-react";
import { useMemo, useState } from "react";
import {
  LOCALE_OPTIONS,
  DEFAULT_LOCALE,
  getLocaleButtonLabel,
  getLocaleOption,
  getLocaleOptionLabel,
  type AppLocale,
  type LocaleText,
} from "../../i18n";
import { Button } from "@/app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/app/lib/utils";
import { useHydrated } from "@/app/hooks/useHydrated";

export const LanguagePicker = ({
  locale,
  setLocale,
  t,
}: {
  locale: AppLocale;
  setLocale: (value: AppLocale) => void;
  t: LocaleText;
}) => {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const value = useMemo(() => getLocaleOption(locale), [locale]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="instrument"
              size="icon-round"
              aria-label={t.language.label}
              className="w-11 shrink-0 sm:w-auto sm:min-w-[168px] sm:justify-start sm:gap-2 sm:px-3"
            >
              <Languages className="size-4 text-primary" />
              <span className="hidden truncate text-sm font-semibold sm:inline" suppressHydrationWarning>
                {hydrated ? getLocaleButtonLabel(locale) : getLocaleButtonLabel(DEFAULT_LOCALE)}
              </span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{t.language.tooltip}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-72 border-[var(--border-flight)] bg-popover p-0">
        <ScrollArea className="h-72">
          <ul className="p-1">
            {LOCALE_OPTIONS.map((option) => {
              const selected = option.code === value.code;
              return (
                <li key={option.code}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent/40",
                      selected && "bg-accent/30",
                    )}
                    onClick={() => {
                      setLocale(option.code);
                      setOpen(false);
                    }}
                  >
                    <span className="font-semibold">{getLocaleOptionLabel(option)}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.countryName} · {option.languageName}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
