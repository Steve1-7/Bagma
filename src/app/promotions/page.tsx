import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Tag, Calendar } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .gte('start_date', new Date().toISOString().split('T')[0])
    .lte('end_date', new Date().toISOString().split('T')[0])
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-red/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Specials & Promotions
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Don&apos;t miss out on our latest deals and exclusive offers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {promotions && promotions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <Card
                key={promotion.id}
                variant="premium"
                className="overflow-hidden group"
              >
                {promotion.image_url && (
                  <div className="aspect-[16/9] bg-charcoal relative overflow-hidden">
                    <img
                      src={promotion.image_url}
                      alt={promotion.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {promotion.featured && (
                      <Badge variant="gold" className="absolute top-4 right-4">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-red" />
                    <span className="text-red text-sm font-semibold">
                      {promotion.discount_percentage
                        ? `${promotion.discount_percentage}% OFF`
                        : 'SPECIAL OFFER'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {promotion.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {promotion.description}
                  </p>
                  {promotion.price && (
                    <div className="text-2xl font-bold text-gold mb-4">
                      R{promotion.price}
                    </div>
                  )}
                  <div className="flex items-center text-white/60 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                  </div>
                  {promotion.cta_link && (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={promotion.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {promotion.cta_text || 'Get This Deal'}
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No active promotions
            </h3>
            <p className="text-white/60 mb-6">
              New Bagma specials are coming soon. Check back later!
            </p>
            <Button variant="outline" asChild>
              <Link href="/order">Browse Food</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
