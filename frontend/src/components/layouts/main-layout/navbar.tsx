'use client';

import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';
import { motion } from 'framer-motion';

export function NavBar() {
  return (
    <motion.nav className='container fixed inset-x-0 top-4 z-50 mx-auto w-[95%] max-w-7xl lg:w-full'>
      <div className='hidden w-full lg:block'>
        <DesktopNavbar />
      </div>
      <div className='flex h-full w-full items-center lg:hidden'>
        <MobileNavbar />
      </div>
    </motion.nav>
  );
}
