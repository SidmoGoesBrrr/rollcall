import * as React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const supabase = createClient();

interface Profile {
  unique_id: string;
  username: string;
  gender: string;
  year_of_study: string;
  age: number;
  major: string;
  questions: string[] | Record<string, any> | string;
  clubs: string[] | string;
  residency: string;
  origin: string;
  likers: string[];
  avatar_link: string;
}

async function fetchProfile(profileId: string): Promise<Profile | null> {
  console.log('Fetching profile for:', profileId);

  // Query Supabase for user details
  const { data, error } = await supabase
    .from('users')
    .select('unique_id, username, gender, year_of_study, age, major, questions, clubs, residency, origin, likers, avatar_link')
    .ilike('username', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  console.log(profileId === data?.unique_id);
  return data;
}

export default async function ProfilePage({
  params,
}: {
  readonly params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  console.log(`Viewing profile of: ${profileId}`);

  // Get logged-in user ID from cookies (server-side)
  const cookiesStore = await cookies();
  const loggedInUserID = cookiesStore.get('usernameID')?.value;
  console.log(`Logged in User ID from cookies: ${loggedInUserID}`);

  // Fetch Profile Data
  const profile = await fetchProfile(profileId);
  if (!profile) return notFound();

  // Check if the logged-in user is the profile owner
  const isOwnProfile = loggedInUserID === profile.unique_id;
  console.log(`Is own profile? ${isOwnProfile}`);

  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen p-6 bg-transparent text-text pt-24">
      {/* Left Column: Profile Image and Basic Info */}
      <div className="md:w-1/3 flex flex-col items-start justify-center">
        <img
          src={profile.avatar_link}
          alt={`${profile.username}'s Profile`}
          className="w-60 h-60 rounded-lg object-cover shadow-lg"
        />

        <div className="bg-gray-600 p-4 rounded-lg shadow-lg text-center mt-4 w-full">
          <h1 className="text-2xl text-[#d9a14e] font-bold">{profile.username}</h1>
          <p className="text-xl text-[#cba162] font-semibold mt-2">
            {profile.age} | {profile.gender} | {profile.year_of_study}
          </p>
          <p className="text-[#e5c99d] font-semibold">{profile.major}</p>
        </div>

        {isOwnProfile && (
          <div className="mt-4 flex flex-col items-center">
            <Link
              href={`/profile/edit/${profileId}`}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg inline-flex items-center"
            >
              <Pencil className="mr-2" /> Edit Profile
            </Link>
            <form action={signOutAction} className="mt-2">
              <Button type="submit" variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Right Column: Tabs for Profile Details and Likes */}
      <div className="md:w-1/3 mt-6 md:mt-0 md:ml-6 w-full max-w-3xl">
        <Tabs defaultValue="profile">
          <TabsList className="flex space-x-4 border-b border-gray-700 w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {/* Only show Likes tab if the logged-in user is the profile owner */}
            {isOwnProfile && <TabsTrigger value="likes">Likes</TabsTrigger>}
          </TabsList>

          {/* Tab: Profile Details */}
          <TabsContent value="profile">
            <div className="p-4 ">
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
              <p>
                <strong>Age:</strong> {profile.age}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
              <p>
                <strong>Year of Study:</strong> {profile.year_of_study}
              </p>
              <p>
                <strong>Major:</strong> {profile.major}
              </p>
              <p>
                <strong>Residency:</strong> {profile.residency}
              </p>
              <p>
                <strong>Origin:</strong> {profile.origin}
              </p>
              <p>
                <strong>Clubs:</strong>{" "}
                {Array.isArray(profile.clubs)
                  ? profile.clubs.join(", ")
                  : profile.clubs || "No clubs listed"}
              </p>
              <p>
                <strong>Questions:</strong>{" "}
                {Array.isArray(profile.questions)
                  ? profile.questions.join(", ")
                  : typeof profile.questions === "object" && profile.questions !== null
                    ? Object.entries(profile.questions)
                        .map(([question, answer]) => `${question}: ${answer}`)
                        .join(" | ")
                    : profile.questions || "No questions answered"}
              </p>
            </div>
          </TabsContent>

          {/* Tab: Likes (only visible if the profile owner is logged in) */}
          {isOwnProfile && (
            <TabsContent value="likes" className="flex-grow overflow-auto max-h-90">
              <div className="p-4 w-[650px]">
                {profile.likers && profile.likers.length > 0 ? (
                  <ul className="space-y-3">
                    {profile.likers.map((liker, index) => (
                      <li key={index} className="flex items-center bg-orange-200 p-3 rounded-lg shadow-sm">
                        <div className="w-10 h-10 text-text rounded-full bg-orange-300 flex items-center justify-center text-black font-bold">
                          {liker.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-lg font-medium text-orange-600">{liker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No likes yet.</p>
                )}
              </div>
            </TabsContent>
          )}

        </Tabs>
      </div>
    </div>
  );
}