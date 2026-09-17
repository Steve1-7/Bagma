'use client';

import { useState, type FormEvent } from 'react';
import { Edit3, Plus, Trash2, Upload } from 'lucide-react';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Service = { id: string; name: string; description: string; base_price: number; duration_minutes: number; active: boolean; featured: boolean; image_url: string | null };
type Addon = { id: string; name: string; description: string | null; price: number; active: boolean; image_url: string | null };
type Draft = { name: string; description: string; price: string; duration: string; active: boolean; featured: boolean; image_url: string };
const blank = (addon = false): Draft => ({ name: '', description: '', price: '', duration: addon ? '0' : '', active: true, featured: false, image_url: '' });

export default function AdminCarwash({ initialServices, initialAddons }: { initialServices: Service[]; initialAddons: Addon[] }) {
  const { success, error } = useToast();
  const [services, setServices] = useState(initialServices);
  const [addons, setAddons] = useState(initialAddons);
  const [serviceDraft, setServiceDraft] = useState(blank());
  const [addonDraft, setAddonDraft] = useState(blank(true));
  const [editing, setEditing] = useState<{ type: 'service' | 'addon'; id: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File, setUrl: (url: string) => void) {
    const supabase = createClient();
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return error('Choose an image under 5MB.');
    setUploading(true);
    const path = `carwash/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const result = await supabase.storage.from('bagma-media').upload(path, file, { contentType: file.type });
    setUploading(false);
    if (result.error) return error(result.error.message);
    setUrl(supabase.storage.from('bagma-media').getPublicUrl(path).data.publicUrl);
  }

  async function saveService(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!serviceDraft.name.trim() || !serviceDraft.description.trim() || Number(serviceDraft.price) < 0 || Number(serviceDraft.duration) < 1) return error('Name, description, price and duration are required.');
    const payload = { name: serviceDraft.name.trim(), description: serviceDraft.description.trim(), base_price: Number(serviceDraft.price), duration_minutes: Number(serviceDraft.duration), active: serviceDraft.active, featured: serviceDraft.featured, image_url: serviceDraft.image_url || null };
    const result = editing?.type === 'service' ? await supabase.from('carwash_services').update(payload).eq('id', editing.id).select().single() : await supabase.from('carwash_services').insert(payload).select().single();
    if (result.error) return error(result.error.message);
    setServices((current) => editing?.type === 'service' ? current.map((item) => item.id === editing.id ? result.data : item) : [...current, result.data]);
    setServiceDraft(blank()); setEditing(null); success('Carwash service saved.');
  }

  async function saveAddon(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!addonDraft.name.trim() || !addonDraft.description.trim() || Number(addonDraft.price) < 0) return error('Name, description and price are required.');
    const payload = { name: addonDraft.name.trim(), description: addonDraft.description.trim(), price: Number(addonDraft.price), active: addonDraft.active, image_url: addonDraft.image_url || null };
    const result = editing?.type === 'addon' ? await supabase.from('carwash_addons').update(payload).eq('id', editing.id).select().single() : await supabase.from('carwash_addons').insert(payload).select().single();
    if (result.error) return error(result.error.message);
    setAddons((current) => editing?.type === 'addon' ? current.map((item) => item.id === editing.id ? result.data : item) : [...current, result.data]);
    setAddonDraft(blank(true)); setEditing(null); success('Carwash add-on saved.');
  }

  async function remove(table: 'carwash_services' | 'carwash_addons', id: string) {
    if (!window.confirm('Delete this carwash item?')) return;
    const supabase = createClient();
    const result = await supabase.from(table).delete().eq('id', id);
    if (result.error) return error(result.error.message);
    if (table === 'carwash_services') setServices((current) => current.filter((item) => item.id !== id));
    else setAddons((current) => current.filter((item) => item.id !== id));
  }

  const imageField = (draft: Draft, setDraft: (draft: Draft) => void) => <div className="sm:col-span-2"><span className="text-sm font-semibold text-white/80">Image</span><div className="mt-2 flex items-center gap-4">{draft.image_url && <img src={draft.image_url} alt="Preview" className="h-20 w-28 object-cover" />}<label className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-3 text-sm font-bold"><Upload className="h-4 w-4" />{uploading ? 'Uploading...' : 'Choose image'}<input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file, (url) => setDraft({ ...draft, image_url: url })); }} /></label></div></div>;
  const fields = (draft: Draft, setDraft: (draft: Draft) => void, addon = false) => <><input required placeholder="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="control" /><textarea required placeholder="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="control min-h-20" /><input required type="number" min="0" step="0.01" placeholder="Price" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className="control" />{!addon && <input required type="number" min="1" placeholder="Duration (minutes)" value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} className="control" />}<label><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Active</label>{!addon && <label><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /> Featured</label>}{imageField(draft, setDraft)}</>;
  return <section className="mt-10 border-t border-white/10 pt-10"><h2 className="text-3xl font-black uppercase">Carwash catalogue</h2><div className="mt-6 grid gap-8 xl:grid-cols-2"><div><form onSubmit={saveService} className="grid gap-3 border border-white/10 bg-charcoal/60 p-5 sm:grid-cols-2"><h3 className="text-xl font-bold sm:col-span-2">{editing?.type === 'service' ? 'Edit service' : 'Add service'}</h3>{fields(serviceDraft, setServiceDraft)}<Button type="submit" className="sm:col-span-2"><Plus className="mr-2 h-4 w-4" />Save service</Button></form><div className="mt-4 grid gap-2">{services.map((item) => <Row key={item.id} name={item.name} detail={`R${item.base_price} · ${item.duration_minutes} min`} onEdit={() => { setEditing({ type: 'service', id: item.id }); setServiceDraft({ name: item.name, description: item.description, price: String(item.base_price), duration: String(item.duration_minutes), active: item.active, featured: item.featured, image_url: item.image_url || '' }); }} onDelete={() => remove('carwash_services', item.id)} />)}</div></div><div><form onSubmit={saveAddon} className="grid gap-3 border border-white/10 bg-charcoal/60 p-5 sm:grid-cols-2"><h3 className="text-xl font-bold sm:col-span-2">{editing?.type === 'addon' ? 'Edit add-on' : 'Add add-on'}</h3>{fields(addonDraft, setAddonDraft, true)}<Button type="submit" className="sm:col-span-2"><Plus className="mr-2 h-4 w-4" />Save add-on</Button></form><div className="mt-4 grid gap-2">{addons.map((item) => <Row key={item.id} name={item.name} detail={`R${item.price}`} onEdit={() => { setEditing({ type: 'addon', id: item.id }); setAddonDraft({ name: item.name, description: item.description || '', price: String(item.price), duration: '0', active: item.active, featured: false, image_url: item.image_url || '' }); }} onDelete={() => remove('carwash_addons', item.id)} />)}</div></div></div></section>;
}

function Row({ name, detail, onEdit, onDelete }: { name: string; detail: string; onEdit: () => void; onDelete: () => void }) { return <article className="flex items-center gap-3 border border-white/10 bg-charcoal/60 p-3"><div className="flex-1"><p className="font-bold">{name}</p><p className="text-sm text-white/50">{detail}</p></div><button type="button" aria-label={`Edit ${name}`} onClick={onEdit}><Edit3 className="h-4 w-4" /></button><button type="button" aria-label={`Delete ${name}`} onClick={onDelete}><Trash2 className="h-4 w-4 text-red" /></button></article>; }
