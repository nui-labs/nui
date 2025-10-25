import {
  AspectRatio,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@nui/core";

const slides = [1, 2, 3, 4, 5];

export default function CarouselLooped() {
  return (
    <div className="w-60 sm:w-80 lg:w-96">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <AspectRatio
                ratio={16 / 9}
                className="bg-background rounded-lg border"
              >
                <div className="text-foreground flex size-full items-center justify-center text-xl font-semibold">
                  {slide}
                </div>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
