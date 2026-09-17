'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function AdminSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}