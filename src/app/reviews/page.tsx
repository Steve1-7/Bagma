'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Badge from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ReviewsPage() {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    review: '',
  });

  // Mock reviews data - in production, fetch from Supabase
  const reviews = [
    {
      id: 1,
      customer_name: 'John D.',
      rating: 5,
      review: 'Amazing food and great atmosphere! The chisanyama is authentic and delicious. Will definitely be coming back.',
      date: '2024-01-15',
    },
    {
      id: 2,
      customer_name: 'Sarah M.',
      rating: 5,
      review: 'Best carwash in town! They paid attention to every detail and my car looked brand new. Highly recommend the full valet.',
      date: '2024-01-10',
    },
    {
      id: 3,
      customer_name: 'Mike K.',
      rating: 4,
      review: 'Great food and friendly service. The only reason for 4 stars is the wait time was a bit long, but definitely worth it!',
      date: '2024-01-05',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual review submission with Supabase
      await new Promise((resolve) => setTimeout(resolve, 2000));

      success('Review submitted! It will be published after approval.');
      setShowForm(false);
      setFormData({ name: '', rating: 5, review: '' });
    } catch {
      error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-gold fill-gold' : 'text-white/20'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gold/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Customer Reviews
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            See what our customers have to say about their Bagma Lifestyle experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overall Rating */}
        <Card className="p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {renderStars(5)}
          </div>
          <div className="text-4xl font-bold text-white mb-2">4.8</div>
          <div className="text-white/60 mb-4">Based on {reviews.length} reviews</div>
          <Button size="lg" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </Card>

        {/* Review Form */}
        {showForm && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Your Name *
                </label>
                <Input
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          rating <= formData.rating
                            ? 'text-gold fill-gold'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Your Review *
                </label>
                <Textarea
                  required
                  placeholder="Share your experience with Bagma Lifestyle..."
                  rows={5}
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                />
              </div>
              <Button size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </Card>
        )}

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {review.customer_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {review.customer_name}
                    </div>
                    <div className="text-white/60 text-sm">{review.date}</div>
                  </div>
                </div>
                <Badge variant="gold">Verified</Badge>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
              </div>
              <p className="text-white/80 leading-relaxed">{review.review}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
