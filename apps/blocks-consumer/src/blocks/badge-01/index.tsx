export default function StatusBadge() {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <span
        style={{
          padding: "0.25rem 0.75rem",
          backgroundColor: "#10b981",
          color: "white",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: "500",
        }}
      >
        Active
      </span>
      <span
        style={{
          padding: "0.25rem 0.75rem",
          backgroundColor: "#6b7280",
          color: "white",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: "500",
        }}
      >
        Pending
      </span>
      <span
        style={{
          padding: "0.25rem 0.75rem",
          backgroundColor: "#ef4444",
          color: "white",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: "500",
        }}
      >
        Error
      </span>
    </div>
  );
}
