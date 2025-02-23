"use client";
import { useEffect, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getCookie, setCookie } from "cookies-next";

const supabase = createClient();

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-50">
      {/* Dotted Background covering the entire page */}
      <div className="absolute inset-0 z-0 bg-dots" />
      
      <div className="relative z-10 w-[900px] max-w-3xl px-4 pt-32">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Stunite
        </h1>
        <p className="text-lg text-center mb-2">
          Stunite is a platform where you can meet friends you actually like.
        </p>
        <p className="text-lg text-center mb-32">
          To get started, please fill out the form below.
        </p>
        <OnboardingForm/>
      </div>

      <style jsx>{`
        .bg-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 15px 15px;
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
}
