'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';
import Navbar from '@/components/layout/navbar';

export default function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={`flex-1 ${isAdminRoute ? '' : 'pt-20 pb-16 md:pb-0'}`}>
        {children}
      </main>
      {!isAdminRoute && (
        <>
          <Footer />
          <MobileNav />
        </>
      )}
    </>
  );
}
