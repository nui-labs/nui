"use client";

import { Hero } from "../../components/layout/hero";

const Blocks = () => {
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

        {/* Blocks Grid - Placeholder for now */}
        <div className="flex flex-col gap-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Building blocks coming soon...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blocks;
