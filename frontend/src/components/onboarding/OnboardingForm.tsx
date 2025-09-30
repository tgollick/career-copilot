// frontend/src/components/onboarding/OnboardingForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { CVAnalysisData } from "@/db/schema";

type OnboardingStep = "loading" | "upload" | "review";

type OnboardingFormProps = {
  cvAnalysis: CVAnalysisData;
  onComplete: () => void;
  setStep: (step: OnboardingStep) => void;
};

export default function OnboardingForm({
  cvAnalysis,
  onComplete,
  setStep,
}: OnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state - pre-filled from CV analysis
  const [formData, setFormData] = useState({
    // Contact Info
    email: cvAnalysis.contact_info.email || "",
    phone: cvAnalysis.contact_info.phone || "",
    linkedin: cvAnalysis.contact_info.linkedin || "",
    github: cvAnalysis.contact_info.github || "",
    location: cvAnalysis.entities.locations[0] || "",

    // Personal Info
    fullName: cvAnalysis.entities.names[0] || "",

    // Skills - join arrays for display
    programmingLanguages: cvAnalysis.skills.programming_languages.join(", "),
    frameworks: cvAnalysis.skills.frameworks_libraries.join(", "),
    databases: cvAnalysis.skills.databases.join(", "),
    cloudTools: cvAnalysis.skills.cloud_tools.join(", "),

    // Experience & Education
    objective: cvAnalysis.sections.objective || "",
    experienceLevel: cvAnalysis.experience_indicators[0] || "",
    education: cvAnalysis.education_info[0] || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.email || !formData.fullName) {
      setError("Name and email are required");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save the edited profile data to database
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send as JSON
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      // Mark onboarding as complete
      await onComplete();

      // Redirect to dashboard
      router.push("/");
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError(
        err instanceof Error ? err.message : "Failed to complete onboarding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="bg-gray-900 rounded-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Review Your Profile</h2>
          <p className="text-gray-400">
            We&apos;ve pre-filled your information from your CV. Please review
            and make any necessary changes.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">
            Personal Information
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/yourprofile"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="github.com/yourusername"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">
            Technical Skills
          </h3>
          <p className="text-sm text-gray-400">
            Separate multiple skills with commas
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              Programming Languages
            </label>
            <input
              type="text"
              name="programmingLanguages"
              value={formData.programmingLanguages}
              onChange={handleChange}
              placeholder="Python, JavaScript, TypeScript"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Frameworks & Libraries
            </label>
            <input
              type="text"
              name="frameworks"
              value={formData.frameworks}
              onChange={handleChange}
              placeholder="React, Node.js, Django"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Databases
              </label>
              <input
                type="text"
                name="databases"
                value={formData.databases}
                onChange={handleChange}
                placeholder="PostgreSQL, MongoDB"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cloud & Tools
              </label>
              <input
                type="text"
                name="cloudTools"
                value={formData.cloudTools}
                onChange={handleChange}
                placeholder="AWS, Docker, Git"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">
            Professional Profile
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Professional Summary
            </label>
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              rows={4}
              placeholder="Brief description of your professional background and career goals"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>
            <input
              type="text"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              placeholder="e.g., 3+ years of experience"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Highest Education
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g., BSc Computer Science"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => setStep("upload")}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Completing..." : "Complete Onboarding"}
          </button>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By completing onboarding, you agree to our Terms of Service and
          Privacy Policy. Your data is securely stored and never shared without
          your permission.
        </p>
      </div>
    </form>
  );
}
