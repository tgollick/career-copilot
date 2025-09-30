"use client";
import React, { useState } from "react";
import { completeOnboarding } from "./_actions";
import { useRouter } from "next/navigation";

// type Props = {};

const OnboardingPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleOnboarding = async () => {
    if (!file) {
      console.error("Please select a file first before uploading");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Successfully Uploaded and Analyised CV!");
        console.log(data);
      } else {
        console.error("Error uploading CV for analysis: " + data.error);
      }

      // const result = await completeOnboarding(complete);

      // if (result.message) {
      //   alert(result.message);
      //   router.push("/");
      // }

      // if (result.error) {
      //   alert(result.error);
      // }
    } catch (e) {
      console.error("Error uploading CV for analysis: " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">🙋</p>
        <h1 className="text-6xl font-bold mb-6">On-Boarding Page</h1>
        <div>
          {/* File Input */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
          />

          {/* Show selected file */}
          {file && (
            <p>
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          {/* Upload Button */}
          <button
            onClick={() => handleOnboarding()}
            disabled={!file || loading}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              cursor: file && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Uploading..." : "Upload CV"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
