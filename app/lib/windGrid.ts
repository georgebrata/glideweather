import { z } from "zod";

const WindGridSchema = z.object({
  latitude: z.array(z.number()),
  longitude: z.array(z.number()),
  current: z.object({
    wind_speed_10m: z.array(z.number().nullable()),
    wind_direction_10m: z.array(z.number().nullable()),
  }),
});

export type WindGridPoint = {
  latitude: number;
  longitude: number;
  speed: number | null;
  direction: number | null;
};

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

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${search.toString()}`);
  if (!response.ok) return [];

  const data = WindGridSchema.parse(await response.json());
  return data.latitude.map((lat, index) => ({
    latitude: lat,
    longitude: data.longitude[index] ?? longitude,
    speed: data.current.wind_speed_10m[index] ?? null,
    direction: data.current.wind_direction_10m[index] ?? null,
  }));
}
