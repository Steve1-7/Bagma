'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function InviteRedirect() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get('type') !== 'invite') return;

    handled.current = true;
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);

    async function acceptInvite() {
      if (!accessToken || !refreshToken) {
        router.replace('/admin/login?error=auth_callback_failed');
        return;
      }

      const { error } = await createClient().auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        router.replace('/admin/login?error=auth_callback_failed');
        return;
      }

      router.replace('/admin');
      router.refresh();
    }

    void acceptInvite();
  }, [router]);

  return null;
}
