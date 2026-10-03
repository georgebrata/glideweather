import { track } from "@vercel/analytics";

export type SearchAnalyticsSource = "result" | "browser" | "map";

export const trackSearch = (source: SearchAnalyticsSource): void => {
  track("search", { source });
};

export const trackLogin = (): void => {
  track("login");
};
