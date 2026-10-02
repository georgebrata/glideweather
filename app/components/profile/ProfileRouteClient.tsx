"use client";

import { AppProviders } from "../AppProviders";
import { UserProfilePage } from "./UserProfilePage";

export const ProfileRouteClient = () => (
  <AppProviders>
    <UserProfilePage />
  </AppProviders>
);
