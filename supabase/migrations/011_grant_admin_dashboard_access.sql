INSERT INTO public.profiles (id, role)
SELECT id, 'manager'::user_role
FROM auth.users
WHERE lower(email) IN (
  lower('eaziesteve@gmail.com'),
  lower('bagmalifestyle@gmail.com')
)
ON CONFLICT (id) DO UPDATE
SET role = 'manager',
    updated_at = TIMEZONE('utc'::text, NOW())
RETURNING id, role;
