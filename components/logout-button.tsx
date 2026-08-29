"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton(props: Omit<ButtonProps, "onClick">) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button type="button" onClick={logout} {...props}>
      Logout
    </Button>
  );
}
