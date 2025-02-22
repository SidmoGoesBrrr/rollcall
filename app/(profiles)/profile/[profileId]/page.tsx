import * as React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
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

  // Query Supabase for user details
  const { data, error } = await supabase
    .from('users')
    .select('username, gender, year_of_study, age, major, questions, clubs, residency, origin')
    .eq('username', profileId)
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
  readonly params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params;
  console.log('Received profileId:', profileId);

  const profile = await fetchProfile(profileId);
  console.log('Profile fetched:', profile);

  if (!profile) {
    return notFound(); // Show Next.js 404 page
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">{profile.username}'s Profile</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <p className="text-lg font-semibold text-gray-200"><strong>Gender:</strong> {profile.gender}</p>
        <p className="text-lg font-semibold text-gray-200"><strong>Year of Study:</strong> {profile.year_of_study}</p>
        <p className="text-lg font-semibold text-gray-200"><strong>Age:</strong> {profile.age}</p>
        <p className="text-lg font-semibold text-gray-200"><strong>Major:</strong> {profile.major}</p>
        <p className="text-lg font-semibold text-gray-200"><strong>Residency:</strong> {profile.residency}</p>
        <p className="text-lg font-semibold text-gray-200"><strong>Origin:</strong> {profile.origin}</p>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-300">Questions:</h2>
          <ul className="list-disc list-inside text-gray-200">
            {profile.questions.length > 0 ? (
              profile.questions.map((q, index) => <li key={index}>{q}</li>)
            ) : (
              <p className="text-gray-400">No questions provided.</p>
            )}
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-300">Clubs:</h2>
          <ul className="list-disc list-inside text-gray-200">
            {profile.clubs.length > 0 ? (
              profile.clubs.map((club, index) => <li key={index}>{club}</li>)
            ) : (
              <p className="text-gray-400">Not part of any clubs.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}