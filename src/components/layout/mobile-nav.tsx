'use client';

import Link from 'next/link';
import { Home, Utensils, Car, Calendar, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Order', href: '/order', icon: Utensils },
    { name: 'Carwash', href: '/carwash', icon: Car },
    { name: 'Events', href: '/events', icon: Calendar },
    {
      name: 'Account',
      href: '/account',
      icon: UserRound,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-t border-charcoal/50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 px-3 py-2 transition-all duration-200',
                isActive
                  ? 'text-red'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
