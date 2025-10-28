import { jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Distro = {
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 },
      )
    }

    const similarities = await db
      .select({ similarity: jobSimilarities.similarity })
      .from(jobSimilarities)
      .where(eq(jobSimilarities.userId, userId));

    const values = similarities.map(row => row.similarity);
    
    const excellent = values.filter((value) => parseFloat(value) >= 0.45).length;
    const good = values.filter((value) => {
      const num = parseFloat(value);
      return num > 0.35 && num < 0.45;
    }).length;
    const ok = values.filter((value) => {
      const num = parseFloat(value);
      return num > 0.25 && num < 0.35;
    }).length;
    const bad = values.filter((value) => {
      const num = parseFloat(value);
      return num > 0.15 && num < 0.25;
    }).length;
    const terrible = values.filter((value) => parseFloat(value) < 0.15).length

    const totalCount = values.length

    const data: Distro[] = [
      { 
        label: "Excellent", 
        count: excellent, 
        color: "bg-emerald-500", 
        percentage: Math.round((excellent / totalCount) * 100) 
      },
      {
        label: "Good",
        count: good,
        color: "bg-blue-500",
        percentage: Math.round((good / totalCount) * 100)
      },
      {
        label: "Ok",
        count: ok,
        color: "bg-amber-500",
        percentage: Math.round((ok / totalCount) * 100)
      },
      {
        label: "Bad",
        count: bad,
        color: "bg-slate-500",
        percentage: Math.round((bad / totalCount) * 100)
      },
      {
        label: "Terrible",
        count: terrible,
        color: "bg-red-500",
        percentage: Math.round((terrible / totalCount) * 100)
      }
    ];

    return NextResponse.json(
      {
        distroData: data
      }
    )

  } catch (err) {
    return NextResponse.json(
      { error: err ? err : "Unexpected error has occured" },
      { status: 404 },
    )
  }
}
