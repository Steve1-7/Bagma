import { createClient } from '@/lib/supabase/server';
import { Image as ImageIcon } from 'lucide-react';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  const categories = ['food', 'carwash', 'venue', 'events', 'lifestyle'] as const;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gold/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore the Bagma Lifestyle experience through our gallery
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-square bg-charcoal relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title && (
                      <div className="text-white font-semibold text-sm mb-1">
                        {item.title}
                      </div>
                    )}
                    <Badge variant="default" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Gallery coming soon
            </h3>
            <p className="text-white/60">
              We&apos;re currently curating our gallery. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
