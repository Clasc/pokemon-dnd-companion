import { redirect } from "next/navigation";

/**
 * Root path redirect.
 * The application now uses /dashboard as the canonical landing page.
 */
export default function RootPage() {
  redirect("/dashboard");
  return null;
}
