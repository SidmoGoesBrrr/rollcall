"use client";
import { ThumbsUp } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from "framer-motion";

export default function Hero() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const handleLike = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    setLiked((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    if (!liked[index]) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 150,
        spread: 360,
        startVelocity: 40,
        decay: 0.9,
        scalar: 1.2,
        origin: { x, y }
      });
    }
  };

  const profiles = [
    { 
      name: "Jane Doe", 
      age: "28", 
      gender: "Female", 
      status: "Senior", 
      field: "Computer Science", 
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
      ans_1: "My father inspired me to pursue this field as he was a software engineer.",
      ans_2: "I aspire to work in AI development and contribute to cutting-edge technology.",
      ans_3: "Stay curious and never stop coding!"
    },
    { 
      name: "John Smith", 
      age: "33", 
      gender: "Male", 
      status: "Graduate", 
      field: "Business", 
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
      ans_1: "My mother was an entrepreneur, and she motivated me to study business.",
      ans_2: "I aim to launch my own startup focused on financial technology.",
      ans_3: "Networking and continuous learning are key to success."
    },
    { 
      name: "Emily Carter", 
      age: "25", 
      gender: "Female", 
      status: "Junior", 
      field: "Psychology", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
      ans_1: "I've always been fascinated by human behavior and mental health.",
      ans_2: "I want to become a clinical psychologist and help people overcome challenges.",
      ans_3: "Empathy and active listening go a long way in understanding others."
    },
    { 
      name: "Michael Lee", 
      age: "30", 
      gender: "Male", 
      status: "PhD Student", 
      field: "Physics", 
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
      ans_1: "Watching space documentaries as a child sparked my love for physics.",
      ans_2: "I want to research quantum mechanics and contribute to scientific discoveries.",
      ans_3: "Always ask 'why'—curiosity leads to innovation."
    }
  ];
  
  return (
    <div className="snap-y snap-mandatory overflow-y-scroll h-screen w-full">
      {profiles.map((profile, index: number) => {
        const profileUrl = `/profile/${profile.name.toLowerCase().replace(/\s+/g, "-")}`;
  
        return (
          <div 
            key={index} 
            className="snap-start flex-shrink-0 h-screen w-full flex items-center justify-center"
          >
            <div className="w-[438px] h-[750px] rounded-3xl shadow-xl p-5 flex flex-col bg-white">
              <a href={profileUrl} className="h-[438px] w-full bg-gray-100 rounded-lg overflow-hidden block">
                <img
                  src={profile.image}
                  alt={`${profile.name} Profile`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </a>
              
              <div className="mt-5 w-full bg-gray-500 p-5 rounded-lg text-center text-white relative">
                <button 
                  className={`absolute top-5 right-5 p-3 rounded-full transition-all duration-300 transform ${liked[index] ? 'bg-blue-900 scale-125' : 'bg-gray-600 hover:bg-blue-500'}`} 
                  onClick={(event) => handleLike(index, event)}
                >
                  <ThumbsUp className="text-white text-2xl" />
                </button>
                
                <span className="text-2xl font-bold block">{profile.name}</span>
                <span className="block text-lg mt-3">
                  {profile.age} | {profile.gender} | {profile.status}
                </span>
                <span className="block text-lg">{profile.field}</span>

                <div className="mt-5 flex flex-col gap-2">
                  {[profile.ans_1, profile.ans_2, profile.ans_3].map((answer, i) => (
                    <HoverCard key={i}>
                      <HoverCardTrigger asChild>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                          {i === 0 ? "What inspired you?" : i === 1 ? "Career goals?" : "Advice for students?"}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-slate-100 text-black p-3 rounded-md shadow-md">{answer}</HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
