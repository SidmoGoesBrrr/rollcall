'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);
      
      // Now send the avatar URL to Supabase to update the user's profile
      await updateAvatarUrlInSupabase(newBlob.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAvatarUrlInSupabase = async (avatarUrl: string) => {
    try {
      const profileId = 'your-profile-id'; // Replace with the actual profile ID, e.g., from the logged-in user session
      const response = await fetch(`/api/update-avatar-url`, {
        method: 'POST',
        body: JSON.stringify({ avatarUrl, profileId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar URL in Supabase');
      }

      console.log('Avatar URL updated successfully in Supabase');
    } catch (error) {
      console.error('Error updating avatar URL in Supabase:', error);
    }
  };

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form onSubmit={handleUpload}>
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {blob && (
        <div>
          Blob URL: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}