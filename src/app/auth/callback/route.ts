import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestedPath = request.nextUrl.searchParams.get('next');
  const nextPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
    ? requestedPath
    : '/admin';
  const destination = new URL(nextPath, request.url);
  let response = NextResponse.redirect(destination);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.redirect(destination);
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const code = request.nextUrl.searchParams.get('code');
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : { error: new Error('Missing authorization code') };

  if (error) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('error', 'auth_callback_failed');
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
