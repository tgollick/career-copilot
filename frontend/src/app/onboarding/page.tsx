// frontend/src/app/onboarding/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const OnboardingPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setSuccess("");
    }
  };

  const handleOnboarding = async () => {
    if (!file) {
      setError("Please select a file first before uploading");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 500));
        throw new Error(
          "Server returned non-JSON response. Check if FastAPI is running."
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setSuccess("Successfully uploaded and analyzed CV!");
        console.log("CV Analysis:", data);

        // Optionally complete onboarding after successful upload
        // await completeOnboarding(true);
        // router.push("/dashboard");
      } else {
        throw new Error(data.error || "Failed to upload CV");
      }
    } catch (e) {
      console.error("Error uploading CV:", e);
      setError(e instanceof Error ? e.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">🙋</p>
        <h1 className="text-6xl font-bold mb-6">On-Boarding Page</h1>

        <div className="w-full max-w-md">
          {/* File Input */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="mb-4 w-full"
          />

          {/* Show selected file */}
          {file && (
            <p className="mb-4 text-sm text-gray-400">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900 text-green-200 rounded">
              {success}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleOnboarding}
            disabled={!file || loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            {loading ? "Uploading..." : "Upload CV"}
          </button>

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
            <p>Debug Info:</p>
            <p>
              FastAPI URL:{" "}
              {process.env.FASTAPI_URL || "Not set (using default)"}
            </p>
            <p>API Endpoint: /api/cv/upload</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
