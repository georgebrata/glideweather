import { z } from "zod";

const WindLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  current: z.object({
    wind_speed_10m: z.number().nullable(),
    wind_direction_10m: z.number().nullable(),
  }),
});

const WindGridSchema = z.union([WindLocationSchema, z.array(WindLocationSchema)]);

export type WindGridPoint = {
  latitude: number;
  longitude: number;
  speed: number | null;
  direction: number | null;
};

export function windPointsFromResponse(payload: unknown): WindGridPoint[] {
  const parsed = WindGridSchema.safeParse(payload);
  if (!parsed.success) return [];

  const locations = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
  return locations.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
    speed: point.current.wind_speed_10m,
    direction: point.current.wind_direction_10m,
  }));
}

export async function fetchWindGrid(
  latitude: number,
  longitude: number,
  spanKm = 4,
  steps = 5,
): Promise<WindGridPoint[]> {
  const latitudes: number[] = [];
  const longitudes: number[] = [];
  const half = (steps - 1) / 2;
  const latStep = spanKm / 111 / Math.max(1, half);
  const lonStep = spanKm / (111 * Math.cos((latitude * Math.PI) / 180)) / Math.max(1, half);

  for (let row = 0; row < steps; row += 1) {
    for (let col = 0; col < steps; col += 1) {
      latitudes.push(latitude + (row - half) * latStep);
      longitudes.push(longitude + (col - half) * lonStep);
    }
  }

  const search = new URLSearchParams({
    latitude: latitudes.map((v) => v.toFixed(4)).join(","),
    longitude: longitudes.map((v) => v.toFixed(4)).join(","),
    current: "wind_speed_10m,wind_direction_10m",
    wind_speed_unit: "kmh",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${search.toString()}`);
    if (!response.ok) return [];
    return windPointsFromResponse(await response.json());
  } catch {
    return [];
  }
}
