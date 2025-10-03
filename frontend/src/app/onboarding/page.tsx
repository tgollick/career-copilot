// frontend/src/app/onboarding/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import type { CvAnalysis } from "@/db/schema";

type OnboardingStep = "loading" | "upload" | "review";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("loading");
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Check if user has already uploaded CV
  useEffect(() => {
    checkForExistingCV();
  }, []);

  const checkForExistingCV = async () => {
    try {
      const response = await fetch("/api/cv/upload");

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCvAnalysis(data.data);
          setStep("review");
          return;
        }
      }

      // No CV found, show upload form
      setStep("upload");
    } catch (err) {
      console.error("Error checking for CV:", err);
      setStep("upload");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Fetch the full CV analysis
        await checkForExistingCV();
      } else {
        throw new Error(data.error || "Failed to upload CV");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      const result = await completeOnboarding(true);

      if (result.error) {
        throw new Error(result.error);
      }

      // Will redirect via middleware
      router.push("/");
    } catch (err) {
      console.error("Error completing onboarding:", err);
      throw err;
    }
  };

  // Loading state
  if (step === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center" >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center ${
                step === "upload" ? "text-purple-500" : "text-green-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                {step === "review" ? "✓" : "1"}
              </div>
              <span className="ml-2 font-medium">Upload CV</span>
            </div>

            <div className="w-24 h-0.5 bg-gray-700 mx-4"></div>

            <div
              className={`flex items-center ${
                step === "review" ? "text-purple-500" : "text-gray-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 font-medium">Review Profile</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload CV */}
        {step === "upload" && (
          <div className="flex flex-col items-center">
            <p className="text-6xl mb-4">📄</p>
            <h1 className="text-4xl font-bold mb-4">Upload Your CV</h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Upload your CV and we&apos;ll automatically extract your skills,
              experience, and qualifications using AI.
            </p>

            <div className="w-full max-w-md bg-neutral-900 rounded-lg p-6">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="w-full mb-4 bg-neutral-800 rounded-sm p-2"
              />

              {file && (
                <p className="mb-4 text-sm p-2 rounded-sm bg-neutral-800">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
              >
                {uploading ? "Uploading & Analyzing..." : "Upload CV"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Profile */}
        {step === "review" && cvAnalysis && (
          <div className="flex flex-col items-center">
            <OnboardingForm
              cvAnalysis={cvAnalysis.analysisData}
              onComplete={handleCompleteOnboarding}
              setStep={setStep}
            />
          </div>
        )}
      </div>
    </div>
  );
}
