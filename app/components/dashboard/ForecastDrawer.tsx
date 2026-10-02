"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";
import { CurrentSnapshot } from "../../lib/weather";
import type { ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";
import { ForecastDetailPanels } from "./ForecastDetailPanels";

export const ForecastDrawer = ({
  open,
  onClose,
  location,
  activeTab,
  setActiveTab,
  currentQuery,
  themeMode,
}: {
  open: boolean;
  onClose: () => void;
  location: { latitude: number; longitude: number };
  activeTab: number;
  setActiveTab: (value: number) => void;
  currentQuery: UseQueryResult<CurrentSnapshot, Error>;
  themeMode: ThemeMode;
}) => {
  const { t } = useLocaleText();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 520, md: 640 },
          bgcolor: "background.default",
          borderLeft: "1px solid var(--border-flight)",
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 2.5, height: "100%", overflow: "auto" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h2">{t.flightWindow.fullForecast}</Typography>
          <IconButton aria-label={t.language.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box>
          <ForecastDetailPanels
            location={location}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentQuery={currentQuery}
            themeMode={themeMode}
          />
        </Box>
      </Stack>
    </Drawer>
  );
};
