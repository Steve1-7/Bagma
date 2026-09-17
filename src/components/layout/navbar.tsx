'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Order', href: '/order' },
    { name: 'Carwash', href: '/carwash' },
    { name: 'Events', href: '/events' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-charcoal/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-[76px] w-[112px] shrink-0 sm:h-[82px] sm:w-[128px]">
              <Image
                src="/logo5.png"
                alt="Bagma Lifestyle logo"
                fill
                sizes="(min-width: 640px) 128px, 112px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="primary" size="sm" asChild>
              <Link href="/order">Order Now</Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-charcoal border-t border-charcoal/50">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-charcoal/50 space-y-2">
              <Button variant="outline" size="md" className="w-full" asChild>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="secondary" size="md" className="w-full" asChild>
                <a href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
