"use client";

import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { cn } from "@/app/lib/utils";
import type { LocationChoice } from "../../lib/weather";
import { useLocaleText } from "./LocaleContext";
import { POPULAR_SPOTS } from "./popularSpots";

export const SitesDrawer = ({
  open,
  onClose,
  location,
  onSelectLocation,
}: {
  open: boolean;
  onClose: () => void;
  location: LocationChoice | null;
  onSelectLocation: (location: LocationChoice) => void;
}) => {
  const { t } = useLocaleText();

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="left"
        className="w-full border-r border-[var(--border-flight)] bg-background sm:max-w-[360px]"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">{t.console.romaniaSites}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-wrap gap-2">
          {POPULAR_SPOTS.map((spot) => {
            const selected = location?.id === spot.id;
            return (
              <Button
                key={spot.id}
                type="button"
                variant={selected ? "pill-active" : "pill"}
                size="pill"
                onClick={() => {
                  onSelectLocation(spot);
                  onClose();
                }}
                className={cn(!selected && "text-foreground")}
              >
                {spot.name}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
