export default function SimpleNavbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#1f2937",
        color: "white",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Logo</div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          About
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </a>
      </div>
    </nav>
  );
}
