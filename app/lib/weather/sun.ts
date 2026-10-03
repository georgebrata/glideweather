/** Astronomical sunrise/sunset (UTC), for days when the forecast API omits sun times. */

const RAD = Math.PI / 180;

function dayOfYear(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 0));
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

function solarDeclination(day: number) {
  return 23.45 * Math.sin(RAD * ((360 / 365) * (day - 81)));
}

function hourAngle(latitude: number, declination: number, zenith = 90.833) {
  const lat = latitude * RAD;
  const dec = declination * RAD;
  const cosH =
    (Math.cos(zenith * RAD) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec));
  if (cosH > 1 || cosH < -1) return null;
  return Math.acos(cosH) / RAD;
}

function formatLocalTime(
  date: string,
  hourUtc: number,
  minuteUtc: number,
  timezone: string,
): string {
  const utc = new Date(`${date}T${String(hourUtc).padStart(2, "0")}:${String(minuteUtc).padStart(2, "0")}:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(utc);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${date}T${hour}:${minute}`;
}

export function astronomicalSunriseSunset(
  latitude: number,
  longitude: number,
  date: string,
  timezone: string,
): { sunrise: string; sunset: string } | null {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;

  const doy = dayOfYear(year, month, day);
  const decl = solarDeclination(doy);
  const ha = hourAngle(latitude, decl);
  if (ha === null) return null;

  const solarNoonUtc = 12 - longitude / 15;
  const sunriseUtc = solarNoonUtc - ha / 15;
  const sunsetUtc = solarNoonUtc + ha / 15;

  const sunriseHour = Math.floor(sunriseUtc);
  const sunriseMin = Math.round((sunriseUtc - sunriseHour) * 60);
  const sunsetHour = Math.floor(sunsetUtc);
  const sunsetMin = Math.round((sunsetUtc - sunsetHour) * 60);

  return {
    sunrise: formatLocalTime(date, ((sunriseHour % 24) + 24) % 24, sunriseMin, timezone),
    sunset: formatLocalTime(date, ((sunsetHour % 24) + 24) % 24, sunsetMin, timezone),
  };
}

export function isDaylightAt(
  latitude: number,
  longitude: number,
  localIsoTime: string,
  timezone: string,
): boolean | null {
  const date = localIsoTime.slice(0, 10);
  const sun = astronomicalSunriseSunset(latitude, longitude, date, timezone);
  if (!sun) return null;
  const t = localIsoTime.slice(11, 16);
  const rise = sun.sunrise.slice(11, 16);
  const set = sun.sunset.slice(11, 16);
  return t >= rise && t < set;
}
