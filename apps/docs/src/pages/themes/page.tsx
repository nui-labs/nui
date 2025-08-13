import { Hero } from "../../components/layout/hero";
import { CardsGrid } from "./cards-grid";

const Themes = () => {
  return (
    <main className="py-4">
      <div className="flex flex-col">
        <Hero
          title="Craft Themes. Stay Branded."
          description="Ready-to-use themes you can customize to match your brand. Save time and stay in control of your design."
        />
        <CardsGrid />
      </div>
    </main>
  );
};

export default Themes;
