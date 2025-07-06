import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleApiAuth } from "./middleware/api.middleware";
import { handleLogout, handlePageAuth } from "./middleware/pages.middleware";

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // NextAuth handles /api/auth routes
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Handle logout first (special case)
  if (path === "/logout") {
    return handleLogout(request);
  }

  // Handle API routes
  if (path.startsWith("/api")) {
    const response = await handleApiAuth(request, token);
    return response || NextResponse.next();
  }

  // Handle page routes (everything else)
  const response = await handlePageAuth(request, token);
  return response || NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)", "/favicon.ico"],
};
