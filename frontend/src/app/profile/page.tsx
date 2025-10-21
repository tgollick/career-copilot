// app/profile/page.tsx
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MatchJobsButton } from "@/components/MatchJobsButton";
import DisplayCV from "@/components/profile/DisplayCV";
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Briefcase, CheckCircle2, MapPin, Sparkles, TrendingUp } from "lucide-react";

const ProfilePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please log in</div>;
  }

  // Fetch user's CV analysis
  const profileData = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.userId, userId),
    orderBy: (cvAnalyses, { desc }) => [desc(cvAnalyses.createdAt)],
  });

  // Check if similarities already exist
  const existingSimilarities = await db.query.jobSimilarities.findMany({
    where: eq(jobSimilarities.userId, userId),
    with: {
      job: {
        with: {
          company: true,
        },
      },
    },
    orderBy: (similarities, { desc }) => [desc(similarities.similarity)],
    limit: 5, // Top 5 matches
  });

  const hasAnalysis = !!profileData;
  const hasMatches = existingSimilarities.length > 0;

  return (
<div className="w-full min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-24 sm:py-28 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your CV analysis and view your personalized job matches powered by AI
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* CV Analysis Section */}
          <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">CV Analysis</h2>
              </div>

              {hasAnalysis ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-500">CV Successfully Analyzed</p>
                      <p className="text-sm text-muted-foreground">
                        Your CV has been processed and is ready for job matching
                      </p>
                    </div>
                  </div>

                  <DisplayCV />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-xl">
                  <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-muted-foreground">No CV Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      Upload your CV to get started with personalized job matching
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Matching Section */}
          <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Job Matching</h2>
              </div>

              {hasMatches ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-500">Jobs Successfully Matched</p>
                      <p className="text-sm text-muted-foreground">
                        Your top {existingSimilarities.length} job matches are ready
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      Top Matches
                    </h3>
                    <div className="space-y-3">
                      {existingSimilarities.map((sim, index) => (
                        <div
                          key={sim.id}
                          className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/50 border border-border rounded-xl hover:bg-muted/80 hover:border-primary/50 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground group-hover/item:text-primary transition-colors line-clamp-1">
                                {sim.job.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="line-clamp-1">{sim.job.company.name}</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-primary to-accent text-white border-0 font-semibold px-4 py-1.5 whitespace-nowrap"
                          >
                            {sim.matchQuality}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 border border-border rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> To recalculate your matches, delete your current CV and upload a new one.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    {hasAnalysis
                      ? "Click the button below to match your CV against our database of available jobs. Our AI-powered algorithm will find the best opportunities for you."
                      : "Please upload and analyze your CV first to unlock personalized job matching."}
                  </p>

                  <MatchJobsButton disabled={!hasAnalysis} />

                  {!hasAnalysis && (
                    <div className="p-4 bg-muted/30 border border-border rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        <strong>Getting Started:</strong> Upload your CV to begin receiving personalized job
                        recommendations based on your skills and experience.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
