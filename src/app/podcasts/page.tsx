import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

function embedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch { return null; }
}

export default async function PodcastsPage() {
  const supabase = await createClient();
  const { data: podcasts, error } = await supabase.from('podcasts').select('*').eq('published', true).order('published_at', { ascending: false });

  return <div className="min-h-screen"><header className="border-b border-white/10 bg-gradient-to-br from-red/20 to-charcoal px-4 py-16 text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Bagma audio</p><h1 className="mt-3 text-5xl font-black uppercase">Latest podcasts</h1><p className="mx-auto mt-4 max-w-2xl text-white/60">The latest conversations, stories and energy from Bagma.</p><a href="https://youtube.com/@bagmaunpluggedpodcast?si=i3CegTPpRxMsUBAm" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex border border-gold px-4 py-3 text-sm font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black">Visit Bagma Unplugged on YouTube</a></header><main className="mx-auto max-w-7xl px-4 py-12">{error ? <p className="border border-red/40 bg-red/10 p-6 text-white">Podcasts are temporarily unavailable.</p> : podcasts?.length ? <div className="grid gap-8 lg:grid-cols-2">{podcasts.map((podcast, index) => { const src = embedUrl(podcast.youtube_url); return <article key={podcast.id} className={`overflow-hidden border border-white/10 bg-charcoal/60 ${index === 0 ? 'lg:col-span-2' : ''}`}>{src && <iframe className="aspect-video w-full" src={src} title={podcast.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}{!src && podcast.thumbnail_url && <img src={podcast.thumbnail_url} alt="" className="aspect-video w-full object-cover" />}<div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-gold">{formatDate(podcast.published_at)}</p><h2 className="mt-2 text-3xl font-black uppercase">{podcast.title}</h2><p className="mt-3 text-white/60">{podcast.description}</p></div></article>; })}</div> : <div className="py-20 text-center"><h2 className="text-2xl font-bold">No podcast episodes have been published yet.</h2><p className="mt-2 text-white/50">Check back soon for the latest from Bagma.</p></div>}</main></div>;
}
