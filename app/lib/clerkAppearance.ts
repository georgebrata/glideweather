export const glideClerkAppearance = {
  variables: {
    colorPrimary: "#3dffc8",
    colorBackground: "#0d1c18",
    colorText: "#f4fffb",
    colorTextSecondary: "#8aa399",
    colorInputBackground: "#10241f",
    colorInputText: "#f4fffb",
    borderRadius: "0.875rem",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    card: {
      backgroundColor: "#10241f",
      border: "1px solid rgba(140, 255, 214, 0.14)",
      boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
    },
    formButtonPrimary: {
      backgroundColor: "#3dffc8",
      color: "#030806",
    },
  },
} as const;
