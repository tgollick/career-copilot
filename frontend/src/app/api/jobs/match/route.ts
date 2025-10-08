// app/api/match-jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib";
import { jobs, cvAnalyses, jobSimilarities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Get authenticated user
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Fetch user's active CV analysis from database
    const userCvAnalysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.userId, userId),
      orderBy: (cvAnalyses, { desc }) => [desc(cvAnalyses.createdAt)],
    });

    if (!userCvAnalysis || !userCvAnalysis.analysisData) {
      return NextResponse.json(
        { error: "No CV analysis found. Please upload and analyze your CV first." },
        { status: 404 }
      );
    }

    // 3. Check if similarities already exist for this CV analysis
    const existingSimilarities = await db.query.jobSimilarities.findFirst({
      where: eq(jobSimilarities.userId, userId),
    });

    if (existingSimilarities) {
      return NextResponse.json(
        { 
          error: "Job similarities already calculated. Results are cached.",
          cached: true 
        },
        { status: 200 }
      );
    }

    // 4. Fetch all jobs from database
    const allJobs = await db.query.jobs.findMany();

    if (allJobs.length === 0) {
      return NextResponse.json(
        { error: "No jobs available to match against." },
        { status: 404 }
      );
    }

    // 5. Extract job descriptions for FastAPI
    const jobDescriptions = allJobs.map(job => job.description);

    // 6. Call FastAPI endpoint
    const fastApiResponse = await fetch("http://localhost:8000/api/match-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cv_analysis: userCvAnalysis.analysisData, // Assuming this is JSONB
        job_descriptions: jobDescriptions,
      }),
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      return NextResponse.json(
        { error: "Failed to calculate job similarities", details: errorData },
        { status: 500 }
      );
    }

    const { results } = await fastApiResponse.json();

    // 7. Validate results match input
    if (results.length !== allJobs.length) {
      return NextResponse.json(
        { error: "Mismatch between input and output job counts" },
        { status: 500 }
      );
    }

    // 8. Map job_index back to job_id and prepare for database insertion
    const similarityRecords = results.map((result: any) => ({
      userId: userId,
      jobId: allJobs[result.job_index - 1].id, // Convert 1-based to 0-based index
      similarity: result.similarity.toString(),
      matchQuality: result.match_quality,
    }));

    // 9. Batch insert into database
    await db.insert(jobSimilarities)
      .values(similarityRecords)
      .onConflictDoNothing(); // Respects unique constraint

    // 10. Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully matched ${similarityRecords.length} jobs`,
      matchedCount: similarityRecords.length,
    });

  } catch (error) {
    console.error("Error in match-jobs API:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
