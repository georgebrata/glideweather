"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LandscapeIcon from "@mui/icons-material/Landscape";
import PlaceIcon from "@mui/icons-material/Place";
import AirIcon from "@mui/icons-material/Air";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import * as maplibregl from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatCoordinateOverlay, locationFromCoordinates, reverseGeocode } from "../../lib/location";
import { fetchWindGrid, type WindGridPoint } from "../../lib/windGrid";
import type { LocationChoice } from "../../lib/weather";
import { flightTokensByMode, type ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";

type MapMode = "wind" | "terrain";

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
    features: radii.map((radius, index) => ({
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

export const FlightMap = ({
  location,
  themeMode,
  onLocationChange,
  onOpenSites,
}: {
  location: LocationChoice | null;
  themeMode: ThemeMode;
  onLocationChange: (location: LocationChoice) => void;
  onOpenSites: () => void;
}) => {
  const { locale, t } = useLocaleText();
  const tokens = flightTokensByMode[themeMode];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("wind");
  const [windPoints, setWindPoints] = useState<WindGridPoint[]>([]);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleLocation = useCallback(
    (latitude: number, longitude: number) => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(async () => {
        const reversed = await reverseGeocode(latitude, longitude, locale);
        onLocationChange(reversed ?? locationFromCoordinates(latitude, longitude, locale));
        const grid = await fetchWindGrid(latitude, longitude);
        setWindPoints(grid);
        const map = mapRef.current;
        if (map?.getSource("wind-barbs")) {
          (map.getSource("wind-barbs") as GeoJSONSource).setData(windBarbsGeoJson(grid));
        }
      }, 450);
    },
    [locale, onLocationChange],
  );

  const coordinateLabel = location
    ? formatCoordinateOverlay(location.latitude, location.longitude)
    : "";

  const applyThemeToMap = useCallback(
    (map: MapLibreMap) => {
      map.getCanvas().style.filter = themeMode === "dark" ? "saturate(0.75) brightness(0.72)" : "saturate(0.85)";
    },
    [themeMode],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [location?.longitude ?? 25.6, location?.latitude ?? 45.6],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: "metric" }), "top-right");

    map.on("load", () => {
      applyThemeToMap(map);

      map.addSource("radar-rings", {
        type: "geojson",
        data: ringsGeoJson(location?.longitude ?? 25.6, location?.latitude ?? 45.6),
      });
      map.addLayer({
        id: "radar-rings-line",
        type: "line",
        source: "radar-rings",
        paint: {
          "line-color": tokens.accent,
          "line-opacity": 0.22,
          "line-width": 1,
        },
      });

      map.addSource("wind-barbs", {
        type: "geojson",
        data: windBarbsGeoJson([]),
      });
      map.addLayer({
        id: "wind-barbs-line",
        type: "line",
        source: "wind-barbs",
        paint: {
          "line-color": tokens.accent,
          "line-opacity": 0.75,
          "line-width": 2,
        },
      });

      if (location) {
        settleLocation(location.latitude, location.longitude);
      }
    });

    map.on("click", (event) => {
      const { lng, lat } = event.lngLat;
      markerRef.current?.setLngLat([lng, lat]);
      (map.getSource("radar-rings") as GeoJSONSource)?.setData(ringsGeoJson(lng, lat));
      settleLocation(lat, lng);
    });

    const marker = new maplibregl.Marker({
      color: tokens.accent,
      draggable: true,
    })
      .setLngLat([location?.longitude ?? 25.6, location?.latitude ?? 45.6])
      .addTo(map);

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      (map.getSource("radar-rings") as GeoJSONSource)?.setData(
        ringsGeoJson(lngLat.lng, lngLat.lat),
      );
      settleLocation(lngLat.lat, lngLat.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map mounts once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    markerRef.current?.setLngLat([location.longitude, location.latitude]);
    map.easeTo({ center: [location.longitude, location.latitude], duration: 600 });
    if (map.getSource("radar-rings")) {
      (map.getSource("radar-rings") as GeoJSONSource).setData(
        ringsGeoJson(location.longitude, location.latitude),
      );
    }
    settleLocation(location.latitude, location.longitude);
  }, [location?.id, location?.latitude, location?.longitude, settleLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    applyThemeToMap(map);
    if (map.getLayer("wind-barbs-line")) {
      map.setPaintProperty("wind-barbs-line", "line-color", tokens.accent);
      map.setPaintProperty("wind-barbs-line", "line-opacity", mapMode === "wind" ? 0.75 : 0.2);
    }
    if (map.getLayer("radar-rings-line")) {
      map.setPaintProperty("radar-rings-line", "line-color", tokens.accent);
    }
  }, [applyThemeToMap, mapMode, themeMode, tokens.accent]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (mapMode === "terrain" && !map.getSource("terrain-dem")) {
      map.addSource("terrain-dem", {
        type: "raster-dem",
        url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
        tileSize: 256,
      });
      map.setTerrain({ source: "terrain-dem", exaggeration: 1.15 });
    } else if (mapMode === "wind") {
      map.setTerrain(null);
    }
  }, [mapMode]);

  const modeButtons = useMemo(
    () => (
      <ButtonGroup
        sx={{
          bgcolor: "var(--card)",
          border: "1px solid var(--border-flight)",
          borderRadius: 999,
          p: 0.35,
          "& .MuiButton-root": {
            border: "none",
            borderRadius: 999,
            minWidth: 88,
            color: "text.secondary",
            "&.active": {
              bgcolor: "primary.main",
              color: themeMode === "dark" ? "#041116" : "#fff",
            },
          },
        }}
      >
        <Button
          className={mapMode === "wind" ? "active" : undefined}
          onClick={() => setMapMode("wind")}
          startIcon={<AirIcon sx={{ fontSize: 16 }} />}
        >
          {t.flightWindow.mapWind}
        </Button>
        <Button
          className={mapMode === "terrain" ? "active" : undefined}
          onClick={() => setMapMode("terrain")}
          startIcon={<LandscapeIcon sx={{ fontSize: 16 }} />}
        >
          {t.flightWindow.mapTerrain}
        </Button>
      </ButtonGroup>
    ),
    [mapMode, t.flightWindow.mapTerrain, t.flightWindow.mapWind, themeMode],
  );

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 320, md: 520 },
        height: "100%",
        borderRadius: `${tokens.innerRadius}px`,
        overflow: "hidden",
        bgcolor: "var(--card)",
        border: "1px solid var(--border-flight)",
      }}
    >
      <Box ref={containerRef} sx={{ position: "absolute", inset: 0 }} />
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>{modeButtons}</Box>
      {coordinateLabel ? (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            color: "text.secondary",
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
          }}
        >
          {coordinateLabel}
        </Typography>
      ) : null}
      {location ? (
        <Box
          component="button"
          type="button"
          onClick={onOpenSites}
          sx={{
            position: "absolute",
            left: 16,
            bottom: 16,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            textAlign: "left",
            border: "1px solid var(--border-flight)",
            borderRadius: 14,
            bgcolor: "rgba(7, 20, 16, 0.82)",
            color: "text.primary",
            p: 1.25,
            pr: 1,
            cursor: "pointer",
            maxWidth: "min(280px, calc(100% - 32px))",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid var(--border-flight)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <PlaceIcon sx={{ fontSize: 18, color: "primary.main" }} />
          </Box>
          <Stack spacing={0.15} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.65rem", letterSpacing: "0.1em" }}
            >
              {t.flightWindow.selectedLocation}
            </Typography>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
              {location.name}
            </Typography>
            {location.detail ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {location.detail}
              </Typography>
            ) : null}
          </Stack>
          <ChevronRightIcon sx={{ color: "text.secondary", flexShrink: 0 }} />
        </Box>
      ) : null}
    </Box>
  );
};
