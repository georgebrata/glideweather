import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { authEnabled } from "@/flags";
import { ProfileRouteClient } from "@/app/components/profile/ProfileRouteClient";

export default async function ProfileRoute() {
  const authOn = await authEnabled();
  if (!authOn) {
    redirect("/");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return <ProfileRouteClient />;
}
