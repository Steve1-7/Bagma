'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CakeSlice,
  CheckCircle2,
  Gift,
  Heart,
  PartyPopper,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const occasions = [
  {
    title: 'Business Meetings',
    description: 'Professional meetings in an elevated environment.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    icon: Briefcase,
  },
  {
    title: 'Baby Showers',
    description: 'Celebrate the arrival of something beautiful.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    icon: Gift,
  },
  {
    title: 'Birthday Parties',
    description: 'Turn another year into an experience.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    icon: CakeSlice,
  },
  {
    title: 'Engagement Parties',
    description: 'Celebrate the beginning of something unforgettable.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    icon: Heart,
  },
  {
    title: 'Anniversaries',
    description: 'Mark the moments that deserve to be remembered.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    icon: Sparkles,
  },
  {
    title: 'Private Celebrations',
    description: 'For everything else worth bringing people together for.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    icon: Users,
  },
];

type RooftopPost = {
  id: string;
  occasion_type: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  poster_url: string | null;
  ticket_price: number | null;
  ticket_capacity: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const defaultForm = {
  eventType: '',
  preferredDate: '',
  preferredTime: '',
  numberOfGuests: '',
  eventDuration: '',
  seatingRequirements: '',
  cateringRequirements: '',
  decorRequirements: '',
  entertainmentRequirements: '',
  equipmentRequirements: '',
  specialRequests: '',
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
};

export default function RooftopPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [rooftopPosts, setRooftopPosts] = useState<RooftopPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<RooftopPost | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('rooftop_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (fetchError) {
        console.error('Error fetching rooftop posts:', fetchError);
      } else {
        setRooftopPosts(data || []);
      }
    }
    fetchPosts();
  }, []);

  const handleOccasionClick = (occasionTitle: string) => {
    const postsForOccasion = getPostsForOccasion(occasionTitle);
    const primaryPost = postsForOccasion[0] ?? null;

    if (primaryPost) {
      setSelectedPost(primaryPost);
      setSelectedOccasion(null);
      return;
    }

    setSelectedOccasion(occasionTitle);
    setSelectedPost(null);
    setFormData((prev) => ({ ...prev, eventType: occasionTitle }));
  };

  const getPostsForOccasion = (occasionTitle: string) => {
    return rooftopPosts.filter((p) => p.occasion_type === occasionTitle);
  };

  const selectedOccasionDetails = selectedOccasion
    ? occasions.find((occasion) => occasion.title === selectedOccasion) ?? null
    : null;

  const selectedOccasionPosts = selectedOccasion ? getPostsForOccasion(selectedOccasion) : [];
  const selectedOccasionHighlights =
    selectedOccasionPosts.length > 0
      ? selectedOccasionPosts.slice(0, 3).map((post) => ({
          title: post.title,
          description: post.description,
          image: post.image_url ?? selectedOccasionDetails?.image ?? null,
        }))
      : [
          {
            title: `${selectedOccasion} styling`,
            description: 'Tailored ambience, premium hospitality and a guest experience designed around the tone of your moment.',
            image: selectedOccasionDetails?.image ?? null,
          },
          {
            title: 'Guest experience flow',
            description: 'Seamless hosting, curated food and beverage touches, and a clear plan for every stage of the occasion.',
            image: selectedOccasionDetails?.image ?? null,
          },
          {
            title: 'Signature details',
            description: 'Bespoke décor, lighting, sound and service layered together to make the event feel unmistakably yours.',
            image: selectedOccasionDetails?.image ?? null,
          },
        ];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      if (!formData.eventType || !formData.fullName || !formData.email || !formData.phone) {
        throw new Error('Please complete the required event and customer details.');
      }

      const { error: insertError } = await supabase.from('rooftop_experience_requests').insert({
        event_type: formData.eventType,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        guest_count: formData.numberOfGuests ? Number(formData.numberOfGuests) : null,
        event_duration: formData.eventDuration || null,
        seating_requirements: formData.seatingRequirements || null,
        catering_requirements: formData.cateringRequirements || null,
        decor_requirements: formData.decorRequirements || null,
        entertainment_requirements: formData.entertainmentRequirements || null,
        equipment_requirements: formData.equipmentRequirements || null,
        special_requests: formData.specialRequests || null,
        customer_name: formData.fullName.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        company_name: formData.companyName.trim() || null,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormData(defaultForm);
      success('Request received. The Bagma team will review your experience request and get back to you.');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to send your request right now.';
      error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.42),transparent_24%),linear-gradient(115deg,#050505_0%,#120d0b_42%,#270f0d_100%)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gold">Bagma lifestyle · rooftop</p>
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
              Bagmaa Rooftop Experience
            </h1>
            <p className="mt-6 text-2xl font-black uppercase tracking-tight text-gold sm:text-4xl">
              Your occasion. Elevated.
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              From intimate business meetings to unforgettable celebrations, the Bagmaa Rooftop Experience gives you an elevated setting for moments worth remembering.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="#enquire">
                  Plan your experience <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#occasions">View occasions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="occasions" className="border-b border-white/10 bg-charcoal px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold">Rooftop occasions</p>
            <h2 className="text-4xl font-black uppercase leading-none sm:text-6xl">Moments worth remembering.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {occasions.map(({ title, description, image, icon: Icon }) => {
              const posts = getPostsForOccasion(title);
              return (
                <article
                  key={title}
                  onClick={() => handleOccasionClick(title)}
                  className="group cursor-pointer overflow-hidden border border-white/10 bg-black/20 transition-all duration-300 hover:border-gold/40 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-black/40 text-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">{title}</span>
                    </div>
                    {posts.length > 0 && (
                      <div className="absolute top-4 right-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-black">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black uppercase leading-tight text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                      {posts.length > 0 ? 'View details' : 'Tailored hosting'} <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-10">
          <div className="mx-auto max-w-4xl border border-white/15 bg-charcoal p-5 sm:p-8">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{selectedPost.occasion_type}</p>
                <h2 className="mt-2 text-3xl font-black uppercase">{selectedPost.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label="Close details"
                className="text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </header>
            <div className="mt-6">
              {selectedPost.image_url && (
                <img src={selectedPost.image_url} alt={selectedPost.title} className="h-64 w-full object-cover" />
              )}
              <div className="mt-6 space-y-4">
                <p className="text-lg leading-relaxed text-white/80">{selectedPost.description}</p>
                {(selectedPost.ticket_price || selectedPost.ticket_capacity) && (
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    {selectedPost.ticket_price && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gold">Ticket price</p>
                        <p className="mt-1 text-2xl font-black">R{selectedPost.ticket_price}</p>
                      </div>
                    )}
                    {selectedPost.ticket_capacity && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gold">Capacity</p>
                        <p className="mt-1 text-2xl font-black">{selectedPost.ticket_capacity} guests</p>
                      </div>
                    )}
                  </div>
                )}
                {selectedPost.poster_url && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-gold">Event poster</p>
                    <img src={selectedPost.poster_url} alt="Event poster" className="mt-2 h-auto w-full max-w-md" />
                  </div>
                )}
              </div>
              <div className="mt-8 flex gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, eventType: selectedPost.occasion_type }));
                    setSelectedPost(null);
                    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1"
                >
                  Book this experience <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setSelectedPost(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOccasion && (
        <div className="border-b border-white/10 bg-[#120d0d] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{selectedOccasion}</p>
                <h3 className="mt-2 text-3xl font-black uppercase">Tailored hosting for {selectedOccasion.toLowerCase()}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOccasion(null)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition hover:border-gold/60 hover:text-gold"
              >
                Close
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {selectedOccasionHighlights.map((item) => (
                <div key={item.title} className="overflow-hidden border border-white/10 bg-charcoal/60">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                  )}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Curated experience</p>
                    <h4 className="mt-3 text-xl font-black uppercase text-white">{item.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, eventType: selectedOccasion }));
                  document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Enquire about {selectedOccasion} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <section id="enquire" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red">Plan your experience</p>
                <h2 className="text-4xl font-black uppercase leading-none sm:text-6xl">Bring your idea to the roof.</h2>
              </div>

              <div className="border border-white/10 bg-[#110d0d] p-6">
                <p className="text-lg font-bold uppercase tracking-[0.18em] text-gold">Why Bagmaa Rooftop</p>
                <ul className="mt-6 space-y-4 text-sm text-white/65">
                  {[
                    'Premium atmosphere for business and celebration',
                    'Flexible hosting for intimate or high-energy gatherings',
                    'A polished setting designed for memorable moments',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-white/10 bg-charcoal/60 p-5 sm:p-8">
              {submitted ? (
                <div className="rounded-xl border border-gold/40 bg-gold/5 p-8 text-center">
                  <PartyPopper className="mx-auto h-12 w-12 text-gold" />
                  <h3 className="mt-6 text-3xl font-black uppercase">Request received</h3>
                  <p className="mt-4 text-base leading-relaxed text-white/65">
                    Thank you. The Bagma team will review your experience request and get back to you.
                  </p>
                  <Button className="mt-8" asChild>
                    <Link href="/rooftop">Back to rooftop</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase">Event details</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-white/75">
                      Event type
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        className="mt-2 w-full rounded-lg border border-white/15 bg-background px-4 py-3 text-white focus:border-red focus:outline-none"
                      >
                        <option value="">Select</option>
                        <option value="Business Meeting">Business Meeting</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Engagement Party">Engagement Party</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Private Celebration">Private Celebration</option>
                      </select>
                    </label>

                    <label className="block text-sm font-medium text-white/75">
                      Preferred date
                      <Input
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75">
                      Preferred time
                      <Input
                        name="preferredTime"
                        type="time"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75">
                      Number of guests
                      <Input
                        name="numberOfGuests"
                        type="number"
                        min="1"
                        value={formData.numberOfGuests}
                        onChange={handleChange}
                        placeholder="e.g. 40"
                        className="mt-2"
                      />
                    </label>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/75">
                        Event duration
                        <Input
                          name="eventDuration"
                          type="text"
                          value={formData.eventDuration}
                          onChange={handleChange}
                          placeholder="e.g. 3 hours"
                          className="mt-2"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-black uppercase">Event requirements</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-white/75 md:col-span-1">
                      Seating requirements
                      <Input
                        name="seatingRequirements"
                        value={formData.seatingRequirements}
                        onChange={handleChange}
                        placeholder="Boardroom, lounge, cocktail style"
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75 md:col-span-1">
                      Catering requirements
                      <Input
                        name="cateringRequirements"
                        value={formData.cateringRequirements}
                        onChange={handleChange}
                        placeholder="Canapé menu, plated dinner, drinks"
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75 md:col-span-1">
                      Décor requirements
                      <Input
                        name="decorRequirements"
                        value={formData.decorRequirements}
                        onChange={handleChange}
                        placeholder="Minimal, floral, branded"
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75 md:col-span-1">
                      Entertainment requirements
                      <Input
                        name="entertainmentRequirements"
                        value={formData.entertainmentRequirements}
                        onChange={handleChange}
                        placeholder="DJ, acoustic set, speaker"
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75 md:col-span-1">
                      Equipment requirements
                      <Input
                        name="equipmentRequirements"
                        value={formData.equipmentRequirements}
                        onChange={handleChange}
                        placeholder="Projector, microphone, lighting"
                        className="mt-2"
                      />
                    </label>

                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-black uppercase">Customer details</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-white/75 md:col-span-2">
                      Full name
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75">
                      Email
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75">
                      Phone number
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+27 00 000 0000"
                        required
                        className="mt-2"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/75 md:col-span-2">
                      Company name (optional)
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your company or organisation"
                        className="mt-2"
                      />
                    </label>
                  </div>

                  <Textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Tell us more about your event idea, atmosphere, guest experience or must-haves."
                    rows={5}
                    className="mt-2"
                  />

                  <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                    {loading ? 'Sending request...' : 'Submit experience request'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
