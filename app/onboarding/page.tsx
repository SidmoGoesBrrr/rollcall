"use client";
import { useEffect, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getCookie, setCookie } from "cookies-next";

const supabase = createClient();

export default function OnboardingPage() {
  

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">Welcome to Stunite</h1>
      <p className="text-lg text-center">
        Stunite is a platform where you can meet friends you actually like.
      </p>
      <p className="text-lg text-center">
        To get started, please fill out the form below.
      </p>
      <OnboardingForm />
    </div>
  );
}
