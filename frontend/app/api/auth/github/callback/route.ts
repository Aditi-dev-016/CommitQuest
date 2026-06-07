import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  // CSRF check
  const storedState = req.cookies.get('oauth_state')?.value
  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', req.url))
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })

    if (!res.ok) {
      return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
    }

    const { data } = await res.json()
    const isNew    = data.contributor.total_xp === 0 && !data.contributor.last_active_date

    const redirect = NextResponse.redirect(
      new URL(isNew ? '/onboarding' : '/dashboard', req.url)
    )

    // Forward the HttpOnly session cookie set by the backend
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      redirect.headers.set('set-cookie', setCookie)
    }

    // Clear oauth state cookie
    redirect.cookies.delete('oauth_state')

    return redirect
  } catch {
    return NextResponse.redirect(new URL('/?error=server_error', req.url))
  }
}
