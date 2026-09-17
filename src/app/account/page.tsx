import Link from 'next/link';
import { ArrowRight, Car, Heart, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import Button from '@/components/ui/button';

const accountLinks = [
  { title: 'Orders', detail: 'Track orders and reorder favourites.', href: '/track-order', icon: ShoppingBag },
  { title: 'Carwash', detail: 'Manage your next clean ride.', href: '/carwash', icon: Car },
  { title: 'Favourites', detail: 'Your saved Bagma picks will live here.', href: '/menu', icon: Heart },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-gold"><UserRound className="h-4 w-4" /> My Bagma</p>
          <h1 className="text-6xl font-black uppercase leading-[.86] tracking-tight sm:text-8xl">Your Bagma<br /><span className="text-red">story starts here.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60">Sign-in, rewards and personalised history are being prepared. You can still browse, order and book without an account.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><Link href="/order">Start an order <ArrowRight className="ml-2 h-5 w-5" /></Link></Button><Button size="lg" variant="outline" asChild><Link href="/carwash">Book carwash</Link></Button></div>
        </div>

        <div className="mt-20 grid gap-3 md:grid-cols-3">
          {accountLinks.map(({ title, detail, href, icon: Icon }) => (
            <Link key={title} href={href} className="group border border-white/10 bg-charcoal/60 p-6 transition-colors hover:border-gold/60">
              <Icon className="h-6 w-6 text-gold" />
              <h2 className="mt-12 text-3xl font-black uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{detail}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 border border-white/10 bg-[#130d0b] p-6 text-sm text-white/55"><Sparkles className="h-5 w-5 shrink-0 text-fire-orange" /> Rewards and membership will launch when the Bagma programme is confirmed.</div>
      </div>
    </div>
  );
}
