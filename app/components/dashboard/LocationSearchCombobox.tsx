"use client";

import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";
import { Input } from "@/app/components/ui/input";
import type { LocationChoice } from "@/app/lib/weather";

const formatLocationLabel = (option: LocationChoice) =>
  [option.name, option.detail].filter(Boolean).join(", ");

type LocationSearchComboboxProps = {
  options: LocationChoice[];
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onSelect: (location: LocationChoice) => void;
  placeholder: string;
  loading?: boolean;
  loadingText: string;
  emptyText: string;
  ariaLabel?: string;
  className?: string;
};

export const LocationSearchCombobox = ({
  options,
  inputValue,
  onInputValueChange,
  onSelect,
  placeholder,
  loading,
  loadingText,
  emptyText,
  ariaLabel,
  className,
}: LocationSearchComboboxProps) => {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showList = open && inputValue.trim().length >= 3;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelect = useCallback(
    (location: LocationChoice) => {
      onSelect(location);
      onInputValueChange("");
      setOpen(false);
      setActiveIndex(-1);
    },
    [onInputValueChange, onSelect],
  );

  return (
    <div ref={containerRef} className={cn("relative w-full min-w-0", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => {
            onInputValueChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!showList || options.length === 0) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, options.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              const option = options[activeIndex];
              if (option) handleSelect(option);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className="h-11 rounded-full border-[var(--border-flight)] bg-card pr-10 pl-10"
        />
        {loading ? (
          <Loader2 className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-[var(--border-flight)] bg-popover p-1 shadow-xl"
        >
          {loading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</li>
          ) : (
            options.map((option, index) => (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent/40",
                    activeIndex === index && "bg-accent/40",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                >
                  <span className="font-semibold text-foreground">{option.name}</span>
                  {option.detail ? (
                    <span className="text-muted-foreground">{option.detail}</span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
};

export { formatLocationLabel };
