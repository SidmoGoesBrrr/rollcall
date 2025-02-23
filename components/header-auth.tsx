// File path: components/header-auth.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { CircleUser } from "lucide-react";

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<{ unique_id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile using their email from the session.
  const fetchUser = async (userEmail?: string) => {
    setLoading(true);

    if (!userEmail) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      userEmail = session?.user?.email || undefined;
    }

    if (!userEmail) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("unique_id, username")
      .eq("email", userEmail)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching user profile:", error?.message || "No user found");
      setUser(null);
    } else {
      setUser(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch of the user profile
    fetchUser();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          if (session?.user?.email) {
            fetchUser(session.user.email);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="text-sm px-2">Loading...</p>;
  }

  if (!user) {
    // If no user is logged in, show Sign in / Sign up
    return (
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // If user is logged in, show link to their profile
  return (
    <div className="flex items-center gap-4">
      <Link href={`/profile/${user.username}`}>
        <CircleUser size={24} className="cursor-pointer" />
      </Link>
    </div>
  );
}
