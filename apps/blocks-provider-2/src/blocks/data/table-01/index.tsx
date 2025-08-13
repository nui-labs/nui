export default function SimpleTable() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.875rem",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#f3f4f6" }}>
          <th
            style={{
              padding: "0.75rem",
              textAlign: "left",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Name
          </th>
          <th
            style={{
              padding: "0.75rem",
              textAlign: "left",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Email
          </th>
          <th
            style={{
              padding: "0.75rem",
              textAlign: "left",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={row.id}
            style={{
              backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
            }}
          >
            <td style={{ padding: "0.75rem", color: "#111827" }}>{row.name}</td>
            <td style={{ padding: "0.75rem", color: "#6b7280" }}>
              {row.email}
            </td>
            <td style={{ padding: "0.75rem", color: "#6b7280" }}>{row.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
