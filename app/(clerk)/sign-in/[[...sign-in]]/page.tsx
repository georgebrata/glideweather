import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { authEnabled } from "@/flags";
import { glideClerkAppearance } from "@/app/lib/clerkAppearance";

export default async function SignInPage() {
  const authOn = await authEnabled();
  if (!authOn) {
    redirect("/");
  }

  return (
    <div className="nocturne-canvas flex min-h-screen items-center justify-center p-4">
      <SignIn appearance={glideClerkAppearance} />
    </div>
  );
}
