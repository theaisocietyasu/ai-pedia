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
        backgroundColor: "#faf9f5",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(198, 191, 236, 0.55) 0%, transparent 55%)",
        fontFamily: "Georgia, 'Times New Roman', serif",
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
            fontSize: 96,
            fontWeight: 500,
            color: "#191918",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          AI Pedia
        </div>
        <div
          style={{
            fontSize: 34,
            fontStyle: "italic",
            color: "#3f3e3a",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "30px",
          }}
        >
          An interactive encyclopedia of artificial intelligence
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6f6d66",
          }}
        >
          <span>The AI Society · Arizona State University</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
