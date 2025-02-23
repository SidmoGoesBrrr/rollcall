// File path: app/(profiles)/profile/edit/[profileId]/page.tsx

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import EditProfileForm from "@/components/edit-page";
import { createClient } from "@/utils/supabase/client";

export const metadata = {
  title: "Edit Profile",
};

const supabase = createClient();

export default async function EditProfilePage({
  params,
}: {
  readonly params: Promise<{ readonly profileId: string }>;
}) {
  const { profileId } = await params;

  // Get the logged-in user ID from cookies
  const cookiesStore = await cookies();
  const loggedInUserID = cookiesStore.get("usernameID")?.value;
  console.log("🚀 Logged In User ID:", loggedInUserID);
  console.log("👀 Editing Profile ID:", profileId);

  if (!loggedInUserID) {
    console.log("❌ User is not logged in, returning 404");
    return notFound();
  }

  // Fetch the profile
  const { data: profile, error } = await supabase
    .from("users")
    .select(
      "unique_id, username, gender, year_of_study, age, major, residency, origin, avatar_link"
    )
    .eq("username", profileId)
    .single();

  if (error || !profile) {
    console.log("❌ Profile not found in database, returning 404");
    return notFound();
  }

  // Compare loggedInUserID with profile.unique_id
  if (loggedInUserID !== profile.unique_id) {
    console.log("❌ User is trying to edit someone else's profile, returning 404");
    return notFound();
  }

  console.log("✅ User is allowed to edit this profile");

  return (
    // A responsive container with top padding for the fixed nav
    <main className="pt-16 sm:pt-24 w-full max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8">
      <EditProfileForm profile={profile} profileId={profileId} />
    </main>
  );
}
