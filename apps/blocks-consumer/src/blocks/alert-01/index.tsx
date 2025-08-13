export default function AlertBox() {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fef3c7",
        border: "1px solid #f59e0b",
        borderRadius: "0.5rem",
        maxWidth: "400px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
        <div>
          <h4
            style={{
              margin: "0 0 0.25rem 0",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            Warning
          </h4>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#92400e" }}>
            This is an internal alert component.
          </p>
        </div>
      </div>
    </div>
  );
}
