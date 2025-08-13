export default function SuccessToast() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
        backgroundColor: "#10b981",
        color: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <div>
        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
          Success!
        </div>
        <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
          Your changes have been saved.
        </div>
      </div>
    </div>
  );
}
