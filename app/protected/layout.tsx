import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/mybrain/app-shell";
import { createClient } from "@/lib/supabase/server";

async function AuthenticatedAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const email =
    typeof data.claims.email === "string" ? data.claims.email : undefined;

  return (
    <AppShell email={email}>{children}</AppShell>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-[#F7F8F6] text-sm text-[#66716C]">
          Loading MyBrain…
        </div>
      }
    >
      <AuthenticatedAppShell>{children}</AuthenticatedAppShell>
    </Suspense>
  );
}
