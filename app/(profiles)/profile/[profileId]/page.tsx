import * as React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
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

  const { data, error } = await supabase
    .from('users')
    .select(
      'unique_id, username, gender, year_of_study, age, major, questions, clubs, residency, origin, likers, avatar_link'
    )
    .ilike('username', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
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

  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen p-6 bg-transparent text-text pt-24">
      {/* Left Column: Profile Image and Basic Info */}
      <div className="md:w-1/3 flex flex-col items-center justify-between h-full">
        <div>
          <img
            src={profile.avatar_link}
            alt={`${profile.username}'s Profile`}
            className="w-60 h-60 rounded-lg object-cover shadow-lg"
          />
          <div className="bg-gray-600 p-4 rounded-lg shadow-lg text-center mt-4 w-full">
            <h1 className="text-2xl text-[#d9a14e] font-bold">
              {profile.username}
            </h1>
            <p className="text-xl text-[#cba162] font-semibold mt-2">
              {profile.age} | {profile.gender} | {profile.year_of_study}
            </p>
            <p className="text-[#e5c99d] font-semibold">{profile.major}</p>
          </div>
        </div>

        {/* Buttons at the bottom */}
        {isOwnProfile && (
          <div className="mt-6 w-full flex flex-col items-center">
            <Link
              href={`/profile/edit/${profileId}`}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg inline-flex items-center mb-2"
            >
              <Pencil className="mr-2" />
              Edit Profile
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg inline-flex items-center"
              >
                Sign Out
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Right Column: Tabs for Profile Details and Likes */}
      <div className="md:w-1/3 mt-6 md:mt-0 md:ml-6 w-full max-w-3xl">
        <Tabs defaultValue="profile">
          <TabsList className="flex space-x-4 border-b border-gray-700 w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="likes">Likes</TabsTrigger>}
          </TabsList>

          {/* Tab: Profile Details */}
          <TabsContent value="profile">
            <div className="p-4 w-[650px]">
              <ul className="space-y-3">
                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Username:</strong> {profile.username}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Age:</strong> {profile.age}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Gender:</strong> {profile.gender}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Year of Study:</strong> {profile.year_of_study}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Major:</strong> {profile.major}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Residency:</strong> {profile.residency}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Origin:</strong> {profile.origin}
                  </p>
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Clubs:</strong>
                  </p>
                  {Array.isArray(profile.clubs) ? (
                    <ul className="ml-6 list-disc text-orange-700">
                      {profile.clubs.map((club, idx) => (
                        <li key={idx}>{club}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-2 text-orange-700">
                      {profile.clubs || 'No clubs listed'}
                    </p>
                  )}
                </li>

                <li className="bg-orange-200 p-3 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-orange-600">
                    <strong>Questions:</strong>
                  </p>
                  {Array.isArray(profile.questions) ? (
                    <ul className="ml-6 list-disc text-orange-700">
                      {profile.questions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  ) : typeof profile.questions === 'object' &&
                    profile.questions !== null ? (
                    <ul className="ml-6 list-disc text-orange-700">
                      {Object.entries(profile.questions).map(([q, a]) => (
                        <li key={q}>
                          <strong>{q}:</strong> {a}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-2 text-orange-700">
                      {profile.questions || 'No questions answered'}
                    </p>
                  )}
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* Tab: Likes (only visible if the profile owner is logged in) */}
          {isOwnProfile && (
            <TabsContent value="likes" className="flex-grow overflow-auto max-h-90">
              <div className="p-4 w-[650px]">
                {profile.likers && profile.likers.length > 0 ? (
                  <ul className="space-y-3">
                    {profile.likers.map((liker, index) => (
                      <li
                        key={index}
                        className="flex items-center bg-orange-200 p-3 rounded-lg shadow-sm"
                      >
                        <div className="text-lg font-medium text-orange-600">
                          {liker}
                        </div>
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
