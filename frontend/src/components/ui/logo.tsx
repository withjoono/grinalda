'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href='/'
      className={cn(
        'relative z-20 flex items-center text-sm font-normal text-black',
        className
      )}
    >
      <img src='/images/logo.webp' alt='logo' className='w-20' />
    </Link>
  );
};
