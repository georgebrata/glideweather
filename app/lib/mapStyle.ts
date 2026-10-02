import type { StyleSpecification } from "maplibre-gl";
import { flightTokensByMode, type ThemeMode } from "../theme/flightTokens";

export function createMapStyle(mode: ThemeMode): StyleSpecification {
  const tokens = flightTokensByMode[mode];
  const land = mode === "dark" ? "#0a221c" : "#c8ddd2";
  const water = mode === "dark" ? "#061410" : "#9ec4b8";
  const label = mode === "dark" ? "#6d9a8a" : "#3d5c52";

  return {
    version: 8,
    name: "GlideWeather",
    sources: {
      openmaptiles: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
      },
      terrainDem: {
        type: "raster-dem",
        tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
        tileSize: 256,
        maxzoom: 15,
        encoding: "terrarium",
      },
    },
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": tokens.card },
      },
      {
        id: "water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        paint: { "fill-color": water },
      },
      {
        id: "landcover",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        paint: { "fill-color": land, "fill-opacity": 0.85 },
      },
      {
        id: "landuse",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landuse",
        paint: { "fill-color": land, "fill-opacity": 0.55 },
      },
      {
        id: "hillshade",
        type: "hillshade",
        source: "terrainDem",
        paint: {
          "hillshade-accent-color": tokens.accent,
          "hillshade-highlight-color": mode === "dark" ? "#1a3d32" : "#e8f4ee",
          "hillshade-shadow-color": mode === "dark" ? "#020806" : "#7a9a8c",
          "hillshade-exaggeration": 0.35,
        },
        layout: { visibility: "none" },
      },
      {
        id: "roads",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        paint: {
          "line-color": tokens.border,
          "line-width": 0.6,
          "line-opacity": 0.35,
        },
      },
      {
        id: "place-labels",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-font": ["Noto Sans Regular"],
        },
        paint: {
          "text-color": label,
          "text-halo-color": tokens.card,
          "text-halo-width": 1,
        },
      },
    ],
  };
}
