// components/MatchJobsButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface MatchJobsButtonProps {
  disabled?: boolean;
}

export function MatchJobsButton({ disabled }: MatchJobsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMatchJobs = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/jobs/match", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Successfully matched ${data.matchedCount} jobs!`);
        router.refresh(); // Refresh server component data
      } else {
        console.error(data.error || "Failed to match jobs");
      }
    } catch (error) {
      console.error("Error matching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMatchJobs}
      disabled={disabled || isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                 text-white font-semibold py-3 px-6 rounded-lg 
                 transition-colors duration-200 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Matching Jobs...
        </span>
      ) : (
        "Match Jobs"
      )}
    </button>
  );
}
