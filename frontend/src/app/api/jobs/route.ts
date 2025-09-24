import { db } from "@/lib/index";
import { jobs } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(jobs);

    return NextResponse.json(result); // 👈 Much cleaner
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
