import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If environment variables are not set, show a warning
  if (!hasEnvVars) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 text-sm">
        <Badge
          variant="default"
          className="font-normal pointer-events-none text-center"
        >
          Please update .env.local file with anon key and url
        </Badge>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            disabled
            className="opacity-75 cursor-not-allowed pointer-events-none"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="default"
            disabled
            className="opacity-75 cursor-not-allowed pointer-events-none"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // User is signed in
  if (user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 text-sm">
        {/* Remove user.email and just say "Hey!" or any other greeting */}
        <span className="text-center">Hey!</span>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  // User is signed out
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