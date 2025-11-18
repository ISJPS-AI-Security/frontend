// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/user",
  "/manager",
  "/admin",
  "/chat",
  "/history",
  "/terms",
  "/settings",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  const url = req.nextUrl.clone();
  const path = url.pathname;

  // If visiting protected route without token → redirect to login
  if (protectedRoutes.some((r) => path.startsWith(r)) && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Otherwise continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
