// app/profile/[profileId]/page.tsx
import { notFound } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
}

async function fetchProfile(profileId: string): Promise<Profile | null> {
  console.log('Fetching profile for:', profileId);
  const profiles: Record<string, Profile> = {
    '1': { id: '1', name: 'Alice' },
    '2': { id: '2', name: 'Bob' },
  };
  const profile = profiles[profileId];
  console.log('Returning profile:', profile);
  return profile || null;
}

export default async function ProfilePage({
  params,
}: {
  params: { profileId: string };
}) {
  console.log('Received params:', params);
  const { profileId } = params;
  const profile = await fetchProfile(profileId);

  console.log('Profile fetched:', profile);

  if (!profile) {
    // For debugging, you can return a simple component instead of calling notFound()
    return <div>Profile Not Found</div>;
    // Once confirmed, you can switch back to: notFound();
  }

  return (
    <div>
      <h1>{profile.name}'s Profile</h1>
      <p>Profile ID: {profile.id}</p>
    </div>
  );
}