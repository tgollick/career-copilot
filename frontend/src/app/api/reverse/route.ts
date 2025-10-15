import { completeOnboarding } from "@/app/onboarding/_actions";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return NextResponse.json(
        { error : "Unauthorised!" },
        { status: 404 },
      )
    }

    await db
      .delete(cvAnalyses)
      .where(eq(cvAnalyses.userId, userId))

    await db
      .delete(jobSimilarities)
      .where(eq(jobSimilarities.userId, userId));
    
    await completeOnboarding(false);

    return NextResponse.json({
      success: true,
      message: "Onboarding has been successfully reversed!"
    })
  } catch (err) {
    return NextResponse.json(
      { error: !err ? "An unknown error occured whilst reversing onboarding!" : err.toString()}
    )
  }
}
