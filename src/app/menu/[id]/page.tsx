import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Utensils, ShoppingCart } from 'lucide-react';
import { notFound } from 'next/navigation';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import MenuItemCard from '@/components/food/menu-item-card';

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Try to fetch as category first
  const { data: category } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (category) {
    // It's a category - show category page
    const { data: items } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', id)
      .eq('available', true)
      .order('sort_order');

    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-red/20 to-charcoal py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/order"
              className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/60 text-lg max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {items && items.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/order/${item.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden h-full group-hover:border-red/50 transition-colors">
                    {item.image_url && (
                      <div className="aspect-[4/3] bg-charcoal relative overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.promotional_price && (
                          <Badge variant="danger" className="absolute top-4 right-4">
                            Special
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gold">
                          {item.promotional_price ? (
                            <>
                              <span className="line-through text-white/40 mr-2">
                                R{item.price}
                              </span>
                              R{item.promotional_price}
                            </>
                          ) : (
                            `R${item.price}`
                          )}
                        </div>
                        <div className="text-red text-sm font-semibold group-hover:underline">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Utensils className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No items available
              </h3>
              <p className="text-white/60">
                Check back soon for new additions to this category.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Try to fetch as menu item
  const { data: item } = await supabase
    .from('menu_items')
    .select('*, menu_categories(name, id)')
    .eq('id', id)
    .eq('available', true)
    .single();

  const { data: extras } = await supabase
    .from('menu_item_extras')
    .select('*')
    .eq('menu_item_id', id)
    .eq('available', true)
    .order('sort_order');

  if (item) {
    // It's a menu item - show item page
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-red/20 to-charcoal py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/order"
              className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {item.menu_categories?.name}
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{item.menu_categories?.name}</Badge>
              {item.promotional_price && <Badge variant="danger">Special</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {item.name}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              {item.image_url ? (
                <Card className="overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full aspect-square object-cover"
                  />
                </Card>
              ) : (
                <Card className="aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No image available</p>
                  </div>
                </Card>
              )}
            </div>

            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gold mb-2">
                  {item.promotional_price ? (
                    <>
                      <span className="line-through text-white/40 mr-3 text-2xl">
                        R{item.price}
                      </span>
                      R{item.promotional_price}
                    </>
                  ) : (
                    `R${item.price}`
                  )}
                </div>
                {item.promotional_price && (
                  <Badge variant="danger">Save R{item.price - item.promotional_price}</Badge>
                )}
              </div>

              <p className="text-white/80 text-lg mb-8">{item.description}</p>

              {item.dietary_info && item.dietary_info.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-3">Dietary Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.dietary_info.map((info: string) => (
                      <Badge key={info} variant="default">
                        {info}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.preparation_notes && (
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-3">Preparation Notes</h3>
                  <p className="text-white/60">{item.preparation_notes}</p>
                </div>
              )}

              <MenuItemCard item={item} extras={extras || []} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Neither category nor item found
  notFound();
}
