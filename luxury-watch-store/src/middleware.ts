import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token
      
      if (!token) {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(req.nextUrl.pathname), req.url))
      }
      
      if (token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true
        }
        
        // Require authentication for admin routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}