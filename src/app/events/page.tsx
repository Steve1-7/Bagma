import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Calendar, MapPin, Music } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/utils';
import type { Event as BagmaEvent } from '@/types';

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('event_date');

  const upcoming = (events || []).filter((event) => event.status === 'upcoming' && event.event_date >= new Date().toISOString().split('T')[0]);
  const past = (events || []).filter((event) => event.status === 'completed' || event.event_date < new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gold/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Events & Entertainment
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Good food. Great music. Better memories. Discover what&apos;s happening at Bagma.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {eventsError ? (
          <div className="border border-red/40 bg-red/10 p-10 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-red/70" />
            <h3 className="text-xl font-semibold text-white">Events are temporarily unavailable</h3>
            <p className="mt-2 text-white/60">Please check back shortly for what&apos;s happening at Bagma.</p>
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-16">
            <EventGroup title="Upcoming Events" events={upcoming} empty="No upcoming events at the moment." />
            <EventGroup title="Past Events" events={past} empty="No past events yet." />
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No events have been published yet</h3>
            <p className="text-white/60 mb-6">Check back soon for new events.</p>
            <Button variant="outline" asChild><Link href="/">Back to Home</Link></Button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventGroup({ title, events, empty }: { title: string; events: BagmaEvent[]; empty: string }) {
  return <section><div className="mb-6 flex items-center justify-between"><h2 className="text-3xl font-black uppercase text-white">{title}</h2><span className="text-sm text-white/45">{events.length}</span></div>{events.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="group">
                <Card className="overflow-hidden h-full group-hover:border-gold/50 transition-colors">
                  {event.image_url && (
                    <div className="aspect-[16/9] bg-charcoal relative overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="gold">{event.status === 'completed' ? 'Past event' : 'Upcoming'}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-white/80">
                        <Calendar className="w-4 h-4 mr-2 text-gold" />
                        {formatDate(event.event_date)} at {formatTime(event.event_time)}
                      </div>
                      <div className="flex items-center text-white/80">
                        <MapPin className="w-4 h-4 mr-2 text-gold" />
                        {event.location}
                      </div>
                      {event.entertainment && (
                        <div className="flex items-center text-white/80">
                          <Music className="w-4 h-4 mr-2 text-gold" />
                          {event.entertainment}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}</div> : <p className="border border-dashed border-white/15 p-8 text-center text-white/50">{empty}</p>}</section>;
}
