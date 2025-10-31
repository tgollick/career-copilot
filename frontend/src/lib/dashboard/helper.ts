import { desc, eq, sql } from "drizzle-orm";
import { db } from ".."
import { cvAnalyses, jobs, jobSimilarities, users } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";

type Distro = {
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export const getStats = async (userId: string) => {
  const [totalMatchesResult, avgSimilarityResult, totalJobsResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(jobSimilarities).where(eq(jobSimilarities.userId, userId)),
    db.select({ avg: sql<number>`avg(${jobSimilarities.similarity})` }).from(jobSimilarities).where(eq(jobSimilarities.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(jobs),
  ]);

  const totalMatches = totalMatchesResult[0]?.count ?? 0;
  const averageMatchQuality = Math.round((avgSimilarityResult[0]?.avg ?? 0) * 100);
  const cvStatus = !averageMatchQuality ? "Not Analysed" : "Analysed";
  const activeJobs = totalJobsResult[0]?.count ?? 0;

  return { totalMatches, averageMatchQuality, cvStatus, activeJobs };
}

export const getTopMatches = async (userId: string) => {
  return await db.query.jobSimilarities.findMany({
    with: {
      job: {
        with: {
          company: true,
        }
      },
    },
  where: eq(jobSimilarities.userId, userId),
  orderBy: desc(jobSimilarities.similarity),
  limit: 5,
  })
}

export const getRecentJobs = async () => {
  return await db.query.jobs.findMany({
    with: {
      company: true,
    },
    orderBy: desc(jobs.postedAt),
    limit: 5,
  })

}

export const getUserInfo = async (userId: string) => {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const [cvAnalysis, userInfo] = await Promise.all([
    db.query.cvAnalyses.findFirst({ where: eq(cvAnalyses.userId, userId) }),
    db.query.users.findFirst({ where: eq(users.id, userId) }),
  ]);

  return {
    fullName: `${userInfo?.firstName} ${userInfo?.lastName}`,
    email: `${userInfo?.email}`,
    topSkills: cvAnalysis?.programmingLanguages ?? [],
    userImageUrl: user.hasImage ? user.imageUrl : null, 
  }
}

export const getMatchDistribution = async (userId: string) => {
  const similarities = await db
    .select({ similarity: jobSimilarities.similarity })
    .from(jobSimilarities)
    .where(eq(jobSimilarities.userId, userId));

  const values = similarities.map(row => row.similarity);
  
  const excellent = values.filter((value) => parseFloat(value) >= 0.35).length;

  const good = values.filter((value) => {
    const num = parseFloat(value);
    return num >= 0.28 && num <= 0.34;
  }).length;

  const ok = values.filter((value) => {
    const num = parseFloat(value);
    return num >= 0.20 && num <= 0.27;
  }).length;

  const bad = values.filter((value) => {
    const num = parseFloat(value);
    return num >= 0.12 && num <= 0.19;
  }).length;

  const terrible = values.filter((value) => parseFloat(value) <= 0.11).length

  const totalCount = values.length

  const data: Distro[] = [
    { 
      label: "Excellent", 
      count: excellent, 
      color: "bg-emerald-500", 
      percentage: Math.round((excellent / (totalCount - terrible)) * 100) 
    },
    {
      label: "Good",
      count: good,
      color: "bg-blue-500",
      percentage: Math.round((good / (totalCount - terrible)) * 100)
    },
    {
      label: "Ok",
      count: ok,
      color: "bg-amber-500",
      percentage: Math.round((ok / (totalCount - terrible)) * 100)
    },
    {
      label: "Bad",
      count: bad,
      color: "bg-slate-500",
      percentage: Math.round((bad / (totalCount - terrible)) * 100)
    },
  ];

  return data
}

