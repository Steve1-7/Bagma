import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Music, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/utils';
import TicketPurchase from '@/components/events/ticket-purchase';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!event) {
    notFound();
  }

  const { data: ticketsSold } = await supabase.rpc('tickets_sold_for_event', { target_event_id: event.id });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gold/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="gold">{event.status === 'completed' ? 'Past Event' : 'Upcoming Event'}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            {event.image_url && (
              <Card className="overflow-hidden mb-8">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full aspect-video object-cover"
                />
              </Card>
            )}

            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-white/80 leading-relaxed">{event.description}</p>
            </Card>

            {/* Event Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Date & Time</div>
                    <div className="text-white/60">
                      {formatDate(event.event_date)} at {formatTime(event.event_time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Location</div>
                    <div className="text-white/60">{event.location}</div>
                  </div>
                </div>
                {event.entertainment && (
                  <div className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Entertainment</div>
                      <div className="text-white/60">{event.entertainment}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {event.ticket_price !== null && (
              <div className="mt-8">
                <TicketPurchase
                  eventId={event.id}
                  eventTitle={event.title}
                  ticketPrice={Number(event.ticket_price)}
                  ticketCapacity={event.ticket_capacity}
                  ticketsSold={Number(ticketsSold || 0)}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Join Us</h2>

              {event.rsvp_link && (
                <Button size="lg" className="w-full mb-3" asChild>
                  <a href={event.rsvp_link} target="_blank" rel="noopener noreferrer">
                    RSVP Now
                  </a>
                </Button>
              )}

              {event.ticket_link && (
                <Button variant="outline" size="lg" className="w-full mb-6" asChild>
                  <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Tickets
                  </a>
                </Button>
              )}

              <div className="bg-charcoal/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Share This Event</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check out this event at Bagma Lifestyle: ${event.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Share on WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <a
                      href="https://www.facebook.com/sharer/sharer.php"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Share on Facebook
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm mb-3">
                  Have questions about this event?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Us
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
