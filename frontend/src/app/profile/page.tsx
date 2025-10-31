import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sparkles } from "lucide-react";
import UserInfo from "@/components/profile/UserInfo";
import Analysis from "@/components/profile/Analysis";
import JobMatches from "@/components/profile/JobMatches";

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
          {/* User profile */}
          <UserInfo />

          {/* CV Analysis Section */}
          <Analysis hasAnalysis={hasAnalysis} />  

          {/* Job Matching Section */}
          <JobMatches hasAnalysis={hasAnalysis} hasMatches={hasMatches} existingSimilarities={existingSimilarities} /> 
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
