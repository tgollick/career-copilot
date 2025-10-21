// app/api/cv/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { CVAnalysisData } from "@/db/schema";
import { insertCVAnalysis } from "@/db/cv-helpers";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Configuration
const FASTAPI_URL = "http://127.0.0.1:8000";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication with Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 2. Get the uploaded file from form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file
    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // 4. Forward to FastAPI for analysis
    console.log(
      `[CV Upload] Processing CV for user: ${userId}, file: ${file.name}`
    );

    const fastApiFormData = new FormData();
    fastApiFormData.append("file", file);

    const analysisResponse = await fetch(`${FASTAPI_URL}/api/cv/analyze`, {
      method: "POST",
      body: fastApiFormData,
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json().catch(() => ({}));
      console.error("[CV Upload] FastAPI error:", errorData);

      return NextResponse.json(
        {
          error: "Failed to analyze CV",
          details: errorData.detail || "Unknown error",
        },
        { status: analysisResponse.status }
      );
    }

    // 5. Parse analysis results
    const analysisResult = await analysisResponse.json();

    if (!analysisResult.success || !analysisResult.data) {
      return NextResponse.json(
        { error: "Invalid analysis response from ML service" },
        { status: 500 }
      );
    }

    const cvAnalysisData: CVAnalysisData = analysisResult.data;


    console.log("[CV Upload] Upload CV PDF to S3 Bucket");

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const key = `${userId}/${randomUUID()}-${file.name}`

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: "application/pdf",
      })
    )

    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("[CV Upload] Saving CV Analysis results");

    try {
      // Save analysis results into DB
      const savedCV = await insertCVAnalysis(
        userId!,
        cvAnalysisData,
        file.name,
        file.size,
        fileUrl,
      );

      console.log(
        `[CV Upload] Successfully saved CV analysis with ID: ${savedCV.id}`
      );

      // 7. Return success response
      return NextResponse.json({
        success: true,
        message: "CV analyzed and saved successfully",
        data: {
          id: userId,
          fileName: file.name,
          analyzedAt: new Date().toISOString(),
          // Return simplified version to frontend
          summary: {
            skills: {
              programming: cvAnalysisData.skills.programming_languages.length,
              frameworks: cvAnalysisData.skills.frameworks_libraries.length,
              databases: cvAnalysisData.skills.databases.length,
              cloudTools: cvAnalysisData.skills.cloud_tools.length,
            },
            hasExperience: cvAnalysisData.experience_indicators.length > 0,
            educationLevel: cvAnalysisData.education_info[0] || "Not specified",
            contactEmail: cvAnalysisData.contact_info.email,
          },
        },
      });
    } catch (dbError) {
      console.error("[CV Upload] Database error:", dbError);

      return NextResponse.json(
        {
          error: "Failed to save CV analysis to database",
          details: dbError instanceof Error ? dbError : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[CV Upload] Unexpected error:", error);

    return NextResponse.json(
      {
        error: "Unexpected error processing CV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

