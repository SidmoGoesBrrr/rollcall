import * as React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
  unique_id: string;
  username: string;
  gender: string;
  year_of_study: string;
  age: number;
  major: string;
  questions: string[];
  clubs: string[];
  residency: string;
  origin: string;
}

async function fetchProfile(profileId: string): Promise<Profile | null> {
  console.log('Fetching profile for:', profileId);

  const cookiesStore = cookies(); // ✅ FIX: No need for await
  const loggedInUserID = (await cookiesStore).get('usernameID')?.value;
  console.log("Logged in User ID from cookies:", loggedInUserID);


  const usernameID = (await cookies()).get('usernameID')?.value;
  console.log("usernameID:", usernameID);
  // Query Supabase for user details
  const { data, error } = await supabase
    .from('users')
    .select('unique_id, username, gender, year_of_study, age, major, questions, clubs, residency, origin')
    .eq('username', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  console.log(usernameID === data?.unique_id);
  return data;
}

export default async function ProfilePage({
  params,
}: {
  readonly params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params;
  console.log(`Viewing profile of: ${profileId}`);

  // ✅ Get logged-in user ID from cookies (DO NOT AWAIT)
  const cookiesStore = cookies();
  const loggedInUserID = (await cookiesStore).get('usernameID')?.value;
  console.log(`Logged in User ID from cookies: ${loggedInUserID}`);

  // ✅ Fetch Profile Data (AWAIT fetchProfile)
  const profile = await fetchProfile(profileId);
  if (!profile) return notFound();

  // ✅ Check if the logged-in user is the owner
  const isOwnProfile = loggedInUserID === profile.unique_id;
  console.log(`Is own profile? ${isOwnProfile}`);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-transparent text-white">
      {/* Profile Image */}
      <img
        src={'/default-profile.png'}
        alt={`${profile.username}'s Profile`}
        className="w-60 h-60 rounded-lg object-cover shadow-lg"
      />

      {/* Info Box */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center mt-4 w-80">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-300 mt-2">{profile.age} | {profile.gender} | {profile.year_of_study}</p>
        <p className="text-gray-300">{profile.major}</p>
      </div>

      {/* ✅ Show Edit Button ONLY if the user is on their own profile */}
      {isOwnProfile && (
        <Link
          href={`/profile/edit/${profileId}`}
          className="bg-grey-500 hover:bg-white-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg mt-4"
        >
           <Pencil />
        </Link>
      )}
    </div>
  );
}