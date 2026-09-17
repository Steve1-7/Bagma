'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual contact form submission with Supabase
      await new Promise((resolve) => setTimeout(resolve, 2000));

      success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-red/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Get in touch with Bagma Lifestyle. We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Name *
                  </label>
                  <Input
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    required
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    required
                    placeholder="Your message..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Address</h3>
                    <p className="text-white/60">
                      Bagma Lifestyle, Coordinates: 23°05&apos;57.1&quot;S 29°42&apos;42.0&quot;E
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <a
                      href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+27660290449'}`}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+27660290449'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@bagma.co.za'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Opening Hours</h3>
                    <p className="text-white/60">
                      Mon - Sun: 9:00 AM - 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-white font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card className="p-6">
              <h3 className="text-white font-semibold mb-4">Find Us</h3>
              <div className="aspect-video bg-charcoal/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">
                    Google Maps integration coming soon
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <a
                  href="https://maps.google.com/?q=-23.099194,29.711667"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
