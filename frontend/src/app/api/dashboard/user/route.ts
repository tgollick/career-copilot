import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cvAnalyses, users } from "@/db/schema";

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if(!userId) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 },
      )
    }

    const currentCvAnalysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.userId, userId),
    })

    const userInfo = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if(!userInfo) {
      return NextResponse.json(
        { error: "This user cannot be found!" },
        { status: 404 },
      )
    }

    if(!currentCvAnalysis) {
      return NextResponse.json(
        { error: "No CV Analysis found for this user" },
        { status: 401 },
      )
    }
    
    const fullName = userInfo.firstName + " " + userInfo.lastName
    const email = userInfo.email;
    const topSkills = currentCvAnalysis.programmingLanguages?.slice(0, 5)

    return NextResponse.json({
      success: true,
      fullName,
      email,
      topSkills,
    })
}
