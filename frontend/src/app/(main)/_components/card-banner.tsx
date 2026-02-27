'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface CardBannerProps {
  banners: {
    id: number;
    imageUrl: string;
    link: string;
  }[];
  delay?: number;
}

export default function CardBanner({ banners, delay }: CardBannerProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: delay || 5000,
      }),
    [delay]
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  return (
    <div className='relative w-full'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin]}
        setApi={setApi}
      >
        <CarouselContent className='-ml-0'>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className='pl-0'>
              <Link href={banner.link}>
                <div className='relative overflow-hidden'>
                  <img
                    src={banner.imageUrl}
                    alt={`card-banner-${banner.id}`}
                    className='h-auto min-h-[160px] w-full rounded-md object-cover md:min-h-full'
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 좌우 인디케이터 */}
        <CarouselPrevious className='left-4 hidden h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 md:flex' />
        <CarouselNext className='right-4 hidden h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 md:flex' />
      </Carousel>

      {/* 하단 인디케이터 */}
      {/* <div className='absolute bottom-2 left-1/2 z-10 -translate-x-1/2'>
        <div className='hidden rounded-full bg-black/20 px-4 py-2 backdrop-blur-md md:flex'>
          <div className='flex gap-1.5'>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
