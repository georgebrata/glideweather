"use client";

import { ChevronRight, MapPin, Mountain, Wind } from "lucide-react";
import type { GeoJSONSource, Map as MapboxMap, Marker } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { applyBasemapTheme, basemapConfigForTheme } from "@/app/lib/mapboxBasemap";
import { cn } from "@/app/lib/utils";
import { formatCoordinateOverlay, locationFromCoordinates, reverseGeocode } from "../../lib/location";
import { fetchWindGrid, type WindGridPoint } from "../../lib/windGrid";
import type { LocationChoice } from "../../lib/weather";
import { flightTokensByMode, type ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";

type MapMode = "wind" | "terrain";

function windGridCacheKey(latitude: number, longitude: number) {
  const lat = Math.round(latitude * 1000) / 1000;
  const lon = Math.round(longitude * 1000) / 1000;
  return `${lat}:${lon}`;
}

function centerDistanceDegrees(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const dLat = a.latitude - b.latitude;
  const dLon = a.longitude - b.longitude;
  return Math.hypot(dLat, dLon);
}

function circleRing(lng: number, lat: number, radiusKm: number, points = 64): [number, number][] {
  const coords: [number, number][] = [];
  const latRad = (lat * Math.PI) / 180;
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const dx = (radiusKm / 111.32) * Math.cos(angle) / Math.cos(latRad);
    const dy = (radiusKm / 110.574) * Math.sin(angle);
    coords.push([lng + dx, lat + dy]);
  }
  return coords;
}

function ringsGeoJson(lng: number, lat: number) {
  const radii = [0.5, 1, 1.5, 2];
  return {
    type: "FeatureCollection" as const,
    features: radii.map((radius) => ({
      type: "Feature" as const,
      properties: { radius },
      geometry: {
        type: "LineString" as const,
        coordinates: circleRing(lng, lat, radius),
      },
    })),
  };
}

function windBarbsGeoJson(points: WindGridPoint[]) {
  return {
    type: "FeatureCollection" as const,
    features: points
      .map((point) => {
        if (point.speed === null || point.direction === null) return null;
        const len = 0.0025 * Math.min(2.2, point.speed / 12);
        const rad = ((point.direction - 90) * Math.PI) / 180;
        const latRad = (point.latitude * Math.PI) / 180;
        const endLng = point.longitude + (Math.cos(rad) * len) / Math.cos(latRad);
        const endLat = point.latitude + Math.sin(rad) * len;
        return {
          type: "Feature" as const,
          properties: { speed: point.speed },
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [point.longitude, point.latitude],
              [endLng, endLat],
            ] as [number, number][],
          },
        };
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null),
  };
}

function createPinElement(accent: string) {
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.width = "22px";
  root.style.height = "22px";
  root.style.borderRadius = "50%";
  root.style.border = `2px solid ${accent}`;
  root.style.background = "rgba(7, 20, 16, 0.88)";
  root.style.boxShadow = `0 0 14px ${accent}, 0 0 28px ${accent}66`;
  root.style.cursor = "grab";
  const core = document.createElement("div");
  core.style.width = "8px";
  core.style.height = "8px";
  core.style.margin = "5px auto 0";
  core.style.borderRadius = "50%";
  core.style.background = accent;
  root.appendChild(core);
  return root;
}

export const FlightMap = ({
  accessToken,
  location,
  themeMode,
  onLocationChange,
  onOpenSites,
}: {
  accessToken: string;
  location: LocationChoice | null;
  themeMode: ThemeMode;
  onLocationChange: (location: LocationChoice) => void;
  onOpenSites: () => void;
}) => {
  const { locale, t } = useLocaleText();
  const tokens = flightTokensByMode[themeMode];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("wind");
  const mapModeRef = useRef<MapMode>("wind");
  const pinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windGridCacheRef = useRef<Map<string, WindGridPoint[]>>(new Map());
  const windFetchGenRef = useRef(0);
  const lastCameraRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const themeModeRef = useRef(themeMode);
  const accentRef = useRef(tokens.accent);
  const handlePinMoveRef = useRef<(latitude: number, longitude: number) => void>(() => undefined);

  const updateRings = useCallback((lng: number, lat: number) => {
    const map = mapRef.current;
    const source = map?.getSource("radar-rings") as GeoJSONSource | undefined;
    source?.setData(ringsGeoJson(lng, lat));
  }, []);

  const applyWindGridToMap = useCallback((grid: WindGridPoint[]) => {
    const map = mapRef.current;
    const source = map?.getSource("wind-barbs") as GeoJSONSource | undefined;
    source?.setData(windBarbsGeoJson(grid));
  }, []);

  const loadWindGrid = useCallback(
    async (latitude: number, longitude: number) => {
      if (mapModeRef.current !== "wind") return;

      const key = windGridCacheKey(latitude, longitude);
      const cached = windGridCacheRef.current.get(key);
      if (cached) {
        applyWindGridToMap(cached);
        return;
      }

      const generation = windFetchGenRef.current + 1;
      windFetchGenRef.current = generation;
      const grid = await fetchWindGrid(latitude, longitude);
      if (windFetchGenRef.current !== generation) return;

      windGridCacheRef.current.set(key, grid);
      applyWindGridToMap(grid);
    },
    [applyWindGridToMap],
  );

  const moveCameraTo = useCallback((latitude: number, longitude: number) => {
    const map = mapRef.current;
    if (!map) return;

    const previous = lastCameraRef.current;
    lastCameraRef.current = { latitude, longitude };

    const camera = {
      center: [longitude, latitude] as [number, number],
      zoom: 12.5,
      pitch: 48,
      bearing: 0,
    };

    if (previous && centerDistanceDegrees(previous, { latitude, longitude }) > 0.45) {
      map.jumpTo(camera);
    } else {
      map.easeTo({ ...camera, duration: 600 });
    }
  }, []);

  const syncExternalLocation = useCallback(
    (latitude: number, longitude: number) => {
      const map = mapRef.current;
      if (!map) return;

      markerRef.current?.setLngLat([longitude, latitude]);
      moveCameraTo(latitude, longitude);

      const applyOverlays = () => {
        updateRings(longitude, latitude);
        void loadWindGrid(latitude, longitude);
      };

      if (map.isStyleLoaded()) {
        applyOverlays();
      } else {
        map.once("style.load", applyOverlays);
      }
    },
    [loadWindGrid, moveCameraTo, updateRings],
  );

  const resolvePinLocation = useCallback(
    (latitude: number, longitude: number) => {
      if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
      pinTimerRef.current = setTimeout(async () => {
        const reversed = await reverseGeocode(latitude, longitude, locale);
        onLocationChange(reversed ?? locationFromCoordinates(latitude, longitude, locale));
      }, 450);
    },
    [locale, onLocationChange],
  );

  const handlePinMove = useCallback(
    (latitude: number, longitude: number) => {
      updateRings(longitude, latitude);
      void loadWindGrid(latitude, longitude);
      resolvePinLocation(latitude, longitude);
    },
    [loadWindGrid, resolvePinLocation, updateRings],
  );

  useEffect(() => {
    mapModeRef.current = mapMode;
    themeModeRef.current = themeMode;
    accentRef.current = tokens.accent;
    handlePinMoveRef.current = handlePinMove;
  }, [handlePinMove, mapMode, themeMode, tokens.accent]);

  const coordinateLabel = location
    ? formatCoordinateOverlay(location.latitude, location.longitude)
    : "";

  useEffect(() => {
    if (!accessToken || !containerRef.current || mapRef.current) return undefined;

    const initialLng = location?.longitude ?? 25.6;
    const initialLat = location?.latitude ?? 45.6;
    lastCameraRef.current = { latitude: initialLat, longitude: initialLng };

    const map = new mapboxgl.Map({
      accessToken,
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: basemapConfigForTheme(themeModeRef.current),
      },
      center: [initialLng, initialLat],
      zoom: 12.5,
      pitch: 48,
      bearing: 0,
      projection: "mercator",
      refreshExpiredTiles: false,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }), "top-right");

    const addOverlays = () => {
      applyBasemapTheme(map, themeModeRef.current);

      if (!map.getSource("radar-rings")) {
        map.addSource("radar-rings", {
          type: "geojson",
          data: ringsGeoJson(initialLng, initialLat),
        });
        map.addLayer({
          id: "radar-rings-line",
          type: "line",
          source: "radar-rings",
          slot: "top",
          paint: {
            "line-color": accentRef.current,
            "line-opacity": 0.22,
            "line-width": 1,
          },
        });
      }

      if (!map.getSource("wind-barbs")) {
        map.addSource("wind-barbs", {
          type: "geojson",
          data: windBarbsGeoJson([]),
        });
        map.addLayer({
          id: "wind-barbs-line",
          type: "line",
          source: "wind-barbs",
          slot: "top",
          paint: {
            "line-color": accentRef.current,
            "line-opacity": 0.75,
            "line-width": 2,
          },
        });
      }
    };

    map.on("style.load", addOverlays);
    if (map.isStyleLoaded()) addOverlays();

    map.on("click", (event) => {
      const { lng, lat } = event.lngLat;
      markerRef.current?.setLngLat([lng, lat]);
      handlePinMoveRef.current(lat, lng);
    });

    const marker = new mapboxgl.Marker({
      element: createPinElement(accentRef.current),
      draggable: true,
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map);

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      handlePinMoveRef.current(lngLat.lat, lngLat.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    if (location) {
      void loadWindGrid(location.latitude, location.longitude);
    }

    return () => {
      if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map mounts once
  }, [accessToken]);

  useEffect(() => {
    if (!location) return;
    syncExternalLocation(location.latitude, location.longitude);
  }, [location?.id, location?.latitude, location?.longitude, syncExternalLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    applyBasemapTheme(map, themeMode);

    if (map.getLayer("wind-barbs-line")) {
      map.setPaintProperty("wind-barbs-line", "line-color", tokens.accent);
      map.setPaintProperty("wind-barbs-line", "line-opacity", mapMode === "wind" ? 0.75 : 0.2);
    }
    if (map.getLayer("radar-rings-line")) {
      map.setPaintProperty("radar-rings-line", "line-color", tokens.accent);
    }
  }, [mapMode, themeMode, tokens.accent]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (mapMode === "terrain") {
      if (!map.getSource("terrain-dem")) {
        map.addSource("terrain-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }
      map.setTerrain({ source: "terrain-dem", exaggeration: 1.15 });
    } else {
      map.setTerrain(null);
      if (location) {
        void loadWindGrid(location.latitude, location.longitude);
      }
    }
  }, [loadWindGrid, location?.latitude, location?.longitude, mapMode]);

  if (!accessToken) {
    return (
      <div
        className="relative flex h-full min-h-[320px] flex-col items-center justify-center gap-2 border border-[var(--border-flight)] bg-card p-6 text-center md:min-h-[520px]"
        style={{ borderRadius: tokens.innerRadius }}
      >
        <p className="text-sm text-muted-foreground">
          Map unavailable: set MAPBOX_PERSONAL_ACCESS_TOKEN in the environment.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative h-full min-h-[320px] overflow-hidden border border-[var(--border-flight)] bg-card md:min-h-[520px]"
      style={{ borderRadius: tokens.innerRadius }}
    >
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10 flex rounded-full border border-[var(--border-flight)] bg-card p-1">
        <Button
          type="button"
          size="sm"
          variant={mapMode === "wind" ? "pill-active" : "ghost"}
          className={cn("min-w-[88px] rounded-full", mapMode !== "wind" && "text-muted-foreground")}
          onClick={() => setMapMode("wind")}
        >
          <Wind className="size-4" />
          {t.flightWindow.mapWind}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mapMode === "terrain" ? "pill-active" : "ghost"}
          className={cn("min-w-[88px] rounded-full", mapMode !== "terrain" && "text-muted-foreground")}
          onClick={() => setMapMode("terrain")}
        >
          <Mountain className="size-4" />
          {t.flightWindow.mapTerrain}
        </Button>
      </div>
      {coordinateLabel ? (
        <p className="telemetry absolute top-4 right-4 z-10 text-[0.72rem] tracking-wide text-muted-foreground">
          {coordinateLabel}
        </p>
      ) : null}
      {location ? (
        <button
          type="button"
          onClick={onOpenSites}
          className="frosted-chip absolute bottom-4 left-4 z-10 flex max-w-[min(280px,calc(100%-32px))] items-center gap-3 rounded-2xl border border-[var(--border-flight)] p-3 pr-2 text-left transition-colors hover:border-primary/40"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[var(--border-flight)]">
            <MapPin className="size-4 text-primary animate-halo" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.65rem] tracking-widest text-muted-foreground uppercase">
              {t.flightWindow.selectedLocation}
            </span>
            <span className="block truncate font-bold">{location.name}</span>
            {location.detail ? (
              <span className="block truncate text-sm text-muted-foreground">{location.detail}</span>
            ) : null}
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      ) : null}
    </div>
  );
};
