"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getCookie } from "cookies-next";

const supabase = createClient();

interface FormData {
  username: string;
  age: string;
  gender: string;
  major: string;
  origin: string;
  residency: string;
  year_of_study: string;
}

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

type Step = InputStep | SelectStep;

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
  { key: "origin", label: "Enter your origin", type: "input" },
  { key: "residency", label: "Enter your residency", type: "input" },
  {
    key: "year_of_study",
    label: "Select your year of study",
    type: "select",
    options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
  },
];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    age: "",
    gender: "",
    major: "",
    origin: "",
    residency: "",
    year_of_study: "",
  });
  // Initialize selectedOption as a number or null.
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = steps[currentStep];

  // When the step changes, if it's a select type, initialize selectedOption to 0.
  useEffect(() => {
    if (currentQuestion.type === "select") {
      setSelectedOption(0);
    } else {
      setSelectedOption(null);
    }
  }, [currentStep, currentQuestion.type]);

  // Enable arrow key navigation for select-type questions.
  useEffect(() => {
    if (currentQuestion.type !== "select") return;

    const options = (currentQuestion as SelectStep).options;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedOption((prev) =>
          prev === null || prev >= options.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedOption((prev) =>
          prev === null || prev <= 0 ? options.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion]);

  const handleNext = () => {
    // For select questions, update the answer using the selected option.
    if (currentQuestion.type === "select" && selectedOption !== null) {
      setFormData((prev) => ({
        ...prev,
        [currentQuestion.key]: (currentQuestion as SelectStep).options[selectedOption],
      }));
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  async function handleSubmit() {
    const userId = getCookie("usernameID") as string;
    if (!userId) {
      console.error("Cookie 'usernameID' not found");
      return;
    }
    const payload = {
      ...formData,
      age: Number(formData.age),
      onboarding_complete: true,
      // If your database column name is different, adjust here.
      year_of_study: formData.year_of_study,
    };
    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("unique_id", userId);
    if (error) {
      console.error("Error updating user:", error);
      return;
    }
    console.log("User updated successfully:", data);
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Onboarding</h1>
      <div className="mb-4">
        <p className="text-lg">{currentQuestion.label}</p>
      </div>
      <div className="mb-6">
        {currentQuestion.type === "input" ? (
          <input
            type={currentQuestion.key === "age" ? "number" : "text"}
            value={formData[currentQuestion.key]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [currentQuestion.key]: e.target.value,
              }))
            }
            className="border p-2 w-full"
            placeholder={currentQuestion.label}
          />
        ) : (
          <div className="flex items-center space-x-4">
            {(currentQuestion as SelectStep).options.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelectedOption(index)}
                className={`border p-2 rounded ${
                  selectedOption === index
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        {currentStep > 0 && <Button onClick={handleBack}>Back</Button>}
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
