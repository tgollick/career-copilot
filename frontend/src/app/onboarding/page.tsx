"use client";
import React from "react";
import { completeOnboarding } from "./_actions";
import { useRouter } from "next/navigation";

// type Props = {};

const OnboardingPage = () => {
  const router = useRouter();

  const handleOnboarding = async (complete: boolean) => {
    const result = await completeOnboarding(complete);

    if (result.message) {
      alert(result.message);
      router.push("/");
    }

    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">🙋</p>
        <h1 className="text-6xl font-bold mb-6">On-Boarding Page</h1>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleOnboarding(true);
            }}
            className="bg-blue-500 text-white p-4 rounded-md mr-4 hover:cursor-pointer"
          >
            Complete On-Boarding
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleOnboarding(false);
            }}
            className="bg-red-500 text-white p-4 rounded-md hover:cursor-pointer"
          >
            Revert On-Boarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
