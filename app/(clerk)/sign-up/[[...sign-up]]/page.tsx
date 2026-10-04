import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { authEnabled } from "@/flags";
export default async function SignUpPage() {
  const authOn = await authEnabled();
  if (!authOn) {
    redirect("/");
  }

  return (
    <div className="nocturne-canvas flex min-h-screen items-center justify-center p-4">
      <SignUp />
    </div>
  );
}
