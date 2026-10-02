import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileRouteClient } from "../components/profile/ProfileRouteClient";

export default async function ProfileRoute() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return <ProfileRouteClient />;
}
