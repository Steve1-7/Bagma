import Link from 'next/link';
import Image from 'next/image';
import { Share2, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-charcoal/50 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  src="/logo5.png"
                  alt="Bagma Lifestyle logo"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">
                  BAGMA LIFESTYLE
                </div>
                <div className="text-white/60 text-xs uppercase tracking-wider">
                  Chisanyama & Carwash
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Your destination for great food, premium carwash services and
              unforgettable experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Order Food
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Order
                </Link>
              </li>
              <li>
                <Link
                  href="/carwash"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Carwash
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Business</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">
                  {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ||
                    'Bagma Lifestyle, Coordinates: 23°05\'57.1"S 29°42\'42.0"E'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red flex-shrink-0" />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+27 XX XXX XXXX'}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red flex-shrink-0" />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@bagma.co.za'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
                <div className="text-white/60 text-sm">
                  <div>Mon - Sun: 9:00 AM - 9:00 PM</div>
                  <div className="text-xs text-white/40 mt-1">
                    (Hours to be configured)
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal/50 text-center">
          <p className="text-white/40 text-sm">
            © {currentYear} Bagma Lifestyle. All rights reserved.
          </p>
          <a
            href="https://www.eva-tech-studio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block px-2 py-1 text-xs font-semibold text-white/60 transition-colors hover:text-gold"
          >
            Powered by Eva-Tech-Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
