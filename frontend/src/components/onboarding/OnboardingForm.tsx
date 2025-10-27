"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { CVAnalysisData } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Code,
  Database,
  Cloud,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useState } from "react"

type OnboardingStep = "loading" | "upload" | "review"

type OnboardingFormProps = {
  cvAnalysis: CVAnalysisData
  onComplete: () => void
  setStep: (step: OnboardingStep) => void
}

const formSchema = z.object({
  // Contact Info
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  location: z.string().optional(),
  // Personal Info
  fullName: z.string().min(1, "Full name is required"),
  // Skills
  programmingLanguages: z.string().optional(),
  frameworks: z.string().optional(),
  databases: z.string().optional(),
  cloudTools: z.string().optional(),
  // Experience & Education
  objective: z.string().optional(),
  experienceLevel: z.string().optional(),
  education: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function OnboardingForm({ cvAnalysis, onComplete, setStep }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: cvAnalysis.contact_info.email || "",
      phone: cvAnalysis.contact_info.phone || "",
      linkedin: cvAnalysis.contact_info.linkedin || "",
      github: cvAnalysis.contact_info.github || "",
      location: cvAnalysis.entities.locations[0] || "",
      fullName: cvAnalysis.entities.names[0] || "",
      programmingLanguages: cvAnalysis.skills.programming_languages.join(", "),
      frameworks: cvAnalysis.skills.frameworks_libraries.join(", "),
      databases: cvAnalysis.skills.databases.join(", "),
      cloudTools: cvAnalysis.skills.cloud_tools.join(", "),
      objective: cvAnalysis.sections.objective || "",
      experienceLevel: cvAnalysis.experience_indicators[0] || "",
      education: cvAnalysis.education_info[0] || "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save profile")
      }

      onComplete()
      router.push("/")
    } catch (err) {
      console.error("Error completing onboarding:", err)
      setError(err instanceof Error ? err.message : "Failed to complete onboarding")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Review Your Profile
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We&apos;ve pre-filled your information from your CV. Please review and make any necessary changes.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                <p className="text-destructive font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Full Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-muted-foreground" />
                            LinkedIn
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="linkedin.com/in/yourprofile" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-muted-foreground" />
                            GitHub
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="github.com/yourusername" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City, Country" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Technical Skills</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Separate multiple skills with commas</p>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="programmingLanguages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-muted-foreground" />
                          Programming Languages
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Python, JavaScript, TypeScript" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frameworks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-muted-foreground" />
                          Frameworks & Libraries
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="React, Node.js, Django" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="databases"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-muted-foreground" />
                            Databases
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="PostgreSQL, MongoDB" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cloudTools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-muted-foreground" />
                            Cloud & Tools
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="AWS, Docker, Git" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Professional Profile</h3>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          Professional Summary
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Brief description of your professional background and career goals"
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          Experience Level
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3+ years of experience" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          Highest Education
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., BSc Computer Science" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                onClick={() => setStep("upload")}
                disabled={loading}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button type="submit" disabled={loading} className="flex-1 h-12 font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Complete Onboarding
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              By completing onboarding, you agree to our Terms of Service and Privacy Policy. Your data is securely
              stored and never shared without your permission.
            </p>
          </div>
        </div>
      </form>
    </Form>
  )
}

