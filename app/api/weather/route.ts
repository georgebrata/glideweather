import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isAppLocale } from "../../i18n";
import type { LocationChoice } from "../../lib/weather/domain";
import { getCurrentSnapshot, getDayForecast } from "../../lib/weather/service";

function parseLocation(request: NextRequest): LocationChoice | null {
  const latRaw = request.nextUrl.searchParams.get("lat")?.trim();
  const lonRaw = request.nextUrl.searchParams.get("lon")?.trim();
  if (!latRaw || !lonRaw) return null;
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;

  return {
    id: request.nextUrl.searchParams.get("id") ?? "api",
    name: request.nextUrl.searchParams.get("name") ?? "",
    detail: request.nextUrl.searchParams.get("detail") ?? undefined,
    latitude: lat,
    longitude: lon,
    timezone: request.nextUrl.searchParams.get("timezone") ?? undefined,
    source:
      (request.nextUrl.searchParams.get("source") as LocationChoice["source"]) ??
      "search",
  };
}

export async function GET(request: NextRequest) {
  const location = parseLocation(request);
  if (!location) {
    return NextResponse.json({ error: "Invalid lat/lon" }, { status: 400 });
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = localeParam && isAppLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const kind = request.nextUrl.searchParams.get("kind") ?? "current";

  try {
    if (kind === "day") {
      const date = request.nextUrl.searchParams.get("date");
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      const forecast = await getDayForecast(location, date, locale);
      return NextResponse.json(forecast);
    }

    const snapshot = await getCurrentSnapshot(location, locale);
    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Weather request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
