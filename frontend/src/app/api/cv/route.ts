import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const { getActiveCVForUser } = await import("@/db/cv-helpers");

export async function GET (req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeCV = await getActiveCVForUser(userId);

    if (!activeCV) {
      return NextResponse.json(
        { error: "No CV found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activeCV,
    });
  } catch (error) {
    console.error("[CV Fetch] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch CV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
