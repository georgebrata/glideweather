import { ImageResponse } from "next/og";
import { PRODUCT_NAME } from "./brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(145deg, #03120e 0%, #0a2a20 45%, #041610 100%)",
          color: "#e8f5ef",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.75, textTransform: "uppercase" }}>
          Paragliding weather
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>{PRODUCT_NAME}</div>
        <div style={{ fontSize: 32, marginTop: 24, maxWidth: 900, lineHeight: 1.35, opacity: 0.9 }}>
          Hyperlocal flight intelligence: wind, gusts, visibility, and launch-window guidance.
        </div>
      </div>
    ),
    { ...size },
  );
}
