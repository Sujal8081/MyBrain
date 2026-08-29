"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brain } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ec] text-[#377458]">
          <Brain aria-hidden="true" className="h-6 w-6" />
        </span>
        <p className="mt-3 text-xl font-semibold tracking-tight text-[#26312d]">
          MyBrain
        </p>
      </div>
      <Card className="rounded-2xl border-[#dde3df] shadow-[0_18px_50px_rgba(39,55,48,0.08)]">
        <CardHeader className="space-y-2 p-6 pb-4 sm:p-8 sm:pb-5">
          <CardTitle className="text-2xl tracking-[-0.025em] text-[#26312d]">
            Create your account
          </CardTitle>
          <CardDescription className="leading-6 text-[#66726d]">
            Start building a quieter place for your tasks and thoughts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-[#fafbf9] px-4"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-[#fafbf9] px-4"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-12 rounded-xl bg-[#fafbf9] px-4"
                />
              </div>
              {error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="min-h-12 w-full rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-[#66726d]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[#356f9f] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
