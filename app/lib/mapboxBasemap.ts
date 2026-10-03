import { flightTokensByMode, type ThemeMode } from "../theme/flightTokens";

const sharedBasemapFlags = {
  show3dObjects: false,
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  showLandmarkIcons: false,
  showIndoor: false,
  showPedestrianRoads: false,
} as const;

export function basemapConfigForTheme(mode: ThemeMode): Record<string, string | boolean> {
  const tokens = flightTokensByMode[mode];
  if (mode === "dark") {
    return {
      ...sharedBasemapFlags,
      lightPreset: "night",
      theme: "monochrome",
      colorLand: tokens.page,
      colorWater: "#061410",
      colorGreenspace: tokens.panel,
      colorBuildings: tokens.card,
    };
  }
  return {
    ...sharedBasemapFlags,
    lightPreset: "day",
    theme: "default",
    colorLand: tokens.page,
    colorWater: "#9ec4b8",
    colorGreenspace: "#c8ddd2",
    colorBuildings: tokens.card,
  };
}

export function applyBasemapTheme(
  map: { setConfigProperty: (layer: string, name: string, value: unknown) => void; setFog: (fog: Record<string, unknown>) => void },
  mode: ThemeMode,
) {
  const config = basemapConfigForTheme(mode);
  for (const [key, value] of Object.entries(config)) {
    map.setConfigProperty("basemap", key, value);
  }
  if (mode === "dark") {
    map.setFog({
      color: "rgb(7, 20, 16)",
      "high-color": "#10241f",
      "horizon-blend": 0.08,
      "space-color": "#071410",
      "star-intensity": 0.35,
    });
  } else {
    map.setFog({
      color: "rgb(231, 242, 236)",
      "high-color": "#f7fbf8",
      "horizon-blend": 0.06,
      "space-color": "#e7f2ec",
      "star-intensity": 0,
    });
  }
}
