import { Suspense } from "react";
import { registry as externalRegistry } from "virtual:@nui/docs";
import {
  blocks as localBlocks,
  registry as localRegistry,
} from "virtual:registry";

export default function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🔌 Blocks Consumer</h1>
      <p>
        This app demonstrates the blocks system with {localBlocks.length} local
        blocks and {externalRegistry.length} discoverable blocks from external
        sources.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2>📦 Local Blocks ({localBlocks.length})</h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
          }}
        >
          These blocks are imported directly from{" "}
          <code
            style={{
              backgroundColor: "#f3f4f6",
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
            }}
          >
            virtual:@nui/blocks-consumer
          </code>{" "}
          and rendered below:
        </p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {localBlocks.map((block) => (
            <div
              key={block.id}
              style={{
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0" }}>
                {block.name}{" "}
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontWeight: "normal",
                  }}
                >
                  ({block.category})
                </span>
              </h3>
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                {block.component && (
                  <Suspense fallback={<div>Loading block...</div>}>
                    <block.component />
                  </Suspense>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>📊 Local Registry</h2>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0" }}>
            Local registry contains metadata for {localRegistry.length} blocks:
          </p>
          <ul
            style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.875rem" }}
          >
            {localRegistry.map((block) => (
              <li key={block.id}>
                <strong>{block.name}</strong> ({block.category}) -{" "}
                {block.files.length} files
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>🌐 External Registry (Discoverable)</h2>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#eff6ff",
            borderRadius: "8px",
            border: "1px solid #3b82f6",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0" }}>
            External registry imported from{" "}
            <code
              style={{
                backgroundColor: "#dbeafe",
                padding: "0.125rem 0.25rem",
                borderRadius: "0.25rem",
              }}
            >
              virtual:@nui/docs
            </code>{" "}
            ({externalRegistry.length} blocks available):
          </p>
          <ul
            style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.875rem" }}
          >
            {externalRegistry.map((block) => (
              <li key={block.id}>
                <strong>{block.name}</strong> ({block.category}) -{" "}
                {block.files.length} files
                <br />
                <code
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    backgroundColor: "#f3f4f6",
                    padding: "0.125rem 0.25rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  nui-blocks add {block.id}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0" }}>💡 Architecture</h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.875rem" }}>
          <li>
            <strong>Local blocks ({localBlocks.length}):</strong> Imported
            directly from <code>virtual:@nui/blocks-consumer</code> and rendered
            in the UI
          </li>
          <li>
            <strong>External registry ({externalRegistry.length}):</strong>{" "}
            Imported from <code>virtual:@nui/docs</code> for discovery
          </li>
          <li>
            <strong>Workflow:</strong>
            <ul style={{ marginTop: "0.5rem" }}>
              <li>
                <strong>Internal blocks:</strong> Create in{" "}
                <code>src/blocks/</code> → auto-available in{" "}
                <code>virtual:@nui/blocks-consumer</code> → import & use
                directly
              </li>
              <li>
                <strong>External blocks:</strong> Import registry → discover
                blocks → copy via CLI (future) → becomes internal
              </li>
            </ul>
          </li>
          <li>
            <strong>Benefits:</strong> Direct imports for internal blocks, no
            runtime dependencies for external blocks, full code ownership
          </li>
        </ul>
      </div>
    </div>
  );
}
