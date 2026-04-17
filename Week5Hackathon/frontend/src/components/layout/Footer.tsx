"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#2b3a7a", color: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Main Footer Body */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "48px 40px 36px",
          display: "grid",
          gridTemplateColumns: "280px 1fr 1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* ── Col 1: Brand ── */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            {/* Car SVG icon in yellow */}
            <svg width="36" height="24" viewBox="0 0 52 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 20 L14 8 Q16 4 20 4 L32 4 Q36 4 38 8 L44 20"
                stroke="#f5a623" strokeWidth="3" fill="none" strokeLinejoin="round"
              />
              <rect x="4" y="18" width="44" height="10" rx="4" fill="#f5a623" />
              <circle cx="14" cy="30" r="4" fill="#f5a623" />
              <circle cx="38" cy="30" r="4" fill="#f5a623" />
              <rect x="18" y="8" width="16" height="10" rx="2" fill="#2b3a7a" stroke="#f5a623" strokeWidth="1.5" />
            </svg>
            <span style={{ fontSize: 20, fontWeight: 400, letterSpacing: 0.2 }}>
              Car{" "}
              <span style={{ color: "#f5a623", fontWeight: 700 }}>Deposit</span>
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: "#c5cce8",
              lineHeight: 1.75,
              marginBottom: 22,
            }}
          >
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit
            suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero.
            Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra
            in sed mauris.
          </p>

          {/* Follow Us */}
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Follow Us</p>
          <div style={{ display: "flex", gap: 10 }}>
            {/* Facebook */}
            <a href="#" style={socialStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" style={socialStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" style={socialStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" style={socialStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Col 2: Home links ── */}
        <div>
          <h4 style={colHeadStyle}>Home</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Help Center", "FAQ", "My Account", "My Account"].map((item, i) => (
              <li key={i} style={{ marginBottom: 14 }}>
                <Link href="#" style={linkStyle}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Car Auction links ── */}
        <div>
          <h4 style={colHeadStyle}>Car Aucation</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Help Center", "FAQ", "My Account", "My Account"].map((item, i) => (
              <li key={i} style={{ marginBottom: 14 }}>
                <Link href="#" style={linkStyle}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: About us / Contact ── */}
        <div>
          <h4 style={colHeadStyle}>About us</h4>

          {/* Contact items with vertical timeline line */}
          <div style={{ position: "relative", paddingLeft: 28 }}>
            {/* Vertical connecting line */}
            <div
              style={{
                position: "absolute",
                left: 9,
                top: 8,
                bottom: 8,
                width: 2,
                backgroundColor: "#4a5a9a",
              }}
            />

            {/* Hot Line */}
            <div style={contactItemStyle}>
              <div style={contactDotStyle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.5 19.79 19.79 0 0 1 1.11 3.9a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#c5cce8", marginBottom: 2 }}>Hot Line Number</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>+054 211 4444</div>
              </div>
            </div>

            {/* Email */}
            <div style={contactItemStyle}>
              <div style={contactDotStyle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#c5cce8", marginBottom: 2 }}>Email Id :</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>info@cardeposit.com</div>
              </div>
            </div>

            {/* Address */}
            <div style={{ ...contactItemStyle, marginBottom: 0 }}>
              <div style={contactDotStyle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#c5cce8", lineHeight: 1.6 }}>
                  Office No 6, SKB Plaza next to Bentley showroom,<br />
                  Umm Al Sheif Street, Sheikh<br />
                  Zayed Road, Dubai, UAE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div
        style={{
          borderTop: "1px solid #3d4f8a",
          textAlign: "center",
          padding: "14px 20px",
          fontSize: 13,
          color: "#c5cce8",
        }}
      >
        <span style={{ borderBottom: "1px solid #c5cce8", paddingBottom: 1 }}>
          Copyright 2022
        </span>{" "}
        All Rights Reserved
      </div>
    </footer>
  );
}

/* ── Shared style objects ── */
const socialStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "1px solid #4a5a9a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#c5cce8",
  textDecoration: "none",
  transition: "border-color .15s, color .15s",
  cursor: "pointer",
};

const colHeadStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#fff",
  marginBottom: 20,
  marginTop: 0,
};

const linkStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#c5cce8",
  textDecoration: "none",
};

const contactItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 24,
  position: "relative",
};

const contactDotStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: "50%",
  backgroundColor: "#3d4f8a",
  border: "2px solid #5a70b0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  position: "absolute",
  left: -28,
  top: 0,
  color: "#c5cce8",
  zIndex: 1,
};