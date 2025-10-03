"use client";

import React from "react";
import { completeOnboarding } from "./onboarding/_actions";

// type Props = {}

const LandingPage = () => {
  const handleDisable = async () => {
    const res = await completeOnboarding(false);

    if(res.error) {
      console.error("Error disabling on-boarding boolean");
    } else {
      console.log(res.message);
    }
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">🛬</p>
        <h1 className="text-6xl font-bold mb-6">Landing Page</h1>
        <p className="text-lg italic">
          Welcome to the Career Co-Pilot Landing Page!
        </p>
        <button
          onClick={
            () => handleDisable()
          }
        > 
          Click to disable On-boarding boolean
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
