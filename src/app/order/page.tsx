import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ShoppingBag, Utensils } from 'lucide-react';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: categories, error: categoriesError } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('sort_order');

  const itemsByCategory = new Map<string, typeof items>();
  for (const item of items || []) {
    const categoryItems = itemsByCategory.get(item.category_id) || [];
    categoryItems.push(item);
    itemsByCategory.set(item.category_id, categoryItems);
  }

  const categoryMap = new Map((categories || []).map((category) => [category.id, category]));
  const visibleCategories = category ? (categories || []).filter((item) => item.id === category) : categories || [];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-red/20 to-charcoal py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Order Food</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Choose your favourites, customise your order, and collect or have it delivered.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/order" className={`border px-4 py-2 text-sm font-semibold transition-colors ${!category ? 'border-red bg-red text-white' : 'border-white/15 bg-charcoal/60 text-white/70 hover:border-red/40 hover:text-white'}`}>
            All categories
          </Link>
          {(categories || []).map((item) => {
            const isSelected = category === item.id;
            return (
              <Link
                key={item.id}
                href={isSelected ? '/order' : `/order?category=${item.id}`}
                className={`border px-4 py-2 text-sm font-semibold transition-colors ${isSelected ? 'border-red bg-red text-white' : 'border-white/15 bg-charcoal/60 text-white/70 hover:border-red/40 hover:text-white'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {(categoriesError || itemsError) && (
          <div className="mb-10 border border-red/40 bg-red/10 p-6">
            <h2 className="text-xl font-bold text-white">The order menu is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-white/60">Please try again shortly or contact Bagma to place an order.</p>
          </div>
        )}

        {visibleCategories && visibleCategories.length > 0 ? visibleCategories.map((category) => {
          const categoryItems = itemsByCategory.get(category.id) || [];
          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} className="mb-14">
              <div className="mb-6 flex items-center gap-3">
                <Utensils className="h-6 w-6 text-red" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{category.parent_id ? `${categoryMap.get(category.parent_id)?.name || 'Menu'} / ` : ''}{category.name}</h2>
                  {category.description && <p className="text-white/60">{category.description}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <Link key={item.id} href={`/order/${item.id}`} className="group">
                    <Card className="overflow-hidden h-full group-hover:border-red/50 transition-colors">
                      {item.image_url && <div className="aspect-[4/3] bg-charcoal relative overflow-hidden"><img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {item.promotional_price && <Badge variant="danger" className="absolute top-4 right-4">Special</Badge>}
                      </div>}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gold">
                            {item.promotional_price ? (
                              <><span className="line-through text-white/40 mr-2">R{item.price}</span>R{item.promotional_price}</>
                            ) : `R${item.price}`}
                          </div>
                          <span className="text-red text-sm font-semibold group-hover:underline">Customise</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        }) : (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <h2 className="text-xl font-semibold text-white">No food is available right now</h2>
            <p className="mt-2 text-white/60">Please check back shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
