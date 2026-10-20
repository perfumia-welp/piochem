import HexPattern from "./HexPattern";

const words = ["REPRESENT", "SOURCE", "IMPORT", "DISTRIBUTE", "SUPPORT"];

export default function Statement() {
  return (
    <section style={{
      position: "relative",
      minHeight: "600px",
      overflow: "hidden",
      backgroundColor: "#092A58",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <img
        src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=800&fit=crop&auto=format"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.16,
          filter: "grayscale(1)",
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 120%, rgba(113,183,43,0.2) 0%, transparent 55%), linear-gradient(180deg, rgba(9,42,88,0.7) 0%, rgba(9,42,88,0.55) 50%, rgba(9,42,88,0.85) 100%)",
      }} />
      <HexPattern id="stHex" opacity={0.05} />

      <div className="pc-section" style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "100px 80px",
        maxWidth: "980px",
      }}>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#71B72B",
          marginBottom: "40px",
        }}>CHEMICAL MAKER / SINCE 2009</p>

        <h2 style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "clamp(30px, 5vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "14px",
        }}>
          Since 2009.
        </h2>
        <h2 style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "clamp(30px, 5vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          marginBottom: "28px",
        }}>
          Experience Built Around<br />Customer Needs.
        </h2>

        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.62)",
          maxWidth: "640px",
          margin: "0 auto 56px",
        }}>
          Chemical Maker has built experience in handling pharmaceutical ingredient business
          according to customer needs, supplier relationships and import requirements.
        </p>

        <div style={{
          display: "flex",
          gap: "12px 20px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          {words.map((word, i) => (
            <span key={word} style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: i === 2 ? "#71B72B" : "rgba(255,255,255,0.4)",
            }}>{word}{i < words.length - 1 ? <span style={{ marginLeft: "20px", color: "rgba(255,255,255,0.2)" }}>•</span> : ""}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
