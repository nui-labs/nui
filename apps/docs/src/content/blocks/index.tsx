"use client";

import { useState } from "react";
import { blocks } from "virtual:blocks";
import type { Block } from "@nui/vite-plugin-docs";

import { BlockDetail } from "../../components/blocks";
import { BlocksInfiniteGrid } from "../../components/blocks/blocks-infinite-grid";
import { Hero } from "../../components/layout/hero";

const Blocks = () => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
  };

  const handleBack = () => {
    setSelectedBlock(null);
  };

  const handleCopyCode = (block: Block) => {
    // Create a combined code string from all files
    const allCode = block.files
      .map((file) => `// ${file.path}\n${file.content}`)
      .join("\n\n" + "=".repeat(50) + "\n\n");

    navigator.clipboard.writeText(allCode).then(() => {
      // You could add a toast notification here
      console.log("Code copied to clipboard");
    });
  };

  if (selectedBlock) {
    return (
      <main className="py-4">
        <BlockDetail
          block={selectedBlock}
          onBack={handleBack}
          onCopyCode={handleCopyCode}
        />
      </main>
    );
  }

  return (
    <main className="py-4">
      <div className="flex flex-col">
        <Hero
          title="Build Faster. Stay Consistent."
          description="Clean, consistent building blocks you can drop into your apps. Move faster and ship with confidence."
          actions={[
            { label: "Browse Blocks" },
            { label: "Add a block", variant: "ghost" },
          ]}
        />

        <BlocksInfiniteGrid blocks={blocks} onBlockSelect={handleBlockSelect} />
      </div>
    </main>
  );
};

export default Blocks;
