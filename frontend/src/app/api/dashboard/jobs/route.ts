import { jobs, jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Top 5 newest jobs:
type Job = {
  id: number,
  title: string,
  company: string,
  location: string,
  salary: string,
  postedDate: Date,
}

// Top 5 best matching jobs (IN SAME TYPE FORMAT!)
type MatchedJob = {
  id: number,
  title: string,
  company: string,
  location: string, 
  salary: string,
  matchQuality: number,
  matchLabel: string, 
  postedDate: string,
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if(!userId) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 404 },
    )
  }
  
  const newestJobs = await db.query.jobs.findMany({
    with: {
      company: true, 
    },
    orderBy: desc(jobs.postedAt),
    limit: 5,
  });

  const formattedNewestJobs = newestJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company.name,
    location: job.location,
    salary: `${job.salaryMin} - ${job.salaryMax}`,
    postedDate: job.postedAt.toLocaleDateString(), 
  }));

  const bestJobs = await db.query.jobSimilarities.findMany({
    with: {
      job: {
        with: {
          company: true, // Add this to include the company relation
        }
      }
    },
    orderBy: desc(jobSimilarities.similarity),
    limit: 5,
  })

  const formattedBestJobs = bestJobs.map((similarity) => ({
    id: similarity.job.id,
    title: similarity.job.title,
    company: similarity.job.company.name,
    location: similarity.job.location,
    salary: `${similarity.job.salaryMin} - ${similarity.job.salaryMax}`,
    matchQuality: similarity.similarity.slice(2, 4),
    matchLabel: similarity.matchQuality,
    postedDate: similarity.createdAt.toLocaleDateString(),
  }));

  return NextResponse.json({
    newestJobs: formattedNewestJobs,
    bestJobs: formattedBestJobs,
  })
}
