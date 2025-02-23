"use client";
import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  return (
    <div className="w-full max-w-sm mx-auto pt-32 px-4">
      <form className="flex flex-col">
        <h1 className="text-2xl font-medium text-center">Sign in</h1>
        <p className="text-sm text-foreground text-center">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link className="text-xs text-foreground underline" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={8}
            required
          />
          <SubmitButton formAction={signInAction} pendingText="Signing In...">
            Sign in
          </SubmitButton>
        </div>
      </form>
      <div className="mt-12 pt-6">
        {errorMessage && (
          <div
            className="p-4 rounded bg-red-100 border border-red-400 text-red-700"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
        )}
      </div>
    </div>
  );
}
