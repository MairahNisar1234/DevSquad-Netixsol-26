"use client";
import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin, FiCpu } from "react-icons/fi";

export default function Footer({ isDarkMode }: { isDarkMode: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
      borderTop: `1px solid ${isDarkMode ? "#1E293B" : "#E2E8F0"}`,
      padding: "40px 20px",
      marginTop: "auto",
      color: isDarkMode ? "#94A3B8" : "#64748B",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "30px"
      }}>
        
        {/* Brand Section */}
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            color: "#10B981", 
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "15px"
          }}>
            <FiCpu size={24} />
            <span>Nexus Core</span>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            The next generation of real-time community interaction. 
            Built for developers, by developers.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: "flex", gap: "50px" }}>
          <div>
            <h4 style={{ color: isDarkMode ? "#F1F5F9" : "#0F172A", marginBottom: "15px", fontSize: "15px" }}>Platform</h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><Link href="/feed" style={{ textDecoration: "none", color: "inherit" }}>Global Feed</Link></li>
              <li><Link href="/trending" style={{ textDecoration: "none", color: "inherit" }}>Trending</Link></li>
              <li><Link href="/communities" style={{ textDecoration: "none", color: "inherit" }}>Communities</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: isDarkMode ? "#F1F5F9" : "#0F172A", marginBottom: "15px", fontSize: "15px" }}>Social</h4>
            <div style={{ display: "flex", gap: "15px" }}>
              <a href="#" style={{ color: "inherit" }}><FiGithub size={20} /></a>
              <a href="#" style={{ color: "inherit" }}><FiTwitter size={20} /></a>
              <a href="#" style={{ color: "inherit" }}><FiLinkedin size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: "1100px",
        margin: "40px auto 0",
        paddingTop: "20px",
        borderTop: `1px solid ${isDarkMode ? "#1E293B" : "#E2E8F0"}`,
        textAlign: "center",
        fontSize: "12px"
      }}>
        © {year} Nexus Core AI. All rights reserved.
      </div>
    </footer>
  );
}