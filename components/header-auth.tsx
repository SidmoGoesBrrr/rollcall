"use client"; // ✅ Convert to a Client Component

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { CircleUser } from "lucide-react";
import { getCookie } from "cookies-next"; // ✅ Fetch cookies on the client

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<{ unique_id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const usernameID = getCookie("usernameID");

      if (!usernameID) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("unique_id, username")
        .eq("unique_id", usernameID)
        .single();

      if (error || !data) {
        console.error("Error fetching user profile:", error?.message || "No user found");
        setUser(null);
      } else {
        setUser(data);
      }

      setLoading(false);
    };

    fetchUser();

    // ✅ Listen for login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser(); // Re-fetch user data on auth change
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
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

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 text-sm">
      <Link href={`/profile/${user.username}`}>
        <CircleUser size={24} className="cursor-pointer" />
      </Link>
    </div>
  );
}
