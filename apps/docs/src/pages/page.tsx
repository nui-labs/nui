import { Hero } from "../components/layout/hero";

const Blocks = () => {
  return (
    <main className="py-4">
      <div className="flex flex-col">
        <Hero
          title="Build your products Smarter."
          description="Open-source React UI library that gives you the foundation to
              create consistent, top-tier digital experiences efficiently."
          actions={[
            { label: "Get Started" },
            { label: "Explore Components", variant: "ghost" },
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
