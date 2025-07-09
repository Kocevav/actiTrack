import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function handlePageAuth(request: NextRequest, token: JWT | null) {
  const isLoggedIn = !!token;
  const path = request.nextUrl.pathname;

    const publicPages = ["/", "/about", "/contact"];


 if (!isLoggedIn && !publicPages.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoggedIn && path === "/") {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  return null;
}

export async function handleLogout(
  request: NextRequest
): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear all auth cookies
  response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
  response.cookies.set("next-auth.callback-url", "", { maxAge: 0 });

  return response;
}
