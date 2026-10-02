import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const authEnabled = flag<boolean>({
  key: "auth",
  adapter: vercelAdapter(),
  description: "Is authentication enabled?",
  defaultValue: true,
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
});
