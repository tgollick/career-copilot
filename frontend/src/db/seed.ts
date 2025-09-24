import { db } from "../lib/index";
import { companies, jobs } from "./schema";

const companiesData = [
  {
    name: "TechForward Labs",
    description: "AI-driven solutions for modern businesses",
    industry: "Technology",
    size: "startup" as const,
    location: "London, UK",
    website: "https://techforward.com",
  },
  {
    name: "DataStream Solutions",
    description: "Big data analytics and cloud infrastructure",
    industry: "Technology",
    size: "medium" as const,
    location: "Manchester, UK",
    website: "https://datastream.co.uk",
  },
  {
    name: "GreenTech Innovations",
    description: "Sustainable technology for a better future",
    industry: "CleanTech",
    size: "small" as const,
    location: "Bristol, UK",
    website: "https://greentech-innovations.com",
  },
  {
    name: "CyberShield Security",
    description: "Enterprise cybersecurity solutions",
    industry: "Cybersecurity",
    size: "medium" as const,
    location: "Edinburgh, UK",
    website: "https://cybershield.security",
  },
  {
    name: "CloudFirst Systems",
    description: "Cloud infrastructure and DevOps services",
    industry: "Cloud Computing",
    size: "large" as const,
    location: "London, UK",
    website: "https://cloudfirst.systems",
  },
];

const jobsData = [
  {
    companyId: 1,
    title: "Senior Full Stack Developer",
    description:
      "Join our AI-driven team to build cutting-edge web applications using React, Node.js, and Python. Work on exciting projects that shape the future of business automation.",
    requirements: [
      "5+ years full-stack experience",
      "Strong React/Node.js skills",
      "Python knowledge",
      "Git proficiency",
    ],
    skills: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 2,
    title: "Data Engineer",
    description:
      "Design and maintain large-scale data pipelines for our analytics platform. Experience with cloud services and big data technologies essential.",
    requirements: [
      "3+ years data engineering experience",
      "AWS/Azure knowledge",
      "Python/Scala proficiency",
      "SQL expertise",
    ],
    skills: ["Python", "AWS", "Apache Spark", "SQL", "Docker", "Kafka"],
    location: "Manchester, UK",
    remoteType: "remote" as const,
    salaryMin: 45000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert companies
    const insertedCompanies = await db
      .insert(companies)
      .values(companiesData)
      .returning();

    console.log(`✅ Inserted ${insertedCompanies.length} companies`);

    // Insert jobs
    const insertedJobs = await db.insert(jobs).values(jobsData).returning();

    console.log(`✅ Inserted ${insertedJobs.length} jobs`);
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
