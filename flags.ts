import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

const vercelFlags = vercelAdapter();

export const authEnabled = flag<boolean>({
  key: "auth",
  description: "Is authentication enabled?",
  defaultValue: true,
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
  async decide({ cookies, entities, headers }) {
    if (process.env.E2E_AUTH_TOGGLE === "1") {
      const override = cookies.get("e2e-auth")?.value;
      if (override === "0") return false;
      if (override === "1") return true;
    }

    const value = await vercelFlags.decide({
      key: "auth",
      entities,
      headers,
      cookies,
    });
    return value === true;
  },
});
