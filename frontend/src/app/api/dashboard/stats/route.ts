import { jobs, jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { eq, ne, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Statistic = {
  totalMatches: number,
  averageMatchQuality: number,
  cvStatus: string, 
  activeJobs: number,
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()

  if(!userId) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 404 },
    )
  }

  const totalMatchesResult = await db.select({ count: sql<number>`count(*)`}).from(jobSimilarities).where(eq(jobSimilarities.userId, userId));   
  const totalMatches = totalMatchesResult[0]?.count ?? 0;
 
  const averageSimilarityResult = await db
    .select({
      averageSimilarity: sql<number>`avg(${jobSimilarities.similarity})`,
    })
    .from(jobSimilarities)
    .where(ne(jobSimilarities.similarity, "0"));
  const averageSimilarity = Math.round(averageSimilarityResult[0]?.averageSimilarity * 100) ?? 0;

  const cvStatus = !averageSimilarity ? "Not Analysed" : "Analysed"
  
  const totalJobsResult = await db.select({ count: sql<number>`count(*)`}).from(jobs)
  const totalJobs = totalJobsResult[0]?.count ?? 0;

  return NextResponse.json({
    totalMatches,
    averageMatchQuality: averageSimilarity,
    cvStatus,
    activeJobs: totalJobs,
  })
}
