"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LogIn, UserCircle, UserPlus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLocaleText } from "./LocaleContext";

export const AuthControls = () => {
  const { t } = useLocaleText();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="redirect" forceRedirectUrl="/">
          <Button type="button" variant="pill" size="pill" className="gap-1.5">
            <LogIn className="size-4" />
            {t.auth.signIn}
          </Button>
        </SignInButton>
        <SignUpButton mode="redirect" forceRedirectUrl="/">
          <Button type="button" variant="pill" size="pill" className="gap-1.5">
            <UserPlus className="size-4" />
            {t.auth.signUp}
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 44,
                height: 44,
              },
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label={t.auth.profile}
              labelIcon={<UserCircle className="size-4" />}
              href="/profile"
            />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </div>
  );
};
