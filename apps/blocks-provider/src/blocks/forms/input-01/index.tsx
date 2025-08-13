export default function TextInput() {
  return (
    <div style={{ maxWidth: "300px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          color: "#374151",
        }}
      >
        Email Address
      </label>
      <input
        type="email"
        placeholder="you@example.com"
        style={{
          width: "100%",
          padding: "0.625rem 0.875rem",
          border: "1px solid #d1d5db",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
      />
    </div>
  );
}
