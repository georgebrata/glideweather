"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import type { LocationChoice } from "../../lib/weather";
import { useLocaleText } from "./LocaleContext";
import { POPULAR_SPOTS } from "./popularSpots";

export const SitesDrawer = ({
  open,
  onClose,
  location,
  onSelectLocation,
}: {
  open: boolean;
  onClose: () => void;
  location: LocationChoice | null;
  onSelectLocation: (location: LocationChoice) => void;
}) => {
  const { t } = useLocaleText();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 360 },
            bgcolor: "background.default",
            borderRight: "1px solid var(--border-flight)",
          },
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h2">{t.console.romaniaSites}</Typography>
          <IconButton aria-label={t.language.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {POPULAR_SPOTS.map((spot) => {
            const selected = location?.id === spot.id;
            return (
              <Button
                key={spot.id}
                variant={selected ? "contained" : "outlined"}
                onClick={() => {
                  onSelectLocation(spot);
                  onClose();
                }}
                sx={{ borderRadius: 999 }}
              >
                {spot.name}
              </Button>
            );
          })}
        </Box>
      </Stack>
    </Drawer>
  );
};
