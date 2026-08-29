import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#f7f8f5] px-5 py-10 sm:p-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
