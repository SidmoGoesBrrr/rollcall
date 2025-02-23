"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getCookie, setCookie } from "cookies-next";

const supabase = createClient();

export default function OnboardingPage() {
  //reload the page to get the cookie
  useEffect(() => {
    window.location.reload();
  }
  , []);
  // State for each field of the onboarding form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");
  const [origin, setOrigin] = useState("");
  const [residency, setResidency] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  // Fetch and set the cookie
  async function fetchAndSetCookie() {
    // Fetch the logged-in user via Supabase auth
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    // Check if the user's email exists
    if (data?.user?.email) {
      // Query the "users" table for the record matching the user's email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("unique_id")
        .eq("email", data.user.email)
        .maybeSingle();
      if (userError) {
        console.error("Error fetching user profile:", userError);
        return;
      }
      if (userData?.unique_id) {
        // Set the cookie with the user's unique_id from the users table
        setCookie("usernameID", userData.unique_id, { maxAge: 60 * 60 * 24 * 7, path: "/" });
        console.log("usernameID cookie set to:", userData.unique_id);
      } else {
        console.error("No user profile found for email:", data.user.email);
      }
    } else {
      console.error("No logged in user found.");
    }
  }
  
  // Check for the cookie on component mount.
  useEffect(() => {
    const cookieValue = getCookie("usernameID");
    if (!cookieValue) {
      fetchAndSetCookie();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Retrieve the user identifier using the client-side getCookie
    const usernameID = getCookie("usernameID");
    if (!usernameID) {
      console.error("usernameID cookie is missing");
      return;
    }

    // Update the user's record with the form values.
    const { data, error } = await supabase
      .from("users")
      .update({
        username,
        email,
        age: Number(age),
        gender,
        major,
        origin,
        residency,
        year_of_study: yearOfStudy,
        onboarding_complete: false,
      })
      .eq("unique_id", usernameID);

    if (error) {
      console.error("Error updating user:", error);
      return;
    }
    console.log("User updated successfully:", data);
    // Optionally, navigate to the next step in your onboarding flow here.
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Major:
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Origin:
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Residency:
          <input
            type="text"
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Year of Study:
          <input
            type="text"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <Button type="submit">Next</Button>
      </form>
    </div>
  );
}
