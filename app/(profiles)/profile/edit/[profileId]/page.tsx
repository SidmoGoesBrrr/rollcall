import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import EditProfileForm from "@/components/edit-page"; // ✅ Import Edit Profile Form
import { createClient } from "@/utils/supabase/client";
export const metadata = {
  title: "Edit Profile",
};

const supabase = createClient();

export default async function EditProfilePage({ params }: { readonly params: Promise<{ readonly profileId: string }> }) {
  const { profileId } = await params;

  // ✅ Get the logged-in user ID from cookies
  const cookiesStore = await cookies();
  const loggedInUserID = cookiesStore.get("usernameID")?.value;
  console.log("🚀 Logged In User ID:", loggedInUserID);
  console.log("👀 Editing Profile ID:", profileId);

  if (!loggedInUserID) {
    console.log("❌ User is not logged in, returning 404");
    return notFound();
  }

  // ✅ Fetch the profile's `unique_id` from Supabase
  const { data: profile, error } = await supabase
    .from("users")
    .select("unique_id, username, gender, year_of_study, age, major, residency, origin, avatar_link")
    .eq("username", profileId)
    .single();

  if (error || !profile) {
    console.log("❌ Profile not found in database, returning 404");
    return notFound();
  }

  console.log("✅ Profile unique_id:", profile.unique_id);

  // ✅ Compare `loggedInUserID` (UUID) with `profile.unique_id`
  if (loggedInUserID !== profile.unique_id) {
    console.log("❌ User is trying to edit someone else's profile, returning 404");
    return notFound();
  }

  console.log("✅ User is allowed to edit this profile");
  return (
    // 1️⃣ Wrap your form in a container with a subtle background
    <main className="w-[900px] p-6">
      <EditProfileForm profile={profile} profileId={profileId} />
      
    </main>
    
  );
}