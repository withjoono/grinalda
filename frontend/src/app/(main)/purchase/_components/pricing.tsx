'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import React from 'react';
import { cn, formatPrice, toUrl } from '@/lib/utils';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { Product } from '@/apis/hooks/use-products';

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className='text-center'>
    <h2 className='text-3xl font-bold'>{title}</h2>
    <p className='pt-1 text-xl'>{subtitle}</p>
    <br />
  </section>
);

const PricingCard = ({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) => (
  <Card
    className={cn(
      `flex w-72 flex-col justify-between py-1 ${product.popular ? 'border-rose-400' : 'border-zinc-700'} mx-auto sm:mx-0`
    )}
  >
    <div className='relative'>
      <CardHeader className='pb-8 pt-4'>
        <CardTitle className='text-lg text-zinc-700 dark:text-zinc-300'>
          {product.name}
        </CardTitle>
        {product.popular ? (
          <span className='absolute -top-0.5 right-2 animate-bounce text-sm font-semibold'>
            추천 🔥
          </span>
        ) : null}
        <div className='flex gap-0.5'>
          <h3 className='text-3xl font-bold'>{formatPrice(product.price)}원</h3>
        </div>
        <CardDescription className='h-12 pt-1.5'>
          {product.description}
          <div
            className={cn(
              'mt-1 text-sm',
              product.subTextAccent
                ? 'font-semibold text-red-500'
                : 'text-foreground'
            )}
          >
            {product.subText}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {product.features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className='mt-2 flex flex-col gap-2'>
      {
        <Link
          href={
            product.externalUrl
              ? product.externalUrl
              : toUrl(PageRoutes.PURCHASE_ORDER, { id: product.id.toString() })
          }
          target={product.externalUrl ? '_blank' : '_self'}
          className={cn(
            buttonVariants(),
            'relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black'
          )}
        >
          <div className='absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur' />
          {product.externalUrl ? '예약 결제하기' : '구매하기'}
        </Link>
      }

      {product.externalUrl ? (
        <p className='text-xs'>네이버 예약결제 창으로 이동합니다.</p>
      ) : null}
      {isActive ? (
        <p className='text-xs text-blue-500'>이미 구독중인 기능입니다.</p>
      ) : null}
    </CardFooter>
  </Card>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className='flex gap-2'>
    <CheckCircle2 size={18} className='my-auto text-green-400' />
    <p className='pt-0.5 text-sm text-zinc-700 dark:text-zinc-300'>{text}</p>
  </div>
);

export const Pricing = ({
  plans,
  consultingPlans,
  activeServiceCodes,
}: {
  plans: Product[];
  consultingPlans: Product[];
  activeServiceCodes: string[];
}) => {
  return (
    <div className='py-8'>
      <PricingHeader
        title='그리날다 수시 예측 서비스'
        subtitle='원하시는 평가 서비스를 선택하세요'
      />
      <Tabs defaultValue='0' className='flex flex-col items-center'>
        <TabsList className='mx-auto px-2 py-6'>
          <TabsTrigger value='0' className='text-base'>
            수시 서비스
          </TabsTrigger>
          <TabsTrigger value='1' className='text-base'>
            컨설팅 서비스
          </TabsTrigger>
        </TabsList>
        <TabsContent value='0'>
          <section className='mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap'>
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                product={plan}
                isActive={activeServiceCodes.includes(plan.serviceCode)}
              />
            ))}
          </section>
        </TabsContent>
        <TabsContent value='1'>
          <section className='mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap'>
            {consultingPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                product={plan}
                isActive={activeServiceCodes.includes(plan.serviceCode)}
              />
            ))}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};
