"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackLogin } from "@/app/lib/analytics";

const PENDING_LOGIN_KEY = "glideweather:pending-login";

export const LoginAnalytics = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || isSignedIn) {
      return;
    }

    if (pathname.startsWith("/sign-in")) {
      sessionStorage.setItem(PENDING_LOGIN_KEY, "1");
      return;
    }

    if (pathname.startsWith("/sign-up")) {
      sessionStorage.removeItem(PENDING_LOGIN_KEY);
    }
  }, [isLoaded, isSignedIn, pathname]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    if (sessionStorage.getItem(PENDING_LOGIN_KEY) !== "1") {
      return;
    }

    sessionStorage.removeItem(PENDING_LOGIN_KEY);
    trackLogin();
  }, [isLoaded, isSignedIn]);

  return null;
};
