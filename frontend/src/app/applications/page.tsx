"use client"

import React from "react";
import { useAuth } from "@clerk/nextjs";

const ApplicationsPage = () => {
  const { getToken } = useAuth();
  
  const handleReverseOnboarding = async () => {
    const res = await fetch('/api/reverse', {
      method: 'DELETE',
    })

    const data = await res.json()

    if(!res.ok) {
      console.error(data.error || "An unknown error occured!")
    } else {
      console.log(data.message)
      await getToken({ skipCache: true })
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = "/";
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">📋</p>
        <h1 className="text-6xl font-bold mb-6">Applications Page</h1>
        <p className="text-lg italic">
          Welcome to the Career Co-Pilot Applications Page!
        </p>

        <button className="mt-4 bg-neutral-900 rounded-lg p-6 text-lg" onClick={() => {
          handleReverseOnboarding();
        }}>
          Click to reverse onboarding status!
        </button>
      </div>
    </div>
  );
};

export default ApplicationsPage;
