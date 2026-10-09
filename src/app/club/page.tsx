import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#100d0c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,6,0,0.28),transparent_30%),linear-gradient(135deg,#070707_0%,#140b09_52%,#1b0f0f_100%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Bagmaa club</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.05em] sm:text-7xl">Coming soon</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/65">
            A new layer of nightlife, culture and connection is in the works. Watch this space for Bagmaa Club experiences, sound and moments that keep the night moving.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
