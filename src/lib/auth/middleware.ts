import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./config";

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register", 
    "/forgot-password",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
  ];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the route is protected (dashboard routes)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/(dashboard)")) {
    const session = await getSession();
    
    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role for admin/owner routes
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/owner")) {
      if (session.role !== "admin" && session.role !== "owner") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (pathname.startsWith("/dashboard/owner")) {
      if (session.role !== "owner") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export function withAuth(handler: (request: NextRequest, session: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return handler(request, session);
  };
}
