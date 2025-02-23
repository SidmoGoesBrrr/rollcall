"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { popularMajors, popularCountries, questionOptions } from "@/data";

const supabase = createClient();

// Extend FormData to include clubs (social media is handled separately)
interface FormData {
  username: string;
  age: string;
  gender: string;
  major: string;
  origin: string;
  residency: string;
  year_of_study: string;
  clubs: string[];
}

// Step interfaces
interface InputStep {
  key: keyof FormData;
  label: string;
  type: "input";
}

interface SelectStep {
  key: keyof FormData;
  label: string;
  type: "select";
  options: string[];
}

interface MultiStep {
  key: keyof FormData;
  label: string;
  type: "multi";
}

interface CustomQuestionsStep {
  key: "customQuestions";
  label: string;
  type: "customQuestions";
}

interface SocialMediaStep {
  key: "social_media";
  label: string;
  type: "social_media";
  options: string[];
}

type Step = InputStep | SelectStep | MultiStep | CustomQuestionsStep | SocialMediaStep;

// Updated steps array with new custom questions and social media steps.
const steps: Step[] = [
  { key: "username", label: "Enter your username", type: "input" },
  { key: "age", label: "Enter your age", type: "input" },
  {
    key: "gender",
    label: "Select your gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { key: "major", label: "Enter your major", type: "input" },
  { key: "origin", label: "Enter your country of origin", type: "input" },
  {
    key: "residency",
    label: "Select your residency",
    type: "select",
    options: ["On Campus", "Off Campus"],
  },
  {
    key: "year_of_study",
    label: "Select your year of study",
    type: "select",
    options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
  },
  {
    key: "clubs",
    label: "Enter clubs you're interested in (press Enter to add)",
    type: "multi",
  },
  {
    key: "customQuestions",
    label: "Select and Answer Custom Questions",
    type: "customQuestions",
  },
  {
    key: "social_media",
    label:
      "If you want to be friends with someone, what social media do you prefer to use?",
    type: "social_media",
    options: ["Instagram", "Email"],
  },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    age: "",
    gender: "",
    major: "",
    origin: "",
    residency: "",
    year_of_study: "",
    clubs: [],
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [clubsInput, setClubsInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // For custom questions (new approach)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>(
    {}
  );

  // For social media step (handled separately)
  const [selectedSocialMediaOption, setSelectedSocialMediaOption] =
    useState<string>("Email");
  const [instagramInput, setInstagramInput] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (currentStepData.type === "select") {
      setSelectedOption(0);
    } else {
      setSelectedOption(null);
    }
    // Reset error and suggestions when step changes.
    setError("");
    setSuggestions([]);
  }, [currentStep, currentStepData.type]);

  // Autocomplete for major and origin.
  useEffect(() => {
    if (currentStepData.key === "major") {
      const value = formData.major;
      if (value.trim() !== "") {
        setSuggestions(
          popularMajors.filter(
            (m) =>
              m.toLowerCase().includes(value.toLowerCase()) &&
              m.toLowerCase() !== value.toLowerCase()
          )
        );
      } else {
        setSuggestions([]);
      }
    }
    if (currentStepData.key === "origin") {
      const value = formData.origin;
      if (value.trim() !== "") {
        setSuggestions(
          popularCountries.filter(
            (c) =>
              c.toLowerCase().includes(value.toLowerCase()) &&
              c.toLowerCase() !== value.toLowerCase()
          )
        );
      } else {
        setSuggestions([]);
      }
    }
  }, [formData.major, formData.origin, currentStepData.key]);

  // Validation helper for current step.
  async function validateStep(): Promise<boolean> {
    if (currentStepData.key === "username") {
      const username = formData.username.trim();
      if (!username) {
        setError("Username cannot be empty.");
        return false;
      }
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      if (fetchError) {
        console.error("Error checking username:", fetchError);
        setError("Error checking username. Please try again.");
        return false;
      }
      if (data) {
        setError("Username already exists. Please choose another.");
        return false;
      }
    }

    if (currentStepData.key === "age") {
      const ageNumber = Number(formData.age);
      if (isNaN(ageNumber)) {
        setError("Please enter a valid age.");
        return false;
      }
      if (ageNumber < 16) {
        setError("You must be at least 16 years old.");
        return false;
      }
      if (ageNumber > 100) {
        setError("You're kinda too old for this.");
        return false;
      }
    }

    if (currentStepData.type === "customQuestions") {
      if (selectedQuestions.length < 3) {
        setError("Please select 3 questions to answer.");
        return false;
      }
      for (const q of selectedQuestions) {
        const ans = (questionAnswers[q] || "").trim();
        if (ans.length < 10 || ans.length > 250) {
          setError(
            `Answer for "${q}" must be between 10 and 250 characters.`
          );
          return false;
        }
      }
    }

    if (currentStepData.type === "social_media") {
      if (selectedSocialMediaOption === "Instagram") {
        if (instagramInput.trim().length === 0) {
          setError("Please enter your Instagram username or link.");
          return false;
        }
      } else if (selectedSocialMediaOption === "Email") {
        if (userEmail.trim().length === 0) {
          setError("Email is required.");
          return false;
        }
      }
    }
    return true;
  }

  const handleNext = async () => {
    // For select steps, update formData using selectedOption.
    if (currentStepData.type === "select" && selectedOption !== null) {
      setFormData((prev) => ({
        ...prev,
        [currentStepData.key]:
          (currentStepData as SelectStep).options[selectedOption],
      }));
    }
    const isValid = await validateStep();
    if (!isValid) return;

    // No need to update formData for social_media here;
    // we'll determine its value at submission.
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Clubs multi-select helper: add club on pressing Enter.
  const handleClubsKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && clubsInput.trim() !== "") {
      if (!formData.clubs.includes(clubsInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          clubs: [...prev.clubs, clubsInput.trim()],
        }));
      }
      setClubsInput("");
    }
  };

  const removeClub = (club: string) => {
    setFormData((prev) => ({
      ...prev,
      clubs: prev.clubs.filter((c) => c !== club),
    }));
  };

  async function fetchAndSetCookie() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    if (data?.user?.email) {
      setUserEmail(data.user.email);
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("unique_id")
        .eq("email", data.user.email)
        .maybeSingle();
      if (userError) {
        console.error("Error fetching user profile:", userError);
        return;
      }
      if (userData?.unique_id) {
        setCookie("usernameID", userData.unique_id, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        console.log("usernameID cookie set to:", userData.unique_id);
      } else {
        console.error("No user profile found for email:", data.user.email);
      }
    } else {
      console.error("No logged in user found.");
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      let cookieValue = getCookie("usernameID");
      if (!cookieValue) {
        await fetchAndSetCookie();
      }
      const uid = getCookie("usernameID");
      if (!uid) {
        console.error("User ID cookie is not set.");
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("onboarding_complete")
        .eq("unique_id", uid)
        .maybeSingle();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data?.onboarding_complete) {
        console.log("User has already completed onboarding");
        router.push("/");
        return;
      }
    };
    checkUser();
  }, []);

  async function handleSubmit() {
    const userId = getCookie("usernameID") as string;
    if (!userId) {
      console.error("Cookie 'usernameID' not found");
      return;
    }

    // Determine social media value based on selection:
    const socialMediaValue =
      selectedSocialMediaOption === "Instagram"
        ? (() => {
            let insta = instagramInput.trim();
            if (!insta.includes("instagram.com")) {
              insta = `https://www.instagram.com/${insta}`;
            }
            return insta;
          })()
        : userEmail;

    // Prepare payload including custom questions.
    const payload = {
      username: formData.username,
      age: Number(formData.age),
      gender: formData.gender,
      major: formData.major,
      origin: formData.origin,
      residency: formData.residency,
      year_of_study: formData.year_of_study,
      clubs: formData.clubs,
      onboarding_complete: true,
      questions: questionAnswers,
      social_media: socialMediaValue,
    };
    console.log("Payload:", payload);
    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("unique_id", userId);
    if (error) {
      console.error("Error updating user:", error);
      return;
    }
    console.log("User updated successfully:", data);
    router.push("/");
  }

  // Render autocomplete input for major and origin.
  const renderAutocompleteInput = (
    key: keyof FormData,
    placeholder: string
  ) => (
    <div className="relative">
      <Input
        type="text"
        value={formData[key] as string}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [key]: e.target.value,
          }))
        }
        placeholder={placeholder}
        className="w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-200 mt-1 w-full max-h-40 overflow-y-auto z-20">
          {suggestions.map((item) => (
            <li
              key={item}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [key]: item,
                }))
              }
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Render multi-select for clubs.
  const renderMultiSelect = () => (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {formData.clubs.map((club) => (
          <span
            key={club}
            className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full flex items-center"
          >
            {club}
            <button onClick={() => removeClub(club)} className="ml-1 text-sm">
              X
            </button>
          </span>
        ))}
      </div>
      <Input
        type="text"
        value={clubsInput}
        onChange={(e) => setClubsInput(e.target.value)}
        onKeyDown={handleClubsKeyDown}
        placeholder="Type a club name and press Enter..."
        className="w-full"
      />
    </div>
  );

  // Render custom questions step using multiple buttons.
  const renderCustomQuestions = () => {
    if (selectedQuestions.length < 3) {
      return (
        <div>
          <p className="text-xl font-medium mb-2">{currentStepData.label}</p>
          <p className="mb-2">Select 3 questions to answer:</p>
          <div className="flex flex-wrap gap-2">
            {questionOptions
              .filter((q) => !selectedQuestions.includes(q))
              .map((q) => (
                <Button
                  key={q}
                  onClick={() =>
                    setSelectedQuestions((prev) => [...prev, q])
                  }
                >
                  {q}
                </Button>
              ))}
          </div>
          <div className="mt-4">
            <p className="font-medium">Selected Questions:</p>
            <ul className="list-disc pl-5">
              {selectedQuestions.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-xl font-medium mb-2">Answer the selected questions:</p>
          {selectedQuestions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{q}</p>
              <Input
                type="text"
                value={questionAnswers[q] || ""}
                onChange={(e) =>
                  setQuestionAnswers((prev) => ({
                    ...prev,
                    [q]: e.target.value,
                  }))
                }
                placeholder="Enter your answer (10-250 chars)"
                className="w-full"
              />
            </div>
          ))}
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
      );
    }
  };

  // Render social media step.
  const renderSocialMediaStep = () => (
    <div className="mb-6">
      <p className="text-xl font-medium mb-2">{currentStepData.label}</p>
      <select
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        value={selectedSocialMediaOption}
        onChange={(e) => setSelectedSocialMediaOption(e.target.value)}
      >
        {(currentStepData as SocialMediaStep).options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selectedSocialMediaOption === "Instagram" && (
        <Input
          type="text"
          value={instagramInput}
          onChange={(e) => setInstagramInput(e.target.value)}
          placeholder="Enter your Instagram username or link"
          className="w-full"
        />
      )}
      {selectedSocialMediaOption === "Email" && (
        <div className="w-full">
          <p className="text-gray-700">Using your account email:</p>
          <Input type="email" value={userEmail} disabled className="w-full" />
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center bg-gray-50 relative overflow-hidden mb-32 px-4">
      {/* Dotted background */}
      <div className="absolute inset-0 z-0 bg-dots" />
      {/* Main Card */}
      <Card className="relative z-10 w-full max-w-3xl mx-auto p-6 shadow-2xl">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-center">
            Onboarding
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Let's get you set up.
          </CardDescription>
        </CardHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="mb-6">
                {currentStepData.type === "input" ? (
                  <>
                    {currentStepData.key === "major"
                      ? renderAutocompleteInput("major", currentStepData.label)
                      : currentStepData.key === "origin"
                      ? renderAutocompleteInput("origin", currentStepData.label)
                      : (
                        <Input
                          type={
                            currentStepData.key === "age" ? "number" : "text"
                          }
                          value={formData[currentStepData.key] as string}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [currentStepData.key]: e.target.value,
                            }))
                          }
                          placeholder={currentStepData.label}
                          className="w-full"
                        />
                      )}
                  </>
                ) : currentStepData.type === "select" ? (
                  <div className="flex flex-wrap gap-3">
                    {(currentStepData as SelectStep).options.map(
                      (option, index) => (
                        <Button
                          key={option}
                          onClick={() => setSelectedOption(index)}
                          className={`transition-colors ${
                            selectedOption === index
                              ? "border-4 border-black scale-105"
                              : "border border-gray-300"
                          }`}
                        >
                          {option}
                        </Button>
                      )
                    )}
                  </div>
                ) : currentStepData.type === "multi" ? (
                  renderMultiSelect()
                ) : currentStepData.type === "customQuestions" ? (
                  renderCustomQuestions()
                ) : currentStepData.type === "social_media" ? (
                  renderSocialMediaStep()
                ) : null}
              </div>
              {error && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}
            </CardContent>
          </motion.div>
        </AnimatePresence>
        <CardFooter className="flex justify-between">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleNext} className="ml-auto">
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
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
