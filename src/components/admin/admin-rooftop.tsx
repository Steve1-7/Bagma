'use client';

import { useState, type FormEvent } from 'react';
import { PartyPopper, Plus, Edit3, Trash2, Upload, X, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type RooftopRequest = {
  id: string;
  event_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string | null;
  status: string;
  guest_count?: number | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
};

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

type RooftopPostDraft = {
  occasion_type: string;
  title: string;
  description: string;
  image_url: string;
  poster_url: string;
  ticket_price: string;
  ticket_capacity: string;
  published: boolean;
};

const statuses = ['new', 'reviewing', 'quoted', 'approved', 'declined', 'cancelled'];
const occasionTypes = ['Business Meeting', 'Baby Shower', 'Birthday Party', 'Engagement Party', 'Anniversary', 'Private Celebration'];

const newRooftopPost = (): RooftopPostDraft => ({
  occasion_type: '',
  title: '',
  description: '',
  image_url: '',
  poster_url: '',
  ticket_price: '',
  ticket_capacity: '',
  published: false,
});

export default function AdminRooftop({ initialRequests, initialPosts }: { initialRequests: RooftopRequest[]; initialPosts: RooftopPost[] }) {
  const { success, error: showError } = useToast();
  const [requests, setRequests] = useState(initialRequests);
  const [posts, setPosts] = useState(initialPosts);
  const [updating, setUpdating] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState(newRooftopPost);
  const [editing, setEditing] = useState<{ id: string } | null>(null);
  const [modal, setModal] = useState<'post' | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [occasionFilter, setOccasionFilter] = useState('');

  const filteredPosts = posts.filter((post) => !occasionFilter || post.occasion_type === occasionFilter);
  const closeModal = () => { setModal(null); setEditing(null); };

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const result = await createClient().from('rooftop_experience_requests').update({ status }).eq('id', id);
    setUpdating(null);

    if (result.error) return showError(result.error.message);

    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    success('Experience request status updated.');
  }

  async function uploadImage(file: File, onUrl: (url: string) => void) {
    const supabase = createClient();
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return showError('Choose an image under 5MB.');
    setUploading(true);
    const path = `content/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const result = await supabase.storage.from('bagma-media').upload(path, file, { contentType: file.type });
    setUploading(false);
    if (result.error) return showError(result.error.message);
    onUrl(supabase.storage.from('bagma-media').getPublicUrl(path).data.publicUrl);
    success('Image uploaded.');
  }

  async function savePost(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!postDraft.occasion_type || !postDraft.title.trim() || !postDraft.description.trim()) {
      return showError('Occasion type, title and description are required.');
    }
    setSaving(true);
    const slug = editing ? posts.find((item) => item.id === editing.id)?.slug : `${postDraft.title}-${crypto.randomUUID()}`;
    const payload = {
      occasion_type: postDraft.occasion_type,
      title: postDraft.title.trim(),
      description: postDraft.description.trim(),
      slug: (slug || postDraft.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image_url: postDraft.image_url || null,
      poster_url: postDraft.poster_url || null,
      ticket_price: postDraft.ticket_price ? Number(postDraft.ticket_price) : null,
      ticket_capacity: postDraft.ticket_capacity ? Number(postDraft.ticket_capacity) : null,
      published: postDraft.published,
    };
    const result = editing
      ? await supabase.from('rooftop_posts').update(payload).eq('id', editing.id).select().single()
      : await supabase.from('rooftop_posts').insert(payload).select().single();
    setSaving(false);
    if (result.error) return showError(result.error.message);
    setPosts((current) => editing ? current.map((item) => item.id === editing.id ? result.data : item) : [...current, result.data]);
    closeModal();
    success(editing ? 'Post updated.' : 'Post created.');
  }

  async function removePost(id: string, title: string) {
    if (!window.confirm(`Delete ${title}? This cannot be undone.`)) return;
    const supabase = createClient();
    const result = await supabase.from('rooftop_posts').delete().eq('id', id);
    if (result.error) return showError(result.error.message);
    setPosts((current) => current.filter((item) => item.id !== id));
    success('Post deleted.');
  }

  function editPost(item: RooftopPost) {
    setEditing({ id: item.id });
    setPostDraft({
      occasion_type: item.occasion_type,
      title: item.title,
      description: item.description,
      image_url: item.image_url || '',
      poster_url: item.poster_url || '',
      ticket_price: item.ticket_price === null ? '' : String(item.ticket_price),
      ticket_capacity: item.ticket_capacity === null ? '' : String(item.ticket_capacity),
      published: item.published,
    });
    setModal('post');
  }

  return (
    <section className="mt-10 border-t border-white/10 pt-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <PartyPopper className="h-4 w-4" /> Rooftop
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase">Experience requests</h2>
        </div>
        <span className="text-sm text-white/50">{requests.length} total</span>
      </div>

      <div className="mt-6 grid gap-3">
        {requests.length ? (
          requests.map((request) => (
            <article key={request.id} className="border border-white/10 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">{request.customer_name}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {request.event_type} · {request.preferred_date || 'Date pending'}
                    {request.preferred_time ? ` at ${request.preferred_time}` : ''}
                    {request.guest_count ? ` · ${request.guest_count} guests` : ''}
                  </p>
                  <p className="mt-1 text-sm text-gold">
                    {request.customer_email} · {request.customer_phone}
                    {request.company_name ? ` · ${request.company_name}` : ''}
                  </p>
                </div>

                <select
                  aria-label={`Update rooftop request status for ${request.customer_name}`}
                  value={request.status}
                  disabled={updating === request.id}
                  onChange={(event) => updateStatus(request.id, event.target.value)}
                  className="border border-white/15 bg-background px-3 py-2.5 text-white"
                >
                  <option value="">Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </article>
          ))
        ) : (
          <p className="border border-dashed border-white/15 p-8 text-center text-white/50">
            No rooftop experience requests have been submitted yet.
          </p>
        )}
      </div>

      <div className="mt-14 border-t border-white/10 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              <PartyPopper className="h-4 w-4" /> Rooftop Posts
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase">Occasion posts</h2>
            <p className="mt-2 text-sm text-white/55">Create and manage posts for each rooftop occasion type.</p>
          </div>
          <Button type="button" onClick={() => { setPostDraft(newRooftopPost()); setEditing(null); setModal('post'); }}>
            <Plus className="mr-2 h-4 w-4" /> Create post
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOccasionFilter('')}
            className={`border px-3 py-2 text-sm font-bold uppercase tracking-wider ${!occasionFilter ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70 hover:border-gold'}`}
          >
            All occasions
          </button>
          {occasionTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOccasionFilter(type)}
              className={`border px-3 py-2 text-sm font-bold uppercase tracking-wider ${occasionFilter === type ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70 hover:border-gold'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <article key={post.id} className="border border-white/10 bg-charcoal/60 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    {post.image_url && (
                      <img src={post.image_url} alt={post.title} className="h-20 w-20 object-cover" />
                    )}
                    <div>
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="mt-1 text-sm text-white/60">
                        {post.occasion_type} · {post.published ? 'Published' : 'Draft'}
                        {post.ticket_price ? ` · R${post.ticket_price}` : ''}
                        {post.ticket_capacity ? ` · ${post.ticket_capacity} tickets` : ''}
                      </p>
                      <p className="mt-1 text-sm text-white/40 line-clamp-2">{post.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => editPost(post)} aria-label={`Edit ${post.title}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => removePost(post.id, post.title)} aria-label={`Delete ${post.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="border border-dashed border-white/15 p-8 text-center text-white/50">
              No rooftop posts have been created yet.
            </p>
          )}
        </div>
      </div>

      {modal === 'post' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 sm:p-10">
          <div className="mx-auto max-w-3xl border border-white/15 bg-charcoal p-5 sm:p-8">
            <header className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase">{editing ? 'Edit' : 'Create'} Rooftop Post</h2>
              <button type="button" onClick={closeModal} aria-label="Close form">
                <X />
              </button>
            </header>
            <form onSubmit={savePost} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-white/80 sm:col-span-2">
                Occasion type
                <select
                  required
                  value={postDraft.occasion_type}
                  onChange={(event) => setPostDraft({ ...postDraft, occasion_type: event.target.value })}
                  className="mt-2 w-full border border-white/15 bg-background px-3 py-2.5 text-white"
                >
                  <option value="">Select occasion</option>
                  {occasionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-white/80 sm:col-span-2">
                Title
                <Input
                  required
                  value={postDraft.title}
                  onChange={(event) => setPostDraft({ ...postDraft, title: event.target.value })}
                  placeholder="Post title"
                  className="mt-2"
                />
              </label>

              <label className="block text-sm font-semibold text-white/80 sm:col-span-2">
                Description
                <Textarea
                  required
                  value={postDraft.description}
                  onChange={(event) => setPostDraft({ ...postDraft, description: event.target.value })}
                  placeholder="Describe this occasion offering"
                  rows={4}
                  className="mt-2"
                />
              </label>

              <label className="block text-sm font-semibold text-white/80">
                Ticket price (optional)
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={postDraft.ticket_price}
                  onChange={(event) => setPostDraft({ ...postDraft, ticket_price: event.target.value })}
                  placeholder="0.00"
                  className="mt-2"
                />
              </label>

              <label className="block text-sm font-semibold text-white/80">
                Ticket capacity (optional)
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={postDraft.ticket_capacity}
                  onChange={(event) => setPostDraft({ ...postDraft, ticket_capacity: event.target.value })}
                  placeholder="0"
                  className="mt-2"
                />
              </label>

              <div className="sm:col-span-2">
                <span className="text-sm font-semibold text-white/80">Image</span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {postDraft.image_url && <img src={postDraft.image_url} alt="Preview" className="h-24 w-32 object-cover" />}
                  <label className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-3 text-sm font-bold hover:border-gold">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Choose image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, (url) => setPostDraft({ ...postDraft, image_url: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-sm font-semibold text-white/80">Poster</span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {postDraft.poster_url && <img src={postDraft.poster_url} alt="Poster preview" className="h-24 w-32 object-cover" />}
                  <label className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-3 text-sm font-bold hover:border-gold">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Choose poster'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, (url) => setPostDraft({ ...postDraft, poster_url: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={postDraft.published}
                  onChange={(event) => setPostDraft({ ...postDraft, published: event.target.checked })}
                />
                <span className="text-sm font-semibold text-white/80">Publish on website</span>
              </label>

              <div className="sm:col-span-2 flex gap-3">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : editing ? 'Update post' : 'Create post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
