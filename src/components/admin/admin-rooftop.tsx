'use client';

import { useState } from 'react';
import { PartyPopper } from 'lucide-react';
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

const statuses = ['new', 'reviewing', 'quoted', 'approved', 'declined', 'cancelled'];

export default function AdminRooftop({ initialRequests }: { initialRequests: RooftopRequest[] }) {
  const { success, error } = useToast();
  const [requests, setRequests] = useState(initialRequests);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const result = await createClient().from('rooftop_experience_requests').update({ status }).eq('id', id);
    setUpdating(null);

    if (result.error) return error(result.error.message);

    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    success('Experience request status updated.');
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
    </section>
  );
}
