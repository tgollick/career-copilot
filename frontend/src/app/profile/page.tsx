// app/profile/page.tsx
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MatchJobsButton } from "@/components/MatchJobsButton";

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
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center">
        <p className="text-8xl mb-4">🙋</p>
        <h1 className="text-6xl font-bold mb-6">Profile Page</h1>
        <p className="text-lg italic mb-8">
          Welcome to the Career Co-Pilot Profile Page!
        </p>

        {/* CV Analysis Status */}
        <div className="w-full bg-neutral-900 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-4">CV Analysis</h2>
          {hasAnalysis ? (
            <div className="flex items-center gap-2 text-green-600">
              <span>✅</span>
              <span>CV Analyzed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <span>⚠️</span>
              <span>No CV uploaded yet</span>
            </div>
          )}
        </div>

        {/* Job Matching Section */}
        <div className="w-full bg-neutral-900 rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4">Job Matching</h2>
          
          {hasMatches ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <span>✅</span>
                <span>Jobs already matched!</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Top Matches:</h3>
                {existingSimilarities.map((sim) => (
                  <div key={sim.id} className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>{sim.job.title}</span>
                    <span className="font-semibold">{sim.matchQuality}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                To recalculate, delete your CV and upload a new one.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                {hasAnalysis 
                  ? "Click below to match your CV against available jobs."
                  : "Please upload and analyze your CV first."}
              </p>
              
              {/* Client Component Button */}
              <MatchJobsButton disabled={!hasAnalysis} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
