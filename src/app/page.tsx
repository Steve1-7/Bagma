import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronDown,
  CircleArrowOutUpRight,
  Flame,
  MessageCircle,
  Utensils,
} from 'lucide-react';
import Button from '@/components/ui/button';

const worlds = [
  { number: '01', eyebrow: 'Chisanyama', title: 'I’m here to eat', description: 'Fire, flavour and plates made for passing around.', href: '/menu', icon: Utensils, accent: 'text-red', wash: 'from-red/20' },
  { number: '02', eyebrow: 'Carwash', title: 'I’m here to get clean', description: 'A proper reset for your ride while you take a breather.', href: '/carwash', icon: Car, accent: 'text-fire-orange', wash: 'from-fire-orange/20' },
  { number: '03', eyebrow: 'Lifestyle', title: 'I’m here for the vibe', description: 'Good people, live energy and the next reason to come back.', href: '/events', icon: Flame, accent: 'text-gold', wash: 'from-gold/20' },
];

const moments = [
  { index: '01', title: 'Food with a pulse', detail: 'Chisanyama built around the fire, the table and the people at it.', href: '/menu' },
  { index: '02', title: 'A cleaner kind of pause', detail: 'Your car gets the treatment. You get time to slow down.', href: '/carwash' },
  { index: '03', title: 'Always something happening', detail: 'Events, music and shared moments that make the week feel bigger.', href: '/events' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#17100d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(225,6,0,.42),transparent_28%),linear-gradient(115deg,#050505_0%,#0d0d0d_48%,#28100a_100%)]" />
        <div className="absolute right-[-8%] top-24 hidden h-130 w-130 rounded-full border border-fire-orange/25 lg:block" />
        <div className="absolute right-[4%] top-38 hidden h-100 w-100 rounded-full border border-gold/20 lg:block" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-end gap-12 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-20">
          <div className="max-w-2xl animate-fade-in">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold"><span className="h-px w-10 bg-gold" />Chisanyama &amp; carwash</p>
            <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.05em] sm:text-8xl lg:text-[7.5rem]">Eat.<br /><span className="text-red">Wash.</span><br />Chill.</h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/70 sm:text-xl">One destination for fire-grilled food, clean rides and the moments that turn a visit into a tradition.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><Link href="/order">Order food <ArrowRight className="ml-2 h-5 w-5" /></Link></Button><Button size="lg" variant="outline" asChild><Link href="/carwash">Book carwash</Link></Button></div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-white/45">Bagma Lifestyle <span className="mx-2 text-red">/</span> Eat. Wash. Chill. Repeat.</p>
          </div>
          <div className="relative block min-h-[20rem] w-full max-w-[32rem] lg:min-h-[34rem] lg:max-w-none">
            <div className="absolute inset-x-4 top-6 bottom-0 border border-white/15 bg-black/20 sm:inset-x-8 lg:inset-x-10" />
            <div className="absolute inset-x-0 top-18 bottom-10 bg-[linear-gradient(145deg,transparent_0%,rgba(255,106,0,.2)_48%,rgba(225,6,0,.72)_100%)]" />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8">
              <img
                src="/logo5.png"
                alt="Bagma Lifestyle"
                className="h-full w-full object-cover object-center opacity-90"
              />
            </div>
            <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-[6.5rem] font-black uppercase leading-none tracking-[-0.12em] text-white/10 sm:text-[8rem] lg:bottom-16 lg:left-1/2 lg:text-[10rem] lg:-translate-x-1/2">B</div>
            <div className="absolute right-2 top-10 rotate-90 text-[0.6rem] font-bold uppercase tracking-[0.42em] text-gold sm:text-[0.7rem]">The experience, considered</div>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 px-4 py-4 text-xs uppercase tracking-[0.22em] text-white/45 sm:px-6 lg:px-8"><span>Scroll to explore</span><ChevronDown className="h-4 w-4 text-gold" /></div>
      </section>

      <section className="border-b border-white/10 bg-charcoal px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red">The Bagma command centre</p><h2 className="text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">What are you here for?</h2><p className="mt-5 text-white/55">Start with what brought you in. We’ll take it from there.</p></div><div className="grid gap-3 lg:grid-cols-3">{worlds.map(({ number, eyebrow, title, description, href, icon: Icon, accent, wash }) => <Link key={title} href={href} className={`group relative min-h-72 overflow-hidden border border-white/10 bg-gradient-to-br ${wash} to-transparent p-6 transition-colors hover:border-white/35 sm:p-8`}><div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10 opacity-70 transition-opacity group-hover:opacity-85" /><div className="relative z-10 flex items-start justify-between"><span className={`text-sm font-bold ${accent}`}>{number}</span><Icon className={`h-7 w-7 ${accent}`} /></div><div className="relative z-10 absolute bottom-7 left-6 right-6 sm:left-8 sm:right-8"><p className={`mb-2 text-xs font-bold uppercase tracking-[0.25em] ${accent}`}>{eyebrow}</p><h3 className="text-3xl font-black uppercase leading-none">{title}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{description}</p><span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${accent}`}>Enter <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></Link>)}</div></div></section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold">This is Bagma</p><h2 className="max-w-md text-4xl font-black uppercase leading-[.95] sm:text-6xl">More than a place to go.</h2><p className="mt-6 max-w-sm leading-relaxed text-white/55">Food. Cars. Music. People. Energy. Community. Bagma brings the whole day together, with a little more fire.</p><Link href="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold hover:text-white">Our story <CircleArrowOutUpRight className="h-4 w-4" /></Link></div><div className="divide-y divide-white/10 border-y border-white/10">{moments.map((moment) => <Link key={moment.index} href={moment.href} className="group grid gap-4 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center"><span className="text-sm font-bold text-red">{moment.index}</span><div><h3 className="text-2xl font-bold group-hover:text-gold">{moment.title}</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">{moment.detail}</p></div><ArrowRight className="hidden h-5 w-5 text-gold transition-transform group-hover:translate-x-1 sm:block" /></Link>)}</div></div></section>

      <section className="border-y border-white/10 bg-[#130d0b] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-fire-orange">Bagma Live</p><h2 className="max-w-xl text-4xl font-black uppercase leading-[.95] sm:text-6xl">There’s always a reason to pull up.</h2><p className="mt-6 max-w-lg leading-relaxed text-white/60">Keep an eye on what’s happening at Bagma, from live entertainment to the next big food moment.</p><Button className="mt-8" variant="outline" asChild><Link href="/events">See what&apos;s happening <ArrowRight className="ml-2 h-5 w-5" /></Link></Button></div><div className="border border-gold/25 bg-black/30 p-6 sm:p-8"><div className="flex items-center gap-3 border-b border-white/10 pb-5"><CalendarDays className="h-6 w-6 text-gold" /><p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">What’s on</p></div><div className="py-8"><p className="text-2xl font-bold">New experiences are being lined up.</p><p className="mt-3 text-sm leading-relaxed text-white/50">Event dates and details will appear here as soon as they are confirmed.</p></div><Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white hover:text-gold">Stay in the loop <ArrowRight className="h-4 w-4" /></Link></div></div></section>

      <section className="bg-red px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/70">Your next move</p><h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">Eat. Wash. Chill. Repeat.</h2></div><div className="flex flex-col gap-3 sm:flex-row"><Button variant="secondary" size="lg" asChild><Link href="/order">Order food</Link></Button><Button className="border-white text-white hover:bg-white hover:text-red" variant="outline" size="lg" asChild><Link href="/carwash">Book carwash</Link></Button><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"><MessageCircle className="h-5 w-5" /> WhatsApp</a></div></div></section>
    </div>
  );
}
