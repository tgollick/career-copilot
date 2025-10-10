import { db } from "@/lib/index";
import { jobs, jobSimilarities } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { sql } from "drizzle-orm";
import { and, gte, lte, ilike, or, eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { JobsApiResponse } from "@/db/schema"; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { userId } = await auth();

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const location = searchParams.get("location")
    const searchTerm = searchParams.get("searchTerm")
    const minSalary = parseInt(searchParams.get("minSalary") || "0");
    const maxSalary = parseInt(searchParams.get("maxSalary") || "0");

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 15);

    const offset = (validPage - 1) * validLimit;
  
    const conditions = []

    if(location) {
      conditions.push(ilike(jobs.location, `%${location}%`));
    }

    if (searchTerm) {
      conditions.push(
        or(
          ilike(jobs.title, `%${searchTerm}%`),
          ilike(jobs.description, `%${searchTerm}%`)
        )
      );
    }

    if(minSalary > 0) {
      conditions.push(gte(jobs.salaryMin, minSalary));
    }

    if(maxSalary > 0) {
      conditions.push(gte(jobs.salaryMax, maxSalary));
    }

    // Single query with conditional left join
    // If userId exists, join with similarities; otherwise, just get jobs
    const jobsQuery = db
      .select({
        // Job fields
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        remoteType: jobs.remoteType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        employmentType: jobs.employmentType,
        experienceLevel: jobs.experienceLevel,
        skills: jobs.skills,
        requirements: jobs.requirements,
        postedAt: jobs.postedAt,
        companyId: jobs.companyId,
        
        // Similarity fields (will be null if no match or no userId)
        similarity: userId ? jobSimilarities.similarity : sql<null>`null`,
        matchQuality: userId ? jobSimilarities.matchQuality : sql<null>`null`,
      })
      .from(jobs);

    // Conditionally add left join only if userId exists
    const queryWithJoin = userId
      ? jobsQuery.leftJoin(
          jobSimilarities,
          and(
            eq(jobSimilarities.jobId, jobs.id),
            eq(jobSimilarities.userId, userId)
          )
        )
      : jobsQuery;

    // Apply filters, ordering, and pagination
    const jobData = await queryWithJoin
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        // If similarities exist, order by similarity (desc, nulls last)
        // Otherwise, order by postedAt
        userId
          ? sql`${jobSimilarities.similarity} DESC NULLS LAST, ${jobs.postedAt} DESC`
          : desc(jobs.postedAt)
      )
      .limit(validLimit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalPages = Math.ceil(count / validLimit);

    const response: JobsApiResponse = ({
      jobs: jobData,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems: count,
        itemsPerPage: validLimit,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    })

    return NextResponse.json(response);
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
