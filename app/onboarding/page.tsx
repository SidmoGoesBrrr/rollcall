"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Database, TablesInsert } from '@/database.types';

const supabase = createClient()

export default function OnboardingPage() {

  async function handleButtonClick() {
    try {
      // Check if a user with username 'akeen' already exists
      const { data: users, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'akeen');

      if (selectError) {
        console.error("Error checking user:", selectError);
        return;
      }

      if (users && users.length > 0) {
        console.log("User 'akeen' already exists:", users);
        return;
      }

      // Prepare a dummy user with random data
      const dummyUser: TablesInsert<'users'> = {
        username: 'akeen',
        email: 'akeen@example.com',
        age: Math.floor(Math.random() * 100),
        Clubs: [],
        created_at: new Date().toISOString(),
        gender: 'unknown',
        likers: [],
        major: 'dummy major',
        origin: 'dummy origin',
        questions: [],
        residency: 'dummy residency',
        year_of_study: '1'
      };

      // Insert the dummy user into the database
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert(dummyUser)
        .select();

      if (insertError) {
        console.error("Error inserting user:", insertError);
      } else {
        console.log("User inserted successfully:", insertData);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Stunite!</h1>
      <p className="mt-4">Press Me!</p>
      <Button className="mt-4" onClick={handleButtonClick}>
        Get Started
      </Button>
    </div>
  );
}
