import AdminLoginForm from '@/components/admin/admin-login-form';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AdminLoginForm
      unauthorized={error === 'unauthorized'}
      callbackFailed={error === 'auth_callback_failed'}
    />
  );
}
