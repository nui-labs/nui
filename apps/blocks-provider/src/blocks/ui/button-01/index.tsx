export default function PrimaryButton() {
  return (
    <button
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        fontWeight: "500",
        cursor: "pointer",
      }}
      onClick={() => alert("Button clicked!")}
    >
      Click Me
    </button>
  );
}
