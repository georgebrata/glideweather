import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authEnabled } from "./flags";
import {
  CONTENT_LOCALE_COOKIE,
  CONTENT_LOCALE_HEADER,
  contentLocaleFromPathname,
  isClerkScopedPath,
} from "./proxy-locale";

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

const applyContentLocale = (request: NextRequest, response: Response) => {
  const locale = contentLocaleFromPathname(request.nextUrl.pathname);
  if (response instanceof NextResponse) {
    response.cookies.set(CONTENT_LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
  }
  return response;
};

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const authOn = await authEnabled(request);

  if (!authOn) {
    if (isAuthRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      CONTENT_LOCALE_HEADER,
      contentLocaleFromPathname(request.nextUrl.pathname),
    );
    return applyContentLocale(
      request,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
  }

  if (!isClerkScopedPath(request.nextUrl.pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      CONTENT_LOCALE_HEADER,
      contentLocaleFromPathname(request.nextUrl.pathname),
    );
    return applyContentLocale(
      request,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
  }

  const response = await handleClerk(request, event);
  if (!response) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      CONTENT_LOCALE_HEADER,
      contentLocaleFromPathname(request.nextUrl.pathname),
    );
    return applyContentLocale(
      request,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
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
  return applyContentLocale(request, response);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
