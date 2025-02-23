"use client";
import { ThumbsUp } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'

export default function ScrollPage() {


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
            name: "Emma Brown",
            age: "25",
            gender: "Female",
            status: "Junior",
            field: "Biotechnology",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
            ans_1: "A medical breakthrough in my family inspired me to study biotechnology.",
            ans_2: "I want to research genetic engineering to improve healthcare.",
            ans_3: "Always ask questions and seek innovation."
        },
        {
            name: "David Lee",
            age: "30",
            gender: "Male",
            status: "PhD Student",
            field: "Physics",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
            ans_1: "My fascination with space and time led me to physics.",
            ans_2: "I hope to contribute to quantum mechanics research.",
            ans_3: "Never be afraid to explore the unknown."
        },
        {
            name: "Sophia Martinez",
            age: "24",
            gender: "Female",
            status: "Medical Student",
            field: "Medicine",
            image: "https://images.unsplash.com/photo-1582134121354-1395d9d3f3e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
            ans_1: "Witnessing doctors save lives motivated me to become one.",
            ans_2: "I aspire to specialize in pediatric surgery.",
            ans_3: "Dedication and empathy are the foundation of medicine."
        }
    ];

    return (
        <div className="relative h-screen overflow-y-auto flex flex-col items-center gap-10">
            {profiles.map((profile, index) => {
                const profileUrl = `/profile/${profile.name.toLowerCase().replace(/\s+/g, "-")}`;

                return (
                    <div key={index} className="w-[438px] h-[750px] rounded-3xl shadow-xl p-5 flex flex-col bg-white">
                        {/* Clickable Profile Image */}
                        <a href={profileUrl} className="h-[438px] w-full bg-gray-100 rounded-lg overflow-hidden block">
                            <img
                                src={profile.image}
                                alt={`${profile.name} Profile`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </a>

                        {/* Data Block */}
                        <div className="mt-5 w-full bg-gray-500 p-5 rounded-lg text-center text-white relative">
                            {/* Like Button */}
                            <button className="absolute top-5 right-5 p-3 bg-gray-600 rounded-full hover:bg-blue-500 transition flex items-center justify-center">
                                <ThumbsUp className="text-white text-5xl" />
                            </button>

                            <span className="text-4xl font-bold">{profile.name}</span>
                            <span className="block text-2xl mt-3">
                                {profile.age} | {profile.gender} | {profile.status}
                            </span>
                            <span className="block text-2xl">{profile.field}</span>

                            {/* Hover Question Buttons */}
                            <div className="mt-5 flex flex-col gap-2">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                            What inspired you to study {profile.field}?
                                        </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-slate-100 text-black">{profile.ans_1}</HoverCardContent>
                                </HoverCard>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                            What are your career goals?
                                        </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-slate-100 text-black">{profile.ans_2}</HoverCardContent>
                                </HoverCard>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                            What advice do you have for students?
                                        </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-slate-100 text-black">{profile.ans_3}</HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
