"use client"; // ✅ Client Component for form interactions
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { PutBlobResult } from '@vercel/blob';

const supabase = createClient();

interface EditProfileProps {
  profile: {
    username: string;
    gender: string;
    year_of_study: string;
    age: number;
    major: string;
    residency: string;
    origin: string;
    avatar_link: string | null;
  };
  profileId: string;
}

export default function EditProfileForm({ profile, profileId }: Readonly<EditProfileProps>) {
  const router = useRouter();
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function updateAvatarLinkInSupabase(profileId: string, avatarLink: string) {
    const { error } = await supabase
      .from('users')
      .update({ avatar_link: avatarLink })
      .eq('username', profileId);
  
    if (error) {
      console.error('Error updating avatar URL in Supabase:', error.message);
    }
  }

  async function handleAvatarUpload(event: React.FormEvent) {
    event.preventDefault();
  
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
  
    const file = inputFileRef.current.files[0];
  

    const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
      method: 'POST',
      body: file,
    });
  
    if (!response.ok) {
      console.error('Failed to upload file', response.status, response.statusText);
      throw new Error('Failed to upload avatar');
    }
  
    const newBlob = await response.json();
    setBlob(newBlob);
  
    // Assuming the newBlob contains a property 'url' with the uploaded file URL
    const avatarLink = newBlob.url;
  
    // Update the avatar URL in Supabase
    await updateAvatarLinkInSupabase(profileId, avatarLink);
  
    // Optionally, you can store this URL in the profile's avatar URL field
    setUpdatedProfile((prev) => ({
      ...prev,
      avatar_link: avatarLink, // Update the avatar URL in state as well
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("users")
      .update({
        gender: updatedProfile.gender,
        year_of_study: updatedProfile.year_of_study,
        age: updatedProfile.age,
        major: updatedProfile.major,
        residency: updatedProfile.residency,
        origin: updatedProfile.origin,
        avatar_link: updatedProfile.avatar_link, // Save the avatar URL in the database
      })
      .eq("username", profileId);

    setLoading(false);

    if (error) {
      console.error("Error updating profile:", error.message);
      setError("Failed to update profile.");
    } else {
      router.push(`/profile/${profileId}`); // ✅ Redirect to profile page after saving
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <label className="block mb-2">
          <span>Gender:</span>
          <input
            type="text"
            name="gender"
            value={updatedProfile.gender}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        <label className="block mb-2">
          <span>Year of Study:</span>
          <input
            type="text"
            name="year_of_study"
            value={updatedProfile.year_of_study}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        <label className="block mb-2">
          <span>Age:</span>
          <input
            type="number"
            name="age"
            value={updatedProfile.age}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        <label className="block mb-2">
          <span>Major:</span>
          <input
            type="text"
            name="major"
            value={updatedProfile.major}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        <label className="block mb-2">
          <span>Residency:</span>
          <input
            type="text"
            name="residency"
            value={updatedProfile.residency}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        <label className="block mb-2">
          <span>Origin:</span>
          <input
            type="text"
            name="origin"
            value={updatedProfile.origin}
            onChange={handleChange}
            className="w-full p-2 rounded text-white"
          />
        </label>

        {/* Avatar Upload Section */}
        <label className="block mb-2">
          <span>Avatar:</span>
          <input
            ref={inputFileRef}
            type="file"
            className="w-full p-2 rounded text-white"
            onChange={handleAvatarUpload}
          />
        </label>

        {blob && (
          <div>
            Image uploaded successfully! <img src={blob.url} alt="Uploaded Avatar" />
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}