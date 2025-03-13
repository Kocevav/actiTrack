import { auth } from "@/auth";

const authRoutes = ["/"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);
  const isApiAuthRouter = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuthRouter) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/ex", req.nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.*\\.).*)", "/favicon.ico"],
};
