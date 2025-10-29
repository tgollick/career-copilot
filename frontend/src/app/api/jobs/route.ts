import { db } from "@/lib/index";
import { companies, jobs, jobSimilarities } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { getTableColumns, sql } from "drizzle-orm";
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

    const jobsQuery = db
      .select({
        ...getTableColumns(jobs),

        companyName: companies.name,

        similarity: jobSimilarities.similarity,
        matchQuality: jobSimilarities.matchQuality,
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .leftJoin(
        jobSimilarities,
        userId 
          ? and(
              eq(jobSimilarities.jobId, jobs.id),
              eq(jobSimilarities.userId, userId)
            )
          : sql`false`
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        userId
          ? sql`${jobSimilarities.similarity} DESC NULLS LAST, ${jobs.postedAt} DESC`
          : desc(jobs.postedAt)
      )
      .limit(validLimit)
      .offset(offset);

    const jobData = await jobsQuery;

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
