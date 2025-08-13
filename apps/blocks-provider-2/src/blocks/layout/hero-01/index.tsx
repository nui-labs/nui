export default function HeroSection() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          margin: "0 0 1rem 0",
          color: "#111827",
        }}
      >
        Welcome to Our Platform
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#6b7280",
          margin: "0 0 2rem 0",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Build amazing things with our powerful tools and components
      </p>
      <button
        style={{
          padding: "0.875rem 2rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1.125rem",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Get Started
      </button>
    </div>
  );
}
