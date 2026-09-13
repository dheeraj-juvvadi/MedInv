import { getCurrentDeploymentMode } from "@/lib/mysql";
import LoginPage from "./login-client";

// Runtime configuration controls demo access, including on Vercel.
export const dynamic = "force-dynamic";

export default function Login() {
  return <LoginPage demo={getCurrentDeploymentMode() === "demo"} />;
}
