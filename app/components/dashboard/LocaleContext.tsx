"use client";

import { createContext, useContext } from "react";
import type { AppLocale, LocaleText } from "../../i18n";

export type LocaleContextValue = {
  locale: AppLocale;
  t: LocaleText;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export const useLocaleText = () => {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("LocaleContext is missing");
  }
  return value;
};
