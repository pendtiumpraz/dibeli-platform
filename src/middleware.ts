import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isSuperAdmin = req.nextUrl.pathname.startsWith('/admin')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (isDashboard && !isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (isSuperAdmin && (!isAuth || !token?.isSuperAdmin)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
