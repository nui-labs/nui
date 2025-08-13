import { Suspense } from "react";
import { blocks, registry } from "virtual:blocks";

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>🎨 Blocks Provider 2</h1>
      <p>
        This app exports {blocks.length} reusable blocks for external
        consumption.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2>Available Blocks:</h2>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {blocks.map((block) => {
            const blockMeta = registry.find((r) => r.id === block.id);
            return (
              <div
                key={block.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{block.name}</h3>
                <p style={{ margin: "0.5rem 0", color: "#666" }}>
                  Category: {block.category}
                </p>
                <p style={{ margin: "0.5rem 0", fontSize: "0.9em" }}>
                  {blockMeta?.files.length || 0} files
                </p>
                <div style={{ marginTop: "1rem" }}>
                  {block.component && (
                    <Suspense fallback={<div>Loading...</div>}>
                      <block.component />
                    </Suspense>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
