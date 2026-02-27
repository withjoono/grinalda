'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: '_blank';
};

export function NavBarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-11 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
        (active || pathname?.includes(href)) && 'bg-gray-100 text-black',
        className
      )}
      target={target}
    >
      <p>{children}</p>
    </Link>
  );
}
