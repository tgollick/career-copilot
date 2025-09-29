// app/api/generate-cover-letter/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "../../../../env";
import { CVAnalysisResults } from "@/lib/types";
import { db } from "@/lib";
import { Company, Job, companies } from "@/db/schema";
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

  // Fetch user data securely from your DB
  // For now we are going to mock with Fake info as we dont have custom onboarding setup with Clerk
  // TO DO ^^^^^^
  const results = {
    contact_info: {
      email: "thomas.gollick@example.com",
      phone: "+44 7123 456789",
      linkedin: "linkedin.com/in/thomasgollick",
      github: "github.com/tgollick",
      location: "Manchester, UK",
    },
    sections: {
      personal_statement:
        "Recent Computer Science graduate with First Class Honours from Manchester Metropolitan University...",
      education:
        "BSc Computer Science (First Class Honours) - Manchester Metropolitan University (2021-2024)...",
      experience:
        "Full Stack Developer - Freelance (2024) • Built responsive website for DSG Mortgages using React and Node.js...",
      skills:
        "Programming Languages: Python, JavaScript, TypeScript, Java, C#, HTML, CSS...",
      projects:
        "Career Copilot - AI-powered job application assistant built with Python, FastAPI, and OpenAI...",
    },
    skills: {
      programming_languages: [
        "Python",
        "JavaScript",
        "TypeScript",
        "Java",
        "C#",
        "HTML",
        "CSS",
        "SQL",
        "C++",
        "Bash",
      ],
      frameworks_libraries: [
        "React",
        "Node.js",
        "Express.js",
        "FastAPI",
        "Flask",
        "Django",
        "Next.js",
        "Redux",
        "jQuery",
        "Bootstrap",
        "Tailwind CSS",
        "Jest",
        "Pytest",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Matplotlib",
        "Seaborn",
      ],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis"],
      cloud_tools: [
        "AWS",
        "Docker",
        "Git",
        "GitHub",
        "GitLab",
        "Heroku",
        "Netlify",
        "Vercel",
        "Linux",
        "Ubuntu",
        "Nginx",
      ],
      other_skills: [
        "RESTful APIs",
        "GraphQL",
        "Microservices",
        "Agile",
        "Scrum",
        "Test Driven Development",
        "CI/CD",
        "Machine Learning",
        "Data Analysis",
        "Problem Solving",
        "Team Collaboration",
        "Code Review",
        "System Design",
        "Object-Oriented Programming",
      ],
    },
    entities: {
      names: ["Thomas Gollick", "Tom"],
      organizations: [
        "Manchester Metropolitan University",
        "DSG Mortgages",
        "TechFlow Solutions",
        "GitHub",
        "LinkedIn",
        "AWS",
        "Google",
        "Microsoft",
        "Meta",
      ],
      dates: [
        "2024",
        "2021-2024",
        "June 2024",
        "September 2023",
        "January 2024",
        "Summer 2024",
        "2023",
        "2022",
      ],
      locations: [
        "Manchester",
        "UK",
        "United Kingdom",
        "London",
        "Birmingham",
        "Leeds",
        "Remote",
      ],
    },
    experience_indicators: [
      "Recent Computer Science graduate",
      "3+ years of programming experience",
      "Built full-stack web applications",
      "Experience with modern development practices",
      "Freelance web development projects",
      "University project team leadership",
      "Open source contributions",
      "Internship experience",
      "Commercial project delivery",
    ],
    education_info: [
      "BSc Computer Science - First Class Honours",
      "Manchester Metropolitan University (2021-2024)",
      "Relevant modules: Software Engineering, Database Systems, Web Development",
      "Machine Learning and Artificial Intelligence",
      "Data Structures and Algorithms",
      "Computer Networks and Security",
      "Final year project: Career Copilot - AI Job Application Assistant",
      "A-Levels: Mathematics (A), Computer Science (A), Physics (B)",
    ],
  };

  // Generate cover letter using job + user data
  const coverLetter = await generateCoverLetter(results, job, companyInfo);

  return NextResponse.json({ coverLetter });
}

// Example helper
async function generateCoverLetter(
  user_profile: CVAnalysisResults,
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
Location: ${
    user_profile?.entities?.locations?.[0] ||
    user_profile?.contact_info?.location ||
    "UK"
  }

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
You always:
- Write in a professional yet engaging tone.
- Emphasize the strongest overlaps between the candidate’s background and the job requirements.
- Structure the letter with a clear introduction, body paragraphs that highlight relevant skills and experiences, and a confident closing.
- Personalize the letter for the specific company and role, avoiding generic or repetitive wording.
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
