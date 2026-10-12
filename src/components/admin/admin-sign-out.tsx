'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function AdminSignOut() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setError('');
    setLoading(true);

    try {
      const { error: signOutError } = await createClient().auth.signOut();

      if (signOutError) {
        setError('Unable to sign out. Please try again.');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" onClick={handleSignOut} disabled={loading}>
        <LogOut className="mr-2 h-4 w-4" />
        {loading ? 'Signing out...' : 'Sign out'}
      </Button>
      {error && <p className="mt-2 text-right text-sm text-red" role="alert">{error}</p>}
    </div>
  );
}