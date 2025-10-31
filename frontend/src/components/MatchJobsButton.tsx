"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { matchJobs } from "@/app/profile/actions/match-jobs";
import { toast } from "sonner";

export function MatchJobsButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const handleMatchJobs = async () => {
    setError(null);
    setIsComplete(false);

    // Show loading toast
    const loadingToast = toast.loading("Analyzing your CV and matching jobs...", {
      description: "This may take a few moments",
    });

    startTransition(async () => {
      try {
        const result = await matchJobs();
        
        if (!result.success) {
          toast.dismiss(loadingToast);
          toast.error("Failed to match jobs", {
            description: result.error || "Please try again later",
          });
          setError(result.error || "Failed to match jobs");
        } else {
          // Show success state briefly before refresh
          setIsComplete(true);
          toast.dismiss(loadingToast);
          toast.success("Jobs matched successfully!", {
            description: `Found ${result.matchedCount} potential matches`,
            duration: 3000,
          });

          // Small delay so user sees the success state
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh the page data
          router.refresh();
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Unexpected error", {
          description: "Something went wrong. Please try again.",
        });
        setError("Error matching jobs: " + error);
      }
    });
  };

  return (
    <div>
      <Button
        onClick={handleMatchJobs}
        disabled={isPending || isComplete}
        size="lg"
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isComplete ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Matched Successfully!
          </>
        ) : isPending ? (
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
        <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
