import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  let userRole: string | null = null;
  let isAuthenticated = false;

  if (accessToken) {
    isAuthenticated = true;
    try {
      const payloadBase64 = accessToken.split(".")[1];
      if (payloadBase64) {
        const decodedJson = Buffer.from(payloadBase64, "base64").toString();
        const payload = JSON.parse(decodedJson);
        userRole = payload.role || payload.user?.role || null;
      }
    } catch (error) {
      // ignore invalid token error
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/auth";

  const protectedCustomerRoutes = [
    "/account",
    "/checkout",
    "/order",
    "/payment",
    "/wishlist",
  ];

  const isProtectedCustomerRoute = protectedCustomerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. admin and super_admin only url : admin
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "admin" && userRole !== "super_admin") {
      // Redirect to home if logged in but not admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. customer url with auth: account, checkout, order, payment, wishlist
  // unauthorized user cant go to page that need auth
  if (isProtectedCustomerRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. auth user cant go to auth if already login
  // if (isAuthRoute) {
  //   if (isAuthenticated) {
  //     if (userRole === "admin" || userRole === "super_admin") {
  //       return NextResponse.redirect(new URL("/admin", request.url));
  //     }
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  // // 4. admins can ONLY access admin routes
  // if (isAuthenticated && (userRole === "admin" || userRole === "super_admin")) {
  //   if (!isAdminRoute && !isAuthRoute) {
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
