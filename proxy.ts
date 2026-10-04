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

const isSamePathRewrite = (request: NextRequest, rewrite: string) => {
  try {
    const target = new URL(rewrite);
    return target.pathname === request.nextUrl.pathname && target.search === request.nextUrl.search;
  } catch {
    return false;
  }
};

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const authOn = await authEnabled(request);

  if (!authOn) {
    if (isAuthRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const response = await handleClerk(request, event);
  if (!response) {
    return NextResponse.next();
  }
  const accept = request.headers.get("accept") ?? "";
  const rewrite = response.headers.get("x-middleware-rewrite");
  // Playwright's webServer check is a GET / with Accept: */* and no Next.js
  // flight headers. Clerk rewrites that probe onto itself, and Next follows
  // the rewrite back into this proxy until the check times out.
  const isReadinessProbe =
    request.method === "GET" &&
    request.nextUrl.pathname === "/" &&
    accept === "*/*" &&
    !request.headers.has("rsc") &&
    !request.headers.has("next-url");
  if (rewrite && isReadinessProbe && isSamePathRewrite(request, rewrite)) {
    response.headers.delete("x-middleware-rewrite");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
