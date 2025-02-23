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

export async function getUsernameFromUniqueID(uniqueID: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("unique_id", uniqueID)
    .single();

  if (error || !data) {
    console.error("Error fetching username for unique_id:", uniqueID, error);
    return null;
  }
  return data.username;
}


export function getLoggedInUserID(): string | undefined {
  const loggedInUserID = Cookies.get("usernameID");
  return loggedInUserID;
}

interface Profile {
  username: string;
  age: string;
  gender: string;
  year_of_study: string;
  major: string;
  questions: { [question: string]: string };
  avatar_link: string;
}

export default function Hero() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const supabase = createClient();


  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from("users")
        .select("username, age, gender, year_of_study, major, questions, avatar_link");
      if (error) {
        console.error("Error fetching profiles:", error);
      } else if (data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, [supabase]);

  // Function to update the likers array in Supabase
  async function updateLikers(
    likedProfileUsername: string,
    likerUsername: string,
    remove: boolean
  ) {
    // Fetch the current likers array for the liked profile
    const { data, error } = await supabase
      .from("users")
      .select("likers")
      .eq("username", likedProfileUsername)
      .single();
  
    if (error) {
      console.error("Error fetching likers:", error);
      return;
    }
  
    // Ensure we have an array (default to empty)
    let currentLikers: string[] = data.likers || [];
  
    if (remove) {
      // Remove the liker from the array when unliking
      currentLikers = currentLikers.filter((liker) => liker !== likerUsername);
    } else {
      // Add the liker if not already present when liking
      if (!currentLikers.includes(likerUsername)) {
        currentLikers.push(likerUsername);
      }
    }
  
    // Update the user's record with the new likers array
    const { error: updateError } = await supabase
      .from("users")
      .update({ likers: currentLikers })
      .eq("username", likedProfileUsername);
  
    if (updateError) {
      console.error("Error updating likers:", updateError);
    }
  }


  const handleLike = async (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const likerUsername = getLoggedInUserID();
    if (!likerUsername) {
      console.error("User is not logged in");
      return;
    }

    // Capture the target immediately
    const target = event.currentTarget;
    if (!target) {
      console.error("event.currentTarget is null");
      return;
    }
    
    // Compute the bounding rect synchronously
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
      const loggedInUserID = getLoggedInUserID();
      if (!loggedInUserID) {
        console.error("User is not logged in");
        return;
      }
      const likerUsername = await getUsernameFromUniqueID(loggedInUserID);
      if (likerUsername) {
        await updateLikers(profiles[index].username, likerUsername, false);
      }
    } else {
      // handle unlike: remove current user from the likers array
      if (likerUsername) {
        await updateLikers(profiles[index].username, likerUsername, true);
      }
    }
  };

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  return (
    <div className="snap-y snap-mandatory overflow-y-auto h-screen w-full hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}> 
      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        profiles.map((profile, index) => {
          const profileUrl = `/profile/${profile.username
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
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
                      profile.avatar_link
                        ? profile.avatar_link
                        : "https://ymmorqp8r30uwwon.public.blob.vercel-storage.com/sid-2WA1MmsfN7s0pnc5WbgWBPuwY14w58.png"
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
                      .map(([question, answer], index) => (
                        <HoverCard key={index}>
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
