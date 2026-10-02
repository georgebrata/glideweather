"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Button, Stack } from "@mui/material";
import { useLocaleText } from "./LocaleContext";

const authButtonSx = {
  borderRadius: 999,
  border: "1px solid var(--border-flight)",
  bgcolor: "background.paper",
  minWidth: 44,
  height: 44,
  px: 1.5,
  textTransform: "none" as const,
  fontWeight: 600,
  fontSize: "0.8125rem",
  whiteSpace: "nowrap" as const,
};

export const AuthControls = () => {
  const { t } = useLocaleText();

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
      <Show when="signed-out">
        <SignInButton mode="redirect" forceRedirectUrl="/">
          <Button variant="outlined" size="small" startIcon={<LoginIcon fontSize="small" />} sx={authButtonSx}>
            {t.auth.signIn}
          </Button>
        </SignInButton>
        <SignUpButton mode="redirect" forceRedirectUrl="/">
          <Button variant="outlined" size="small" startIcon={<PersonAddIcon fontSize="small" />} sx={authButtonSx}>
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
            <UserButton.Link label={t.auth.profile} labelIcon={<AccountCircleOutlinedIcon fontSize="small" />} href="/profile" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </Stack>
  );
};
