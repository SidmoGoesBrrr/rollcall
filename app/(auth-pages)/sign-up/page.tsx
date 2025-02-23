// File: app/(auth-pages)/sign-up/page.tsx
"use client";

import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Signup() {
  const searchParams = useSearchParams();
  // e.g. "Password should contain at least one character of each:\nabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789."
  const errorMessage = searchParams.get("error");

  return (
    <div className="w-full max-w-sm mx-auto pt-32 px-4">
      <form className="flex flex-col">
        <h1 className="text-2xl font-medium text-center">Sign up</h1>
        <p className="text-sm text-foreground text-center">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={8}
            required
          />
         
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
        </div>
      </form>

      {/* Error message rendered below text boxes with background styling and whitespace preservation */}
      {errorMessage && (
        <div
          className="mt-6 p-4 rounded bg-red-100 border border-red-400 text-red-700 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        />
      )}
    </div>
  );
}