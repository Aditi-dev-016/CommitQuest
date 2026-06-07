import { NextResponse } from 'next/server'

export function GET() {
  const clientId    = process.env.GITHUB_CLIENT_ID
  const redirectUri = process.env.GITHUB_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
  const state       = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id:    clientId ?? '',
    redirect_uri: redirectUri,
    scope:        'read:user user:email',
    state,
  })

  const res = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  )
  // Store state in cookie for CSRF check
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return res
}
