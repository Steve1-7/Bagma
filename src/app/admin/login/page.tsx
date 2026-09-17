'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('The email or password is incorrect.');
      setLoading(false);
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get('next');
    router.replace(nextPath || '/admin');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-20 text-white">
      <section className="w-full max-w-md border border-white/10 bg-charcoal/70 p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center bg-red text-white">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Bagma operations</p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none">Admin sign in</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/55">Use a manager or super admin account to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-white/80" htmlFor="admin-email">
            Email
            <Input
              id="admin-email"
              type="email"
              className="mt-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-white/80" htmlFor="admin-password">
            Password
            <Input
              id="admin-password"
              type="password"
              className="mt-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm text-red" role="alert">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Enter dashboard'}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </section>
    </main>
  );
}