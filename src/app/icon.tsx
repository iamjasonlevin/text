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
          alignItems: "center",
          justifyContent: "center",
          background: "#1982FC",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 12,
            background: "white",
            borderRadius: 6,
          }}
        />
      </div>
    ),
    size,
  );
}
