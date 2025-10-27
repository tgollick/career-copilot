"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { completeOnboarding } from "./_actions"
import OnboardingForm from "@/components/onboarding/OnboardingForm"
import type { CvAnalysis } from "@/db/schema"
import { useAuth } from "@clerk/nextjs"
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type OnboardingStep = "loading" | "upload" | "review"

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("loading")
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const { getToken } = useAuth()

  // Check if user has already uploaded CV
  useEffect(() => {
    checkForExistingCV()
  }, [])

  const checkForExistingCV = async () => {
    try {
      const response = await fetch("/api/cv")

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setCvAnalysis(data.data)
          setStep("review")
          return
        }
      }

      // No CV found, show upload form
      setStep("upload")
    } catch (err) {
      console.error("Error checking for CV:", err)
      setStep("upload")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setError("")
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Fetch the full CV analysis
        await checkForExistingCV()
      } else {
        throw new Error(data.error || "Failed to upload CV")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleCompleteOnboarding = async () => {
    try {
      const result = await completeOnboarding(true)

      if (result.error) {
        throw new Error(result.error)
      }

      await getToken({ skipCache: true })
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Error completing onboarding:", err)
      throw err
    }
  }

  // Loading state
  if (step === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-28 px-4">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none -z-10" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div
              className={`flex items-center ${
                step === "upload" ? "text-primary" : step === "review" ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                  step === "review"
                    ? "bg-green-500/10 border-green-500"
                    : step === "upload"
                      ? "bg-primary/10 border-primary"
                      : "border-muted"
                }`}
              >
                {step === "review" ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </div>
              <span className="ml-3 font-semibold hidden sm:block">Upload CV</span>
            </div>

            {/* Connector Line */}
            <div
              className={`w-24 h-1 mx-4 rounded-full transition-all ${
                step === "review" ? "bg-green-500" : "bg-border"
              }`}
            ></div>

            {/* Step 2 */}
            <div className={`flex items-center ${step === "review" ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                  step === "review" ? "bg-primary/10 border-primary" : "border-muted"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <span className="ml-3 font-semibold hidden sm:block">Review Profile</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload CV */}
        {step === "upload" && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Upload Your CV
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your CV and we&apos;ll automatically extract your skills, experience, and qualifications
                      using AI.
                    </p>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/5"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      id="cv-upload"
                    />

                    <div className="text-center pointer-events-none">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {file ? file.name : "Drop your CV here or click to browse"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "PDF files only, max 10MB"}
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                      <p className="text-destructive text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full mt-6 h-12 text-base font-semibold"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading & Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Upload CV
                      </>
                    )}
                  </Button>
                </div>
              </div>
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
  )
}

