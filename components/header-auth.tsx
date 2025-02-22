import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient as createClientFromClient } from "@/utils/supabase/client";
import { createClient as createClientFromServer } from "@/utils/supabase/server";
import { CircleUser } from "lucide-react";
import {cookies} from "next/headers";
export default async function AuthButton() {
  const supabase_client = await createClientFromClient();
  const supabase_server = await createClientFromServer();
  const {
    data: { user },
  } = await supabase_server.auth.getUser();
  
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
 if (user) {
    // Retrieve usernameID from cookies
    const usernameID = (await cookies()).get("usernameID")?.value;
    const { data, error } = await supabase_client
    .from('users')
    .select('unique_id, username')
    .eq('unique_id', usernameID)
    .single();
    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    const username = data?.username;
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 text-sm">
        {/* Profile icon that links to the user's profile page */}
        <Link href={`/profile/${username}`}>
          <CircleUser size={24} className="cursor-pointer" />
        </Link>
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