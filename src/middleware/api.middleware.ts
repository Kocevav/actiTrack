import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function handleApiAuth(
  req: NextRequest,
  token: JWT | null
): Promise<NextResponse | null> {
    
  const isLoggedIn = !!token;
  const path = req.nextUrl.pathname;

  const publicRoutes = [
    "/api/events", // users who are not logged in can still see events
    "/api/health",
    "/api/status",
  ];

  const isPublicGetRequest =
    req.method === "GET" && publicRoutes.some((route) => path === route);

  if (isPublicGetRequest) return null;

  if (!isLoggedIn) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required",
      },
      { status: 401 }
    );
  }

  return null;
}
