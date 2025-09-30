// src/db/cv-helpers.ts
import { db } from "../lib/index";
import { cvAnalyses, users } from "./schema";
import { eq, and, desc } from "drizzle-orm";
import type { CvAnalysis, CVAnalysisData } from "./schema";

// =====================
// INSERT CV ANALYSIS
// =====================
export async function insertCVAnalysis(
  userId: string,
  cvData: CVAnalysisData,
  fileName: string,
  fileSize?: number,
  fileUrl?: string
) {
  // Extract denormalized fields from the CV data
  const newCvAnalysis = await db
    .insert(cvAnalyses)
    .values({
      userId,
      fileName,
      fileSize,
      fileUrl,
      analysisData: cvData,

      // Denormalized contact info
      email: cvData.contact_info.email,
      phone: cvData.contact_info.phone,
      linkedin: cvData.contact_info.linkedin,
      github: cvData.contact_info.github,

      // Denormalized skills
      programmingLanguages: cvData.skills.programming_languages,
      frameworks: cvData.skills.frameworks_libraries,
      databases: cvData.skills.databases,
      cloudTools: cvData.skills.cloud_tools,

      // Denormalized sections
      objective: cvData.sections.objective,
      educationSummary: cvData.sections.education,
      experienceSummary: cvData.sections.experience,

      // Denormalized entities
      organizations: cvData.entities.organizations,
      locations: cvData.entities.locations,

      // Education indicators
      educationLevel: cvData.education_info[0] || null,
      hasUniversityDegree: cvData.education_info.includes("University"),

      isActive: true,
    })
    .returning();

  // Mark previous CVs as inactive
  await db
    .update(cvAnalyses)
    .set({ isActive: false })
    .where(and(eq(cvAnalyses.userId, userId), eq(cvAnalyses.isActive, true)));

  // Update the new CV to active
  await db
    .update(cvAnalyses)
    .set({ isActive: true })
    .where(eq(cvAnalyses.id, newCvAnalysis[0].id));

  // Update user's active CV reference
  await db
    .update(users)
    .set({ activeCvId: newCvAnalysis[0].id })
    .where(eq(users.id, userId));

  return newCvAnalysis[0];
}

// =====================
// GET ACTIVE CV
// =====================
export async function getActiveCVForUser(userId: string) {
  const result = await db
    .select()
    .from(cvAnalyses)
    .where(and(eq(cvAnalyses.userId, userId), eq(cvAnalyses.isActive, true)))
    .limit(1);

  return result[0] || null;
}

// =====================
// GET ALL CVS FOR USER
// =====================
export async function getAllCVsForUser(userId: string) {
  return db
    .select()
    .from(cvAnalyses)
    .where(eq(cvAnalyses.userId, userId))
    .orderBy(desc(cvAnalyses.createdAt));
}

// =====================
// GET CV BY ID
// =====================
export async function getCVById(id: number, userId: string) {
  const result = await db
    .select()
    .from(cvAnalyses)
    .where(and(eq(cvAnalyses.id, id), eq(cvAnalyses.userId, userId)))
    .limit(1);

  return result[0] || null;
}

// =====================
// DELETE CV
// =====================
export async function deleteCVAnalysis(id: number, userId: string) {
  return db
    .delete(cvAnalyses)
    .where(and(eq(cvAnalyses.id, id), eq(cvAnalyses.userId, userId)))
    .returning();
}

// =====================
// SEARCH CVS BY SKILL
// =====================
export async function searchCVsBySkill(userId: string, skill: string) {
  // This would require a full-text search or array contains query
  // For now, this is a basic example
  const allCVs = await getAllCVsForUser(userId);

  return allCVs.filter(
    (cv: CvAnalysis) =>
      cv.programmingLanguages?.includes(skill) ||
      cv.frameworks?.includes(skill) ||
      cv.databases?.includes(skill)
  );
}

// =====================
// EXAMPLE USAGE
// =====================
export async function exampleUsage() {
  const userId = "user_2abc123def"; // From Clerk

  // Your CV analysis data
  const cvData: CVAnalysisData = {
    contact_info: {
      email: "thomasgollick@gmail.com",
      phone: "",
      linkedin: "linkedin.com/in/thomasgollick",
      github: "github.com/tgollick",
    },
    sections: {
      objective: "Final year Computer Science student...",
      education: "GCSE and A-Level Computer Science...",
      skills: "Programming Languages & Technologies...",
      projects: "AI CV Generator...",
      experience: "IT Technician March 2021 - July 2021...",
    },
    skills: {
      programming_languages: [
        "Visual Basic",
        "Typescript",
        "Javascript",
        "Java",
        "GO",
        "Python",
        "C",
      ],
      frameworks_libraries: [
        ".Net",
        "Redux",
        "Scikit-Learn",
        "React",
        "Pandas",
        "Next.Js",
        "Tailwind",
        "Node.Js",
        "Numpy",
      ],
      databases: ["Mongodb"],
      cloud_tools: ["Git", "Vercel", "Github"],
      other_skills: [],
    },
    entities: {
      names: ["COVID", "Atlas", "Algorithms"],
      organizations: ["Manchester Metropolitan University", "Wren Healthcare"],
      dates: ["March 2021 - July 2021", "2015 - 2019"],
      locations: ["London", "UK", "Chatham"],
    },
    experience_indicators: [],
    education_info: ["BSc", "University", "School", "GCSE"],
  };

  // Insert the CV analysis
  const savedCV = await insertCVAnalysis(
    userId,
    cvData,
    "thomas_gollick_cv.pdf",
    245678,
    "https://storage.example.com/cvs/thomas_gollick_cv.pdf"
  );

  console.log("Saved CV:", savedCV);

  // Get active CV
  const activeCV = await getActiveCVForUser(userId);
  console.log("Active CV:", activeCV);

  // Get all CVs for user
  const allCVs = await getAllCVsForUser(userId);
  console.log("All CVs:", allCVs);
}
