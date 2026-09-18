'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Car, CheckCircle2, Heart, LogOut, ShoppingBag, UserRound } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatPrice } from '@/lib/utils';

type OrderRecord = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: 'delivery' | 'collection';
  status: string;
  payment_status: string;
  payment_method: string | null;
  total: number;
  delivery_address: string | null;
  order_description: string | null;
  created_at: string;
  kind?: 'food' | 'carwash';
};

type ProfileRecord = {
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
  updated_at: string;
  last_activity: string | null;
};

const emptyProfile: ProfileRecord = {
  id: '',
  full_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  country: '',
  is_active: true,
  created_at: '',
  updated_at: '',
  last_activity: null,
};

const accountLinks = [
  { title: 'Orders', detail: 'Track orders and reorder favourites.', href: '/track-order', icon: ShoppingBag },
  { title: 'Carwash', detail: 'Manage your next clean ride.', href: '/carwash', icon: Car },
  { title: 'Favourites', detail: 'Your saved Bagma picks will live here.', href: '/menu', icon: Heart },
];

export default function AccountPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [profile, setProfile] = useState<ProfileRecord>(emptyProfile);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authForm, setAuthForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', address: '', city: '', postalCode: '', country: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const loadAccount = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setSessionReady(true);
      setLoading(false);
      return;
    }

    const [{ data: profileData }, { data: orderData }, { data: bookingData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      supabase.from('carwash_bookings').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
    ]);

    if (profileData) {
      setProfile({
        ...emptyProfile,
        ...profileData,
        email: profileData.email || session.user.email || '',
      });
    }

    const mergedOrders = [
      ...(orderData || []).map((order) => ({ ...order, kind: 'food' as const })),
      ...(bookingData || []).map((booking) => ({
        id: booking.id,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        order_type: 'collection' as const,
        status: booking.status,
        payment_status: 'pending',
        payment_method: null,
        total: Number(booking.total_price || 0),
        delivery_address: null,
        order_description: booking.booking_description || `${booking.customer_name} carwash booking`,
        created_at: booking.created_at,
        kind: 'carwash' as const,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setOrders(mergedOrders as OrderRecord[]);
    setSessionReady(true);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;

    const syncSessionState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;

      if (!session?.user) {
        setSessionReady(true);
        setProfile(emptyProfile);
        setOrders([]);
        setLoading(false);
        return;
      }

      await loadAccount();
    };

    void syncSessionState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session?.user) {
        setSessionReady(true);
        setProfile(emptyProfile);
        setOrders([]);
        setLoading(false);
        return;
      }

      void loadAccount();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadAccount, supabase]);

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'sign-up') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              first_name: authForm.firstName,
              last_name: authForm.lastName,
              phone: authForm.phone,
              address: authForm.address,
              city: authForm.city,
              postal_code: authForm.postalCode,
              country: authForm.country,
            },
          },
        });

        if (signUpError) throw signUpError;
        success('Account created. Please check your email to confirm sign-in.');
        setAuthMode('sign-in');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });

        if (signInError) throw signInError;
        success('Signed in successfully.');
      }
    } catch (authError) {
      error(authError instanceof Error ? authError.message : 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProfileSave = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      error('You must be signed in to update your account.');
      return;
    }

    setSaving(true);

    try {
      const { error: profileError } = await supabase.from('profiles').update({
        first_name: profile.first_name?.trim() || null,
        last_name: profile.last_name?.trim() || null,
        full_name: [profile.first_name?.trim(), profile.last_name?.trim()].filter(Boolean).join(' ') || null,
        phone: profile.phone?.trim() || null,
        address: profile.address?.trim() || null,
        city: profile.city?.trim() || null,
        postal_code: profile.postal_code?.trim() || null,
        country: profile.country?.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (profileError) throw profileError;

      const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (updatedProfile) {
        setProfile({
          ...emptyProfile,
          ...updatedProfile,
          email: updatedProfile.email || user.email || '',
        });
      }

      success('Your profile has been updated.');
      setIsEditing(false);
    } catch (profileError) {
      error(profileError instanceof Error ? profileError.message : 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      error(signOutError.message);
      return;
    }

    setProfile(emptyProfile);
    setOrders([]);
    success('Signed out successfully.');
  };

  const accountName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.full_name || 'Customer';

  if (loading || !sessionReady) {
    return <div className="min-h-screen flex items-center justify-center px-4 text-white">Loading your account...</div>;
  }

  if (!profile.id) {
    return (
      <div className="min-h-screen bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-gold"><UserRound className="h-4 w-4" /> My Bagma</p>
            <h1 className="text-6xl font-black uppercase leading-[.86] tracking-tight sm:text-8xl">Your account</h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60">Create an account to save your delivery details, track orders, and checkout faster.</p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6 sm:p-8">
              <div className="mb-6 flex gap-2 rounded-lg border border-white/10 bg-[#130d0b] p-1">
                <button type="button" onClick={() => setAuthMode('sign-in')} className={`flex-1 rounded-md px-4 py-2 text-sm font-bold ${authMode === 'sign-in' ? 'bg-red text-white' : 'text-white/60'}`}>
                  Sign in
                </button>
                <button type="button" onClick={() => setAuthMode('sign-up')} className={`flex-1 rounded-md px-4 py-2 text-sm font-bold ${authMode === 'sign-up' ? 'bg-red text-white' : 'text-white/60'}`}>
                  Create account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'sign-up' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="First name" value={authForm.firstName} onChange={(event) => setAuthForm((current) => ({ ...current, firstName: event.target.value }))} required />
                    <Input placeholder="Last name" value={authForm.lastName} onChange={(event) => setAuthForm((current) => ({ ...current, lastName: event.target.value }))} required />
                  </div>
                )}

                <Input type="email" placeholder="Email address" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} required />
                {authMode === 'sign-up' && (
                  <>
                    <Input type="tel" placeholder="Phone number" value={authForm.phone} onChange={(event) => setAuthForm((current) => ({ ...current, phone: event.target.value }))} required />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Address" value={authForm.address} onChange={(event) => setAuthForm((current) => ({ ...current, address: event.target.value }))} required />
                      <Input placeholder="City" value={authForm.city} onChange={(event) => setAuthForm((current) => ({ ...current, city: event.target.value }))} required />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Postal code" value={authForm.postalCode} onChange={(event) => setAuthForm((current) => ({ ...current, postalCode: event.target.value }))} required />
                      <Input placeholder="Country" value={authForm.country} onChange={(event) => setAuthForm((current) => ({ ...current, country: event.target.value }))} required />
                    </div>
                  </>
                )}
                <Input type="password" placeholder="Password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} required />

                <Button type="submit" size="lg" className="w-full" disabled={authLoading}>
                  {authLoading ? (authMode === 'sign-up' ? 'Creating account...' : 'Signing in...') : authMode === 'sign-up' ? 'Create account' : 'Sign in'}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {accountLinks.map(({ title, detail, href, icon: Icon }) => (
                  <Link key={title} href={href} className="group border border-white/10 bg-charcoal/60 p-6 transition-colors hover:border-gold/60">
                    <Icon className="h-6 w-6 text-gold" />
                    <h2 className="mt-10 text-3xl font-black uppercase">{title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">{detail}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-gold"><UserRound className="h-4 w-4" /> My Bagma</p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-none sm:text-6xl">{accountName}</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Personal information</p>
                  <h2 className="mt-2 text-2xl font-black uppercase">Profile</h2>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit profile</Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</Button>
                    <Button onClick={handleProfileSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">First name</label>
                  <Input value={profile.first_name || ''} onChange={(event) => setProfile((current) => ({ ...current, first_name: event.target.value }))} disabled={!isEditing} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Last name</label>
                  <Input value={profile.last_name || ''} onChange={(event) => setProfile((current) => ({ ...current, last_name: event.target.value }))} disabled={!isEditing} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-white/70">Email</label>
                  <Input value={profile.email || ''} disabled />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-white/70">Phone</label>
                  <Input value={profile.phone || ''} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} disabled={!isEditing} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Delivery information</p>
              <h2 className="mt-2 text-2xl font-black uppercase">Saved address</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-white/70">Address</label>
                  <Input value={profile.address || ''} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} disabled={!isEditing} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">City</label>
                  <Input value={profile.city || ''} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} disabled={!isEditing} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Postal code</label>
                  <Input value={profile.postal_code || ''} onChange={(event) => setProfile((current) => ({ ...current, postal_code: event.target.value }))} disabled={!isEditing} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-white/70">Country</label>
                  <Input value={profile.country || ''} onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))} disabled={!isEditing} />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Account status</p>
              <h2 className="mt-2 text-2xl font-black uppercase">Overview</h2>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#130d0b] p-3"><span>Account</span><span className="inline-flex items-center gap-2 text-green-400"><CheckCircle2 className="h-4 w-4" /> Active</span></div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#130d0b] p-3"><span>Joined</span><span>{profile.created_at ? formatDate(profile.created_at) : 'Recently'}</span></div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#130d0b] p-3"><span>Orders</span><span>{orders.length}</span></div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#130d0b] p-3"><span>Last activity</span><span>{profile.last_activity ? formatDate(profile.last_activity) : 'No activity recorded'}</span></div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">My orders</p>
              <h2 className="mt-2 text-2xl font-black uppercase">Order history</h2>

              <div className="mt-6 space-y-3">
                {orders.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-white/55">You have not placed any orders yet.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-white/10 bg-[#130d0b] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-white">#{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-white/50">{formatDate(order.created_at)}</p>
                        </div>
                        <span className="rounded-full bg-gold/10 px-2 py-1 text-[10px] font-bold uppercase text-gold">{order.status}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-white/65">
                        <span>{order.kind === 'carwash' ? 'Carwash booking' : (order.order_type === 'delivery' ? 'Delivery' : 'Collection')}</span>
                        <span>{order.payment_status || order.status}</span>
                      </div>
                      <div className="mt-2 text-sm text-white/75">{order.order_description || order.delivery_address || 'No order details available'}</div>
                      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-white">
                        <span>{order.kind === 'carwash' ? 'Booking request' : (order.payment_method || 'Payment method pending')}</span>
                        <span>{formatPrice(Number(order.total))}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
