// File path: components/scrollpage.tsx
"use client";
import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import confetti from "canvas-confetti";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Cookies from "js-cookie";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Helper to get the current user's social media URL using their unique_id
export async function getSocialMediaFromUniqueID(uniqueID: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("social_media")
    .eq("unique_id", uniqueID)
    .single();

  if (error || !data) {
    console.error("Error fetching social media for uniqueID:", uniqueID, error);
    return null;
  }
  return data.social_media;
}

// Helper to get the username from unique_id (already defined in your code)
export async function getUsernameFromUniqueID(uniqueID: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("unique_id", uniqueID)
    .single();

  if (error || !data) {
    console.error("Error fetching username for uniqueID:", uniqueID, error);
    return null;
  }
  return data.username;
}

export function getLoggedInUserID(): string | undefined {
  return Cookies.get("usernameID");
}

interface Profile {
  username: string;
  age: string;
  gender: string;
  year_of_study: string;
  major: string;
  questions: { [question: string]: string };
  avatar_link: string;
  social_media: string;  // User's own social media URL (e.g., their Instagram)
  email: string;         // The email address of the user (to receive mail)
}

export default function Hero() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from("users")
        .select(
          "username, age, gender, year_of_study, major, questions, avatar_link, social_media, email"
        );
      if (error) {
        console.error("Error fetching profiles:", error);
      } else if (data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  async function updateLikers(
    likedProfileUsername: string,
    likerUsername: string,
    remove: boolean
  ) {
    const { data, error } = await supabase
      .from("users")
      .select("likers")
      .eq("username", likedProfileUsername)
      .single();

    if (error) {
      console.error("Error fetching likers:", error);
      return;
    }

    let currentLikers: string[] = data.likers || [];

    if (remove) {
      currentLikers = currentLikers.filter((liker) => liker !== likerUsername);
    } else {
      if (!currentLikers.includes(likerUsername)) {
        currentLikers.push(likerUsername);
      }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ likers: currentLikers })
      .eq("username", likedProfileUsername);

    if (updateError) {
      console.error("Error updating likers:", updateError);
    }
  }
  
  // Function to send an email using the provided variables
const sendEmail = async (profile: Profile, likerUsername: string, likerSocialMedia: string) => {
  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: profile.email,              // Email of the person who is liked
        firstName: profile.username,    // Their username (first name)
        likedBy: likerUsername,         // The user who liked the profile
        social_media: likerSocialMedia, // YOUR (the liker's) social media URL
        SiteURL: "https://stunite.tech", // Constant URL
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to send email");
    console.log("Email sent successfully!");
  } catch (err: any) {
    console.error("Error sending email:", err.message);
  }
};

  const handleLike = async (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const currentUserUniqueID = getLoggedInUserID();
    if (!currentUserUniqueID) {
      console.error("User is not logged in");
      return;
    }
  
    // Capture the target and compute the confetti origin immediately
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
  
    const newLikeState = !liked[index];
    setLiked((prev) => ({
      ...prev,
      [index]: newLikeState,
    }));
  
    if (newLikeState) {
      confetti({
        particleCount: 150,
        spread: 360,
        startVelocity: 40,
        decay: 0.9,
        scalar: 1.2,
        origin: { x, y },
      });
  
      // Get current user's username and social media
      const likerUsername = await getUsernameFromUniqueID(currentUserUniqueID);
      const likerSocialMedia = await getSocialMediaFromUniqueID(currentUserUniqueID);
      if (likerUsername && likerSocialMedia) {
        const likedProfile = profiles[index];
  
        await updateLikers(likedProfile.username, likerUsername, false);
  
        // Send email with YOUR (liker's) social media link
        await sendEmail(likedProfile, likerUsername, likerSocialMedia);  // Passing the liker's social media here
      }
    } else {
      // For unliking, simply remove the current user from the likers array
      const likerUsername = await getUsernameFromUniqueID(currentUserUniqueID);
      if (likerUsername) {
        const likedProfile = profiles[index];
        await updateLikers(likedProfile.username, likerUsername, true);
      }
    }
  };

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  return (
    <div
      className="snap-y snap-mandatory overflow-y-auto h-screen w-full hide-scrollbar"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        profiles.map((profile, index) => {
          const profileUrl = `/profile/${profile.username.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <div
              key={profile.username}
              className="snap-start flex-shrink-0 h-screen w-full flex items-center justify-center"
            >
              <div className="w-[438px] h-[750px] rounded-3xl shadow-xl p-5 flex flex-col bg-white">
                <a
                  href={profileUrl}
                  className="h-[438px] w-full bg-gray-100 rounded-lg overflow-hidden block"
                >
                  <img
                    src={
                      profile.avatar_link ||
                      "https://ymmorqp8r30uwwon.public.blob.vercel-storage.com/sid-2WA1MmsfN7s0pnc5WbgWBPuwY14w58.png"
                    }
                    alt={`${profile.username} Profile`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </a>

                <div className="mt-5 w-full bg-gray-500 p-5 rounded-lg text-center text-white relative">
                  <button
                    className={`absolute top-5 right-5 p-3 rounded-full transition-all duration-300 transform ${
                      liked[index]
                        ? "bg-blue-900 scale-125"
                        : "bg-gray-600 hover:bg-blue-500"
                    }`}
                    onClick={(event) => handleLike(index, event)}
                  >
                    <ThumbsUp className="text-white text-2xl" />
                  </button>

                  <span className="text-2xl font-bold block">
                    {profile.username}
                  </span>
                  <span className="block text-lg mt-3">
                    {profile.age} | {profile.gender} | {profile.year_of_study}
                  </span>
                  <span className="block text-lg">{profile.major}</span>

                  <div className="mt-5 flex flex-col gap-2">
                    {Object.entries(profile.questions)
                      .filter(([question, answer]) => answer && answer.trim() !== "")
                      .map(([question, answer], idx) => (
                        <HoverCard key={idx}>
                          <HoverCardTrigger asChild>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                              {question}
                            </button>
                          </HoverCardTrigger>
                          <HoverCardContent className="bg-slate-100 text-black p-3 rounded-md shadow-md">
                            {answer}
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}