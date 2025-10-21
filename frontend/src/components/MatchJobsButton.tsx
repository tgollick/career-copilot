// components/MatchJobsButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface MatchJobsButtonProps {
  disabled?: boolean;
}

export function MatchJobsButton({ disabled }: MatchJobsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
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
      setError("Error matching jobs: " + error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleMatchJobs}
        disabled={disabled || isLoading}
        size="lg"
        className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Matching Jobs...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Match Jobs with AI
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div> 
  );
}
