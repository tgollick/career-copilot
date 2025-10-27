import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "../../../../env";
import { db } from "@/lib";
import { CVAnalysisData, Company, CvAnalysis, Job, companies, cvAnalyses } from "@/db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Parse job description from frontend request
  const { job } = await req.json();

  if (!job) {
    return new NextResponse("Invalid Job Data", { status: 401 });
  }

  const [companyInfo] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, job.companyId));

  if (!companyInfo) {
    throw new Error("Company not found");
  }

  const [cv]: CvAnalysis[] = await db.select().from(cvAnalyses).where(eq(cvAnalyses.userId, userId)).limit(1);

  const results = cv.analysisData;

  if(!results) {
    return NextResponse.json(
      { error: "Cannot find users CV data to populate cover letter generation" },
      { status: 401 },
    )
  }

  const contact = `${results.contact_info?.email} | ${results.contact_info?.phone} | ${results.contact_info?.linkedin}`

  // Generate cover letter using job + user data
  const coverLetter = await generateCoverLetter(results, job, companyInfo);

  return NextResponse.json({
    coverLetter,
    companyName: companyInfo.name,
    candidateContact: contact,
    candidateName: results.entities.names[0],
  });
}

async function generateCoverLetter(
  user_profile: CVAnalysisData, // ✅ Changed from CVAnalysisResults
  job: Job,
  company: Company
) {
  const userPrompt = `
Generate a professional, tailored cover letter using the following candidate profile and job information.

---

**CANDIDATE PROFILE**
Contact: ${user_profile?.contact_info?.email || ""}, ${
    user_profile?.contact_info?.phone || ""
  }
LinkedIn: ${user_profile?.contact_info?.linkedin || ""}
GitHub: ${user_profile?.contact_info?.github || ""}
Location: ${user_profile?.entities?.locations?.[0] || "UK"}

**Technical Skills**
- Programming Languages: ${(
    user_profile?.skills?.programming_languages || []
  ).join(", ")}
- Frameworks & Libraries: ${(
    user_profile?.skills?.frameworks_libraries || []
  ).join(", ")}
- Databases: ${(user_profile?.skills?.databases || []).join(", ")}
- Cloud & Tools: ${(user_profile?.skills?.cloud_tools || []).join(", ")}
- Other Skills: ${(user_profile?.skills?.other_skills || []).join(", ")}

**Education**
${(user_profile?.education_info || []).join("\n")}

**Experience Highlights**
${(user_profile?.experience_indicators || []).join("\n")}

**Organizations Associated With**
${(user_profile?.entities?.organizations || []).join(", ")}

---

**JOB INFORMATION**
Role: ${job.title}
Company: ${company.name}
Industry: ${company.industry || "Technology"}
Location: ${job.location || company.location || "Not specified"}
Employment Type: ${job.employmentType || "Not specified"}
Remote Type: ${job.remoteType || "Not specified"}
Experience Level: ${job.experienceLevel || "Not specified"}
Salary Range: ${
    job.salaryMin && job.salaryMax
      ? `${job.salaryMin}-${job.salaryMax} ${job.salaryCurrency}`
      : "Not specified"
  }

**Job Requirements**
${(job.requirements || []).join("\n")}

**Preferred Skills**
${(job.skills || []).join("\n")}

---

### TASK
Write a tailored cover letter for the candidate applying to the above role. 
- Reference the company by name and show enthusiasm for their mission/industry. 
- Highlight the most relevant skills and experiences that match the job requirements. 
- Use concrete examples where possible (e.g., projects, internships, leadership). 
- Keep it concise, professional, and impactful. 
- End with a confident closing statement that invites an interview.
`;

  const systemPrompt = `
You are an expert career consultant and professional writer who specializes in creating tailored, persuasive cover letters for software engineering and technology roles.

CRITICAL FORMATTING RULES:
- Write in PLAIN TEXT ONLY - absolutely no markdown syntax (no **, no bullets, no lists, no #)
- Use only complete paragraphs - never use bullet points or numbered lists
- Keep the letter concise: 3-4 paragraphs maximum (plus greeting and closing)
- Aim for 250-350 words total - this must fit comfortably on one page

STRUCTURE:
1. Opening paragraph: Express interest in the role and briefly mention 1-2 key qualifications
2. Body paragraph(s): Highlight 2-3 most relevant experiences or skills that directly match the job requirements. Be specific but concise.
3. Closing paragraph: Express enthusiasm and request an interview

CONTENT GUIDELINES:
- Be selective - only mention the most relevant skills and experiences, not everything
- Avoid listing multiple technologies - weave them naturally into sentences
- Write naturally and conversationally, not like a sales pitch
- Personalize for the company when possible, but keep it brief
- Focus on impact and results, not just listing responsibilities
- Never use phrases like "I am confident that" or "I believe I would be"

TONE:
- Professional but approachable
- Confident without being arrogant
- Genuine enthusiasm without over-enthusiasm
- Direct and clear, avoiding filler words
`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "deepseek-chat",
  });

  return completion.choices[0].message.content;
}
