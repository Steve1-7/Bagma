import Link from 'next/link';
import { Utensils, Car, Music, Heart, Target, Award } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gold/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Bagma Lifestyle
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Our story, our vision, and our commitment to excellence
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Bagma Lifestyle was born from a passion for bringing people together through great food, exceptional service, and unforgettable experiences. What started as a simple chisanyama has grown into a premier lifestyle destination that celebrates South African culture and hospitality.
              </p>
              <p className="text-white/80 leading-relaxed">
                Our journey began with a vision to create a space where families and friends could gather, enjoy authentic flavours, and create lasting memories. Today, we continue to honour that vision by delivering excellence in every aspect of our business.
              </p>
            </div>
            <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-red/20 to-charcoal">
              <Heart className="w-24 h-24 text-red/50" />
            </Card>
          </div>
        </section>

        {/* Our Vision & Mission */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">
                To be the leading lifestyle destination in South Africa, known for exceptional food, premium services, and creating memorable experiences that bring communities together.
              </p>
            </Card>
            <Card className="p-8">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To deliver excellence in everything we do – from the quality of our food and carwash services to the warmth of our hospitality – ensuring every customer leaves with a smile.
              </p>
            </Card>
          </div>
        </section>

        {/* Three Experiences */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Three Experiences. One Destination.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Food</h3>
              <p className="text-white/60">
                Authentic South African chisanyama prepared with love and the finest ingredients. From traditional braai to modern favourites, every dish tells a story.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-fire-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-fire-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Clean</h3>
              <p className="text-white/60">
                Premium carwash services that treat your vehicle with the care it deserves. From basic washes to full detailing, we keep your ride looking its best.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Vibe</h3>
              <p className="text-white/60">
                Good music, great atmosphere, and unforgettable experiences. Join us for events, entertainment, and moments that become memories.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="p-12 bg-gradient-to-br from-red/20 to-charcoal">
            <h2 className="text-3xl font-bold text-white mb-4">
              Experience Bagma Lifestyle
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Join us for great food, premium services, and unforgettable experiences. We can&apos;t wait to welcome you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/order">Order Food</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/carwash">Book a Wash</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/events">See Events</Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
