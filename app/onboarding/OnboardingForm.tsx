// app/onboarding/OnboardingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, User, Calendar } from "lucide-react";
import RoundedIconButton from "@/components/RoundedIconButton";

const onboardingSteps = [
  { id: 1, label: "Enter username", type: "input" },
  { id: 2, label: "Age", type: "input" },
  {
    id: 3,
    label: "Gender",
    type: "select",
    Icon: User,
    options: ["Male", "Female", "Other"],
  },
  {
    id: 4,
    label: "Enter Year",
    type: "select",
    Icon: Calendar,
    options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
  },
  // ... add additional steps as needed
];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Update selected option based on arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onboardingSteps[currentStep].type === "select") {
        const options = onboardingSteps[currentStep].options || [];
        if (e.key === "ArrowRight") {
          setSelectedOption((prev) =>
            prev === null || prev >= options.length - 1 ? 0 : prev + 1
          );
        }
        if (e.key === "ArrowLeft") {
          setSelectedOption((prev) =>
            prev === null || prev <= 0 ? options.length - 1 : prev - 1
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const currentQuestion = onboardingSteps[currentStep];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{currentQuestion.label}</h2>

      {currentQuestion.type === "input" && (
        <input
          type="text"
          placeholder={currentQuestion.label}
          className="p-2 border rounded mb-4"
        />
      )}

      {currentQuestion.type === "select" && currentQuestion.options && (
        <div className="flex items-center space-x-4 mb-4">
          {currentQuestion.options.map((option, index) => (
            <RoundedIconButton
              key={option}
              Icon={currentQuestion.Icon || User}
              onClick={() => setSelectedOption(index)}
              isSelected={selectedOption === index}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={() => {
              setSelectedOption(null);
              setCurrentStep(currentStep - 1);
            }}
            className="p-2"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        {currentStep < onboardingSteps.length - 1 && (
          <button
            onClick={() => {
              setSelectedOption(null);
              setCurrentStep(currentStep + 1);
            }}
            className="p-2"
          >
            <ArrowRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
