import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#F7F8F6] px-5 py-10 sm:p-8">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </main>
  );
}
