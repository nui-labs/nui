export default function SimpleCard() {
  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        maxWidth: "300px",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>
        Card Title
      </h3>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.875rem" }}>
        This is a simple card component with a clean design.
      </p>
    </div>
  );
}
