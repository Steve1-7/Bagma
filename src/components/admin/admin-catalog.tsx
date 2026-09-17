'use client';

import Link from 'next/link';
import { Check, ChevronRight, CircleAlert, Package, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Category = { id: string; name: string; description: string | null; active: boolean; sort_order: number };
type Item = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  promotional_price: number | null;
  available: boolean;
  featured: boolean;
  image_url: string | null;
  sort_order: number;
};

export default function AdminCatalog({
  categories,
  items,
  selectedCategory,
  error,
}: {
  categories: Category[];
  items: Item[];
  selectedCategory?: string;
  error: string | null;
}) {
  const { success, error: showError } = useToast();
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);
  const visibleItems = items.filter((item) => {
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const search = query.trim().toLowerCase();
    return matchesCategory && (!search || `${item.name} ${item.description}`.toLowerCase().includes(search));
  });

  async function updateCategory(itemId: string, categoryId: string) {
    setUpdatingId(itemId);
    const { error: updateError } = await createClient()
      .from('menu_items')
      .update({ category_id: categoryId || null })
      .eq('id', itemId);

    if (updateError) showError('The product category could not be updated. Please try again.');
    else success('Product category updated.');
    setUpdatingId(null);
  }

  if (error) {
    return <div className="mt-8 flex items-start gap-3 border border-red/40 bg-red/10 p-5 text-sm text-white"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red" /><div><p className="font-semibold">Catalogue unavailable</p><p className="mt-1 text-white/60">{error}</p></div></div>;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Product categories" className="flex max-w-full gap-2 overflow-x-auto pb-1">
          <Link href="/admin" className={`shrink-0 border px-4 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold ${!selectedCategory ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70 hover:border-gold hover:text-white'}`} aria-current={!selectedCategory ? 'page' : undefined}>All products <span className="ml-1 opacity-60">{items.length}</span></Link>
          {categories.map((category) => {
            const count = items.filter((item) => item.category_id === category.id).length;
            const isSelected = category.id === selectedCategory;
            return <Link key={category.id} href={`/admin?category=${category.id}`} className={`flex min-w-max items-center gap-2 border px-4 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold ${isSelected ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70 hover:border-gold hover:text-white'}`} aria-current={isSelected ? 'page' : undefined}>{category.name}<span className="opacity-60">{count}</span><ChevronRight className="h-4 w-4" /></Link>;
          })}
        </nav>
        <label className="relative block min-w-0 lg:w-72"><span className="sr-only">Search products</span><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full border border-white/15 bg-charcoal py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" /></label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3"><div><h3 className="text-2xl font-black uppercase">{selectedCategory ? categoryMap.get(selectedCategory) || 'Category' : 'All products'}</h3><p className="mt-1 text-sm text-white/50">{visibleItems.length} {visibleItems.length === 1 ? 'product' : 'products'} shown</p></div></div>

      {visibleItems.length === 0 ? <div className="mt-6 border border-dashed border-white/15 p-10 text-center"><Package className="mx-auto h-10 w-10 text-white/20" /><p className="mt-4 font-semibold">No products found</p><p className="mt-1 text-sm text-white/45">Try another category or search term.</p></div> : <div className="mt-6 grid gap-3 xl:grid-cols-2">{visibleItems.map((item) => <article key={item.id} className="border border-white/10 bg-charcoal/60 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="truncate text-xl font-bold">{item.name}</h4>{item.available ? <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Available</span> : <span className="text-xs font-bold uppercase tracking-wider text-white/40">Unavailable</span>}</div><p className="mt-2 line-clamp-2 text-sm text-white/50">{item.description}</p><p className="mt-4 font-bold text-gold">R{item.promotional_price || item.price}</p></div><div className="w-full sm:max-w-52"><label className="text-xs font-bold uppercase tracking-wider text-white/45" htmlFor={`category-${item.id}`}>Category</label><select id={`category-${item.id}`} value={item.category_id || ''} disabled={updatingId === item.id} onChange={(event) => updateCategory(item.id, event.target.value)} className="mt-2 w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"><option value="">Uncategorised</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{updatingId === item.id && <span className="mt-2 flex items-center gap-1 text-xs text-gold"><Check className="h-3 w-3 animate-pulse" /> Saving...</span>}</div></div></article>)}</div>}
    </div>
  );
}