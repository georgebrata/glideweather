import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authEnabled } from "./flags";

const handleClerk = clerkMiddleware();

const isAuthRoute = (pathname: string) =>
  pathname === "/sign-in" ||
  pathname.startsWith("/sign-in/") ||
  pathname === "/sign-up" ||
  pathname.startsWith("/sign-up/") ||
  pathname === "/profile" ||
  pathname.startsWith("/profile/");

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const authOn = await authEnabled(request);

  if (!authOn) {
    if (isAuthRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return handleClerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
