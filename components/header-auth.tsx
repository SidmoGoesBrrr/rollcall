// components/header-auth.tsx
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { CircleUser } from "lucide-react";
import { cookies } from "next/headers";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function AuthButton() {
  const supabase_client = await createClient();

  // Show an error message if env vars are not set.
  if (!hasEnvVars) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 text-sm">
        <Badge variant="default" className="font-normal pointer-events-none text-center">
          Please update .env.local file with anon key and url
        </Badge>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild size="sm" variant="outline" disabled className="opacity-75 cursor-not-allowed pointer-events-none">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="default" disabled className="opacity-75 cursor-not-allowed pointer-events-none">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check for the "usernameID" cookie.
  const cookieStore = await cookies();
  const usernameID = cookieStore.get("usernameID")?.value;
  console.log(`Cookie usernameID: ${usernameID}`);

  // If the cookie does not exist, render the sign in/sign up buttons.
  if (!usernameID) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 p-4 text-sm">
        <Button asChild size="sm" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // If the cookie exists, query for the user's profile.
  const { data, error } = await supabase_client
    .from('users')
    .select('unique_id, username')
    .eq('unique_id', usernameID)
    .single();

  if (error || !data) {
    console.error("Error fetching profile:", error ? error.message : "No user profile found");
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 p-4 text-sm">
        <Button asChild size="sm" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const username = data.username;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 text-sm">
      <Link href={`/profile/${username}`}>
        <CircleUser size={24} className="cursor-pointer" />
      </Link>
    </div>
  );
}
