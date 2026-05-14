import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({ request })
  response.headers.set('x-pathname', pathname)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // getUser() valida o token no servidor — nunca confiar só no cookie local
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminLogin = pathname === '/admin/login'
  const isAdminArea = pathname.startsWith('/admin') && !isAdminLogin

  if (isAdminArea && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminLogin && user) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
