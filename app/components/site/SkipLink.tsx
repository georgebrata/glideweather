import { chromeFor } from "@/app/seo/chrome";
import type { ContentLocale } from "@/app/seo/types";

export const SkipLink = ({ locale }: { locale: ContentLocale }) => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
  >
    {chromeFor(locale).skip}
  </a>
);
