import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AI Pedia - Learn AI through Interactive Visualizations";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            background: "linear-gradient(to right, #8b5cf6, #ec4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          AI Pedia
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#d1d5db",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "30px",
          }}
        >
          Master AI through Interactive Visualizations
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 24,
            color: "#9ca3af",
          }}
        >
          <span>The AI Society at ASU</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
