export const e2ePassword = "GlideWeather-E2E-1!";
export const profileUserEmail = "glideweather.profile+clerk_test@example.com";
export const profileUserPhone = "+15555550100";

export function ephemeralTestPhone() {
  const line = 101 + (Date.now() % 99);
  return `+1555555${String(line).padStart(4, "0")}`;
}
export const authStateFile = "playwright/.clerk/user.json";
export const createdUsersFile = "playwright/.clerk/created-users.json";
