// File: app/(auth-pages)/sign-up/page.tsx
"use client";

import { Suspense } from "react";
import { signUpAction } from "@/app/actions"; // Ensure you have this action defined
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SignUpContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  return (
    <div className="w-full max-w-sm mx-auto pt-32 px-4">
      <form className="flex flex-col">
        <h1 className="text-2xl font-medium text-center">Sign up</h1>
        <p className="text-sm text-foreground text-center">
          Already have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="username">Username</Label>
          <Input name="username" placeholder="your username" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={8}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing Up...">
            Sign up
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
