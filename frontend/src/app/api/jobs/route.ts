import { db } from "@/lib/index";
import { jobs } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { and, gte, lte, ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

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

    const jobData = await db
      .select()
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(validLimit)
      .offset(offset)
      .orderBy(jobs.postedAt);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalPages = Math.ceil(count / validLimit);

    return NextResponse.json({
      jobs: jobData,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems: count,
        itemsPerPage: validLimit,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
