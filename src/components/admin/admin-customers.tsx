'use client';

import { useMemo, useState } from 'react';
import { Search, UserRound } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Customer = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  is_active: boolean | null;
  created_at: string;
  last_activity: string | null;
  orders_count?: number;
  last_order_at?: string | null;
};

export default function AdminCustomers({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(customers[0]?.id ?? null);

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return customers;

    return customers.filter((customer) => {
      const haystack = [
        customer.full_name,
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone,
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(normalized);
    });
  }, [customers, query]);

  const selectedCustomer = filteredCustomers.find((customer) => customer.id === selectedId) ?? filteredCustomers[0] ?? null;

  return (
    <section className="mt-10 border-t border-white/10 pt-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Customers</p>
          <h2 className="mt-2 text-4xl font-black uppercase">Users</h2>
        </div>
        <span className="text-sm text-white/50">{customers.length} total</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-charcoal/60 p-4">
          <label className="relative block">
            <span className="sr-only">Search customers</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full rounded-lg border border-white/10 bg-background px-10 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-gold"
            />
          </label>

          <div className="mt-4 space-y-3">
            {filteredCustomers.length === 0 ? (
              <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-white/50">No customers match your search.</p>
            ) : (
              filteredCustomers.map((customer) => {
                const name = customer.full_name || [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Unnamed customer';
                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => setSelectedId(customer.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${selectedCustomer?.id === customer.id ? 'border-gold bg-gold/10' : 'border-white/10 bg-[#1b1715]'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{name}</p>
                        <p className="mt-1 text-sm text-white/55">{customer.email || 'No email stored'}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${customer.is_active === false ? 'bg-red/10 text-red' : 'bg-green-500/10 text-green-400'}`}>
                        {customer.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                      <span>{customer.orders_count ?? 0} orders</span>
                      <span>{customer.last_order_at ? formatDate(customer.last_order_at) : 'No orders yet'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-charcoal/60 p-6">
          {selectedCustomer ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">{selectedCustomer.full_name || 'Customer profile'}</h3>
                    <p className="text-sm text-white/50">{selectedCustomer.email || 'No email set'}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${selectedCustomer.is_active === false ? 'bg-red/10 text-red' : 'bg-green-500/10 text-green-400'}`}>
                  {selectedCustomer.is_active === false ? 'Inactive' : 'Active'}
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-white/10 bg-background/50 p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Profile</h4>
                  <dl className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between gap-4"><dt>Phone</dt><dd>{selectedCustomer.phone || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Address</dt><dd>{selectedCustomer.address || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt>City</dt><dd>{selectedCustomer.city || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Postal code</dt><dd>{selectedCustomer.postal_code || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Country</dt><dd>{selectedCustomer.country || '—'}</dd></div>
                  </dl>
                </div>

                <div className="space-y-3 rounded-xl border border-white/10 bg-background/50 p-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Account</h4>
                  <dl className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between gap-4"><dt>Registration</dt><dd>{formatDate(selectedCustomer.created_at)}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Last activity</dt><dd>{selectedCustomer.last_activity ? formatDate(selectedCustomer.last_activity) : 'No activity recorded'}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Order count</dt><dd>{selectedCustomer.orders_count ?? 0}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Last order</dt><dd>{selectedCustomer.last_order_at ? formatDate(selectedCustomer.last_order_at) : 'None'}</dd></div>
                  </dl>
                </div>
              </div>
            </>
          ) : (
            <p className="text-white/55">No customer selected.</p>
          )}
        </div>
      </div>
    </section>
  );
}
