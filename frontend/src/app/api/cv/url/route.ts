import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getActiveCVForUser } = await import("@/db/cv-helpers");
    const activeCV = await getActiveCVForUser(userId);

    if(!activeCV.fileUrl) {
      return NextResponse.json(
        { error: "Invalid file URL, cannot retrieve from S3 Bucket" },
        { status: 401 }
      )
    }

    const match = activeCV.fileUrl.match(/amazonaws\.com\/(.+)$/)
    const key = match ? match[1] : null;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key!,
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 360 })

    if (!activeCV) {
      return NextResponse.json(
        { error: "No CV found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      fileUrl: signedUrl,
    });
 
}
