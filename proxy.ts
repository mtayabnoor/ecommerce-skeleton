import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = [
  "/profile",
  "/admin/dashboard",
  "/admin/users",
  "/admin/products",
  "/admin/categories",
  "/admin/settings",
  "/admin/inventory",
  "/help",
];

export default async function proxy(req: NextRequest) {
  // Validate the actual session instead of only checking cookie
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const isLoggedIn = !!session?.user;

  const pathname = req.nextUrl.pathname;

  const isOnProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isOnAuthRoute = pathname.startsWith("/auth");

  // Redirect unauthenticated users trying to access protected routes
  if (isOnProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.nextUrl);

    // keep track of where they were going
    signInUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // Prevent logged in users from accessing auth pages
  if (isOnAuthRoute && isLoggedIn) {
    const callbackUrl =
      req.nextUrl.searchParams.get("callbackUrl") || "/profile";

    return NextResponse.redirect(new URL(callbackUrl, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|robots.txt|sitemap.xml).*)",
  ],
};