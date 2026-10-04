import { authEnabled } from "../../flags";
import { ClerkAppShell } from "@/app/components/auth/ClerkAppShell";

export default async function ClerkLayout({ children }: { children: React.ReactNode }) {
  const authOn = await authEnabled();
  if (!authOn) {
    return children;
  }
  return <ClerkAppShell>{children}</ClerkAppShell>;
}
