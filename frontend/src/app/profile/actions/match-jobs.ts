"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function matchJobs() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const userCvAnalysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.userId, userId),
      orderBy: (cvAnalyses, { desc }) => [desc(cvAnalyses.createdAt)],
    });

    if (!userCvAnalysis || !userCvAnalysis.analysisData) {
      return {
        success: false,
        error: "No CV analysis found. Please upload and analyze your CV first.",
      };
    }

    const existingSimilarities = await db.query.jobSimilarities.findFirst({
      where: eq(jobSimilarities.userId, userId),
    });

    if (existingSimilarities) {
      return {
        success: false,
        error: "Job similarities already calculated. Results are cached.",
      };
    }

    const allJobs = await db.query.jobs.findMany();

    if (allJobs.length === 0) {
      return {
        success: false,
        error: "No jobs available to match against.",
      };
    }

    const jobDescriptions = allJobs.map(job => job.description);

    const fastApiResponse = await fetch("http://localhost:8000/api/match-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cv_analysis: userCvAnalysis.analysisData,
        job_descriptions: jobDescriptions,
      }),
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      return {
        success: false,
        error: "Failed to calculate job similarities",
        details: errorData,
      };
    }

    const { results } = await fastApiResponse.json();

    if (results.length !== allJobs.length) {
      return {
        success: false,
        error: "Mismatch between input and output job counts",
      };
    }

    const similarityRecords = results.map((result: any) => ({
      userId: userId,
      jobId: allJobs[result.job_index - 1].id,
      similarity: result.similarity.toString(),
      matchQuality: result.match_quality,
    }));

    await db.insert(jobSimilarities)
      .values(similarityRecords)
      .onConflictDoNothing();

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    return {
      success: true,
      message: `Successfully matched ${similarityRecords.length} jobs`,
      matchedCount: similarityRecords.length,
    };

  } catch (error) {
    console.error("Error in match-jobs action:", error);
    return {
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
