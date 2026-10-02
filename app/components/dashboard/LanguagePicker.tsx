"use client";

import LanguageIcon from "@mui/icons-material/Language";
import { Autocomplete, Box, Stack, TextField, Tooltip, Typography } from "@mui/material";
import {
  LOCALE_OPTIONS,
  getLocaleButtonLabel,
  getLocaleOption,
  getLocaleOptionLabel,
  type AppLocale,
  type LocaleText,
} from "../../i18n";

export const LanguagePicker = ({
  locale,
  setLocale,
  t,
}: {
  locale: AppLocale;
  setLocale: (value: AppLocale) => void;
  t: LocaleText;
}) => {
  const value = getLocaleOption(locale);

  return (
    <Tooltip title={t.language.tooltip}>
      <Autocomplete
        clearText={t.language.clear}
        closeText={t.language.close}
        disableClearable
        filterOptions={(options) => options}
        getOptionKey={(option) => option.code}
        getOptionLabel={getLocaleOptionLabel}
        inputValue={getLocaleButtonLabel(locale)}
        isOptionEqualToValue={(option, nextValue) => option.code === nextValue.code}
        noOptionsText={t.language.noOptions}
        onChange={(_, nextValue) => setLocale(nextValue.code)}
        onInputChange={() => undefined}
        openText={t.language.open}
        options={LOCALE_OPTIONS}
        renderInput={(params) => {
          const inputSlot = params.InputProps ?? {};
          return (
            <TextField
              {...params}
              aria-label={t.language.label}
              size="small"
              InputProps={{
                ...inputSlot,
                startAdornment: (
                  <>
                    <LanguageIcon sx={{ color: "primary.main", fontSize: 18, mr: 0.5 }} />
                    {inputSlot.startAdornment}
                  </>
                ),
              }}
            />
          );
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.code}>
            <Stack spacing={0.15} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>{getLocaleOptionLabel(option)}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {option.countryName} · {option.languageName}
              </Typography>
            </Stack>
          </Box>
        )}
        size="small"
        sx={{
          width: { xs: 52, sm: 168 },
          "& .MuiAutocomplete-input": { minWidth: "0 !important", fontWeight: 650 },
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            bgcolor: "background.paper",
            border: "1px solid var(--border-flight)",
          },
        }}
        value={value}
      />
    </Tooltip>
  );
};
