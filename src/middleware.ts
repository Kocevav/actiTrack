import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default auth(async (request) => {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const isApiAuthRouter = request.nextUrl.pathname.startsWith("/api/auth");
  console.log(isLoggedIn);

  if (isApiAuthRouter) return;

  if (request.nextUrl.pathname == "/logout") {
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.callback-url", "", { maxAge: 0 });
  }

  if (isLoggedIn && request.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  if (!isLoggedIn && request.nextUrl.pathname != "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\.).*)", "/favicon.ico"],
};
