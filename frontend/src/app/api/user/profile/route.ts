// frontend/src/app/api/user/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib";
import { users, cvAnalyses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse JSON body (not FormData since it's coming from the form component)
    const body = await req.json();

    // Extract and validate data
    const {
      fullName,
      email,
      phone,
      linkedin,
      github,
      location,
      programmingLanguages,
      frameworks,
      databases,
      cloudTools,
      objective,
      experienceLevel,
      education,
    } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Parse comma-separated skills back into arrays
    const parseSkills = (skillString: string): string[] => {
      if (!skillString) return [];
      return skillString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    };

    const programmingLanguagesArray = parseSkills(programmingLanguages);
    const frameworksArray = parseSkills(frameworks);
    const databasesArray = parseSkills(databases);
    const cloudToolsArray = parseSkills(cloudTools);

    // 1. Update or create user in users table
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set({
          email,
          firstName: fullName.split(" ")[0] || fullName,
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      // Create new user
      await db.insert(users).values({
        id: userId,
        email,
        firstName: fullName.split(" ")[0] || fullName,
        lastName: fullName.split(" ").slice(1).join(" ") || "",
      });
    }

    // 2. Update the active CV analysis with modified data
    const [activeCv] = await db
      .select()
      .from(cvAnalyses)
      .where(and(eq(cvAnalyses.userId, userId), eq(cvAnalyses.isActive, true)))
      .limit(1);

    if (!activeCv) {
      return NextResponse.json(
        { error: "No CV analysis found. Please upload your CV first." },
        { status: 404 }
      );
    }

    // Update the CV analysis with modified data
    await db
      .update(cvAnalyses)
      .set({
        // Update contact info in analysisData JSON
        analysisData: {
          ...activeCv.analysisData,
          contact_info: {
            email,
            phone: phone || "",
            linkedin: linkedin || "",
            github: github || "",
          },
          sections: {
            ...activeCv.analysisData.sections,
            objective: objective || "",
          },
          skills: {
            programming_languages: programmingLanguagesArray,
            frameworks_libraries: frameworksArray,
            databases: databasesArray,
            cloud_tools: cloudToolsArray,
            other_skills: [],
          },
          entities: {
            ...activeCv.analysisData.entities,
            names: [fullName],
            locations: location ? [location] : [],
          },
          education_info: education ? [education] : [],
          experience_indicators: experienceLevel ? [experienceLevel] : [],
        },

        // Update denormalized fields for quick queries
        email,
        phone: phone || null,
        linkedin: linkedin || null,
        github: github || null,
        programmingLanguages: programmingLanguagesArray,
        frameworks: frameworksArray,
        databases: databasesArray,
        cloudTools: cloudToolsArray,
        objective: objective || null,
        educationLevel: education || null,
        updatedAt: new Date(),
      })
      .where(eq(cvAnalyses.id, activeCv.id));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        userId,
        email,
        fullName,
      },
    });
  } catch (e) {
    console.error("Error updating user profile:", e);
    return NextResponse.json(
      {
        error: "Error updating user info",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
