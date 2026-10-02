"use client";

import { X } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { CurrentSnapshot } from "../../lib/weather";
import type { ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";
import { ForecastDetailPanels } from "./ForecastDetailPanels";

export const ForecastDrawer = ({
  open,
  onClose,
  location,
  activeTab,
  setActiveTab,
  currentQuery,
  themeMode,
}: {
  open: boolean;
  onClose: () => void;
  location: { latitude: number; longitude: number };
  activeTab: number;
  setActiveTab: (value: number) => void;
  currentQuery: UseQueryResult<CurrentSnapshot, Error>;
  themeMode: ThemeMode;
}) => {
  const { t } = useLocaleText();

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l border-[var(--border-flight)] bg-background p-0 sm:max-w-[520px] md:max-w-[640px]"
      >
        <div className="flex h-full flex-col gap-4 overflow-auto p-5">
          <SheetHeader className="flex-row items-center justify-between space-y-0 p-0">
            <SheetTitle className="text-2xl font-semibold">{t.flightWindow.fullForecast}</SheetTitle>
            <Button type="button" variant="instrument" size="icon-round" aria-label={t.language.close} onClick={onClose}>
              <X className="size-4" />
            </Button>
          </SheetHeader>
          <ForecastDetailPanels
            location={location}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentQuery={currentQuery}
            themeMode={themeMode}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
