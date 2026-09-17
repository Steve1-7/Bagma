import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Car, Clock, Shield, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default async function CarwashPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from('carwash_services')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  const { data: featuredServices } = await supabase
    .from('carwash_services')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .order('sort_order');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-fire-orange/20 to-charcoal py-16 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium Carwash Services
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Keep your ride looking its best with our professional carwash services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-fire-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-fire-orange" />
            </div>
            <h3 className="text-white font-semibold mb-2">All Vehicles</h3>
            <p className="text-white/60 text-sm">
              Cars, SUVs, bakkies & more
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-fire-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-fire-orange" />
            </div>
            <h3 className="text-white font-semibold mb-2">Quick Service</h3>
            <p className="text-white/60 text-sm">
              Fast & efficient washing
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-fire-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-fire-orange" />
            </div>
            <h3 className="text-white font-semibold mb-2">Quality Care</h3>
            <p className="text-white/60 text-sm">
              Professional products
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-fire-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-fire-orange" />
            </div>
            <h3 className="text-white font-semibold mb-2">Satisfaction</h3>
            <p className="text-white/60 text-sm">
              Guaranteed results
            </p>
          </Card>
        </div>

        {/* Featured Services */}
        {featuredServices && featuredServices.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Packages</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Card
                  key={service.id}
                  variant="premium"
                  className="p-6 border-2 border-fire-orange/50"
                >
                  {service.image_url && <img src={service.image_url} alt={service.name} className="mb-4 aspect-video w-full object-cover" />}<div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <div className="text-2xl font-bold text-gold">R{service.base_price}</div>
                  </div>
                  <p className="text-white/60 mb-4">{service.description}</p>
                  <div className="flex items-center text-white/80 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.duration_minutes} minutes
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/carwash/book">Book Now</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Services */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <Card key={service.id} className="p-6 hover:border-fire-orange/50 transition-colors">
                {service.image_url && <img src={service.image_url} alt={service.name} className="mb-4 aspect-video w-full object-cover" />}<div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <div className="text-2xl font-bold text-gold">R{service.base_price}</div>
                </div>
                <p className="text-white/60 mb-4">{service.description}</p>
                <div className="flex items-center text-white/80 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  {service.duration_minutes} minutes
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/carwash/book">Book Now</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="bg-charcoal/50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to book your wash?
          </h2>
          <p className="text-white/60 mb-8">
            Choose your vehicle, select a service, and book your slot in minutes.
          </p>
          <Button size="lg" asChild>
            <Link href="/carwash/book">Book a Carwash</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
