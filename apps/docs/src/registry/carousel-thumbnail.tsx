import { useState } from "react";
import {
  AspectRatio,
  Carousel,
  CarouselContent,
  CarouselItem,
  cn,
  type CarouselApi,
} from "@nui/core";

const slides = [
  "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=450&h=800&dpr=2",
  "https://images.pexels.com/photos/1293120/pexels-photo-1293120.jpeg?auto=compress&cs=tinysrgb&w=450&h=800&dpr=2",
  "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=450&h=800&dpr=2",
  "https://images.pexels.com/photos/2011824/pexels-photo-2011824.jpeg?auto=compress&cs=tinysrgb&w=450&h=800&dpr=2",
  "https://images.pexels.com/photos/2471235/pexels-photo-2471235.jpeg?auto=compress&cs=tinysrgb&w=450&h=800&dpr=2",
];

export default function CarouselThumbnail() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  api?.on("select", () => {
    setSelectedIndex(api?.selectedScrollSnap() ?? 0);
  });

  return (
    <div className="w-60">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <AspectRatio
                ratio={16 / 9}
                className="bg-background rounded-lg border"
              >
                <img
                  src={slide}
                  alt="Carousel slide"
                  className="rounded-lg object-cover"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-2 flex w-full items-center justify-between">
          {slides.map((slide, index) => (
            <button
              key={slide}
              type="button"
              className="relative size-10"
              onClick={() => api?.scrollTo(index)}
            >
              <img
                src={slide}
                alt="Carousel slide"
                className={cn(
                  "rounded-md object-cover opacity-60 transition-opacity duration-200 hover:opacity-100",
                  selectedIndex === index && "opacity-100",
                )}
              />
            </button>
          ))}
        </div>
      </Carousel>
    </div>
  );
}
