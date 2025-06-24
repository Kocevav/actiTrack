import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export async function handlePageAuth(
  request: NextRequest, 
  token: JWT | null
): Promise<NextResponse | null> {
  const isLoggedIn = !!token;
  
  // Logged-in user visits home → redirect to events
  if (isLoggedIn && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/events", request.url));
  }
  
  // Non-logged-in user visits protected page → redirect to home
  if (!isLoggedIn && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Everything is fine, continue
  return null;
}

export async function handleLogout(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/", request.url));
  
  // Clear all auth cookies
  response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
  response.cookies.set("next-auth.callback-url", "", { maxAge: 0 });
  
  return response;
} 