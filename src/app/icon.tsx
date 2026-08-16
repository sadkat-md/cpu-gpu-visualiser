import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          background: "#07080a",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <div style={{ width: 8, height: 8, background: "#f0a46a" }} />
          <div style={{ width: 8, height: 8, background: "#3ee8c5" }} />
          <div style={{ width: 8, height: 8, background: "#3ee8c5" }} />
          <div style={{ width: 8, height: 8, background: "#f0a46a" }} />
        </div>
      </div>
    ),
    size,
  );
}
