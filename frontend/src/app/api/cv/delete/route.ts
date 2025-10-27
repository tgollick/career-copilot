import { completeOnboarding } from "@/app/onboarding/_actions";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 404 },
      )
    }

    // Delete current CV 
    await db.delete(cvAnalyses).where(eq(cvAnalyses.userId, userId));    

    // Delete job matches
    await db.delete(jobSimilarities).where(eq(jobSimilarities.userId, userId));
    
    // Disabled the flag to toggle onboarding
    await completeOnboarding(false);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err ? err : "An unexpected error occured trying to delete your current CV" },
      { status: 404 },
    )
  }
}
