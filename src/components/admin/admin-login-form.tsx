'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole, MailCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginForm({
  unauthorized,
  callbackFailed,
}: {
  unauthorized: boolean;
  callbackFailed: boolean;
}) {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState(
    unauthorized
      ? 'This account does not have dashboard access. Ask an administrator to assign it the manager or super admin role.'
      : callbackFailed
        ? 'The sign-in link is invalid or expired. Please request a new one and try again.'
        : ''
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: sendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (sendError) {
        setError(sendError.message);
      } else {
        setLinkSent(true);
      }
    } catch {
      setError('Unable to send a sign-in link right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-20 text-white">
      <section className="w-full max-w-md border border-white/10 bg-charcoal/70 p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center bg-red text-white">
          {linkSent ? <MailCheck className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Bagma operations</p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none">Admin sign in</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          {linkSent
            ? `Check ${email} and click the sign-in link to continue to the dashboard.`
            : 'Enter your authorized admin email and we’ll send you a secure sign-in link.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!linkSent ? (
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
          ) : (
            <p className="border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              The link expires shortly and can only be used once.
            </p>
          )}
          {error && <p className="text-sm text-red" role="alert">{error}</p>}
          {!linkSent ? (
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Sending sign-in link...' : 'Email me a sign-in link'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          ) : (
            <div className="space-y-4">
              <Button type="submit" size="lg" variant="outline" className="w-full" disabled={loading}>
                {loading ? 'Resending link...' : 'Resend sign-in link'}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-white/60 underline underline-offset-4 hover:text-white"
                onClick={() => {
                  setLinkSent(false);
                  setError('');
                }}
              >
                Use a different email
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
