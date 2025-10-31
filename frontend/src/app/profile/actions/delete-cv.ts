"use server"

import { completeOnboarding } from "@/app/onboarding/_actions";
import { cvAnalyses, jobSimilarities } from "@/db/schema";
import { db } from "@/lib";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteCV() {
  try {
    const { userId } = await auth();

    if(!userId) {
      return {
        success: false,
        error: "Unauthorised"
      }
    }

    //Delete CV stored in S3
    // Getting S3 object url to deconstruct into just the key for the DeleteObjectCommand
    const urlRes = await db.select({ url: cvAnalyses.fileUrl }).from(cvAnalyses).where(eq(cvAnalyses.userId, userId)).limit(1);
    const urlString = urlRes[0]?.url

    // If no url string found then return error (this shouldn't ever happen so is for sure an error return if this edge case takes place)
    if(!urlString) {
      return {
        success: false,
        error: "No URL for CV found, unable to delete all user data",
      }
    }

    // Split to get the raw key
    const key = urlString.split(".amazonaws.com/")[1];

    // Build object to delete the key and await the command to complete below
    const command =  new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key
    })

    await s3.send(command);

    // Delete current CV 
    await db.delete(cvAnalyses).where(eq(cvAnalyses.userId, userId));    

    // Delete job matches
    await db.delete(jobSimilarities).where(eq(jobSimilarities.userId, userId));

    // Disabled the flag to toggle onboarding
    await completeOnboarding(false);

    revalidatePath("/dashboard");
    revalidatePath("/jobs");
    revalidatePath("/profile");

    return {
      success: true,
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred trying to delete your current CV.";

    return {
      success: false,
      error: message
    }
  }
}
