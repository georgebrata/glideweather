import { flightTokensByMode, type ThemeMode } from "../theme/flightTokens";

const menuItem = (text: string, hover: string) => ({
  color: text,
  "&:hover, &:focus, &:focus-visible": {
    color: text,
    backgroundColor: hover,
  },
});

export const glideClerkAppearance = (theme: ThemeMode) => {
  const tokens = flightTokensByMode[theme];
  const onPrimary = theme === "dark" ? "#030806" : "#f7fbf8";
  const neutral = theme === "dark" ? "#f4fffb" : "#10241c";

  return {
    variables: {
      colorPrimary: tokens.accent,
      colorPrimaryForeground: onPrimary,
      colorBackground: tokens.card,
      colorForeground: tokens.textPrimary,
      colorMuted: tokens.panel,
      colorMutedForeground: tokens.textMuted,
      colorNeutral: neutral,
      colorInput: tokens.panel,
      colorInputForeground: tokens.textPrimary,
      colorBorder: tokens.border,
      borderRadius: "0.875rem",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    },
    elements: {
      card: {
        backgroundColor: tokens.card,
        color: tokens.textPrimary,
        border: `1px solid ${tokens.border}`,
        boxShadow:
          theme === "dark" ? "0 24px 80px rgba(0, 0, 0, 0.45)" : "0 16px 40px rgba(16, 36, 28, 0.08)",
      },
      formButtonPrimary: {
        backgroundColor: tokens.accent,
        color: onPrimary,
      },
      userButtonPopoverCard: {
        backgroundColor: tokens.card,
        color: tokens.textPrimary,
        border: `1px solid ${tokens.border}`,
      },
      userButtonPopoverMain: {
        color: tokens.textPrimary,
      },
      userPreviewMainIdentifier: { color: tokens.textPrimary },
      userPreviewMainIdentifierText: { color: tokens.textPrimary },
      userPreviewSecondaryIdentifier: { color: tokens.textMuted },
      userButtonPopoverActionButton: menuItem(tokens.textPrimary, tokens.accentMuted),
      userButtonPopoverActionButtonIcon: { color: tokens.textPrimary },
      userButtonPopoverCustomItemButton: menuItem(tokens.textPrimary, tokens.accentMuted),
      userButtonPopoverActionItemButtonIcon: { color: tokens.textPrimary },
      userButtonPopoverFooter: {
        backgroundColor: tokens.panel,
        color: tokens.textMuted,
      },
      userButtonPopoverFooterPagesLink: { color: tokens.textMuted },
    },
  };
};
