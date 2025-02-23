// File path: components/edit-page.tsx
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { PutBlobResult } from "@vercel/blob";

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
      .from("users")
      .update({ avatar_link: avatarLink })
      .eq("username", profileId);

    if (error) {
      console.error("Error updating avatar URL in Supabase:", error.message);
    }
  }

  async function handleAvatarUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    if (!response.ok) {
      console.error("Failed to upload file", response.status, response.statusText);
      throw new Error("Failed to upload avatar");
    }

    const newBlob = await response.json();
    setBlob(newBlob);

    // Assuming the newBlob contains a property 'url' with the uploaded file URL
    const avatarLink = newBlob.url;

    // Update the avatar URL in Supabase
    await updateAvatarLinkInSupabase(profileId, avatarLink);

    // Update local state to reflect the new avatar link
    setUpdatedProfile((prev) => ({
      ...prev,
      avatar_link: avatarLink,
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
        avatar_link: updatedProfile.avatar_link, // Save the avatar URL
      })
      .eq("username", profileId);

    setLoading(false);

    if (error) {
      console.error("Error updating profile:", error.message);
      setError("Failed to update profile.");
    } else {
      router.push(`/profile/${profileId}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h1>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full text-gray-800"
      >
        {/* Show any error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* GENDER */}
        <label className="block mb-2 font-semibold" htmlFor="gender">
          Gender:
        </label>
        <input
          id="gender"
          type="text"
          name="gender"
          value={updatedProfile.gender}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* YEAR OF STUDY */}
        <label className="block mb-2 font-semibold" htmlFor="year_of_study">
          Year of Study:
        </label>
        <input
          id="year_of_study"
          type="text"
          name="year_of_study"
          value={updatedProfile.year_of_study}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* AGE */}
        <label className="block mb-2 font-semibold" htmlFor="age">
          Age:
        </label>
        <input
          id="age"
          type="number"
          name="age"
          value={updatedProfile.age}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* MAJOR */}
        <label className="block mb-2 font-semibold" htmlFor="major">
          Major:
        </label>
        <input
          id="major"
          type="text"
          name="major"
          value={updatedProfile.major}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* RESIDENCY */}
        <label className="block mb-2 font-semibold" htmlFor="residency">
          Residency:
        </label>
        <input
          id="residency"
          type="text"
          name="residency"
          value={updatedProfile.residency}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* ORIGIN */}
        <label className="block mb-2 font-semibold" htmlFor="origin">
          Origin:
        </label>
        <input
          id="origin"
          type="text"
          name="origin"
          value={updatedProfile.origin}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />

        {/* AVATAR UPLOAD */}
        <label className="block mb-2 font-semibold">
          Avatar:
        </label>
        <div className="mb-4">
          {/* Custom button to trigger file input */}
          <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer inline-block">
            Choose File
            <input
              ref={inputFileRef}
              type="file"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
          {blob && (
            <div className="mt-2">
              <p className="text-green-600 font-semibold">File uploaded!</p>
              <img
                src={blob.url}
                alt="Uploaded Avatar"
                className="w-16 h-16 object-cover rounded mt-1"
              />
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
