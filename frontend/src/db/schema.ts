import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for better type safety
export const companySizeEnum = pgEnum("company_size", [
  "startup",
  "small",
  "medium",
  "large",
  "enterprise",
]);

export const remoteTypeEnum = pgEnum("remote_type", [
  "on-site",
  "remote",
  "hybrid",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full-time",
  "part-time",
  "contract",
  "internship",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "lead",
]);

export type ContactInfo = {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
};

export type Sections = {
  objective: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
};

export type Skills = {
  programming_languages: string[];
  frameworks_libraries: string[];
  databases: string[];
  cloud_tools: string[];
  other_skills: string[];
};

export type Entities = {
  names: string[];
  organizations: string[];
  dates: string[];
  locations: string[];
};

export type CVAnalysisData = {
  contact_info: ContactInfo;
  sections: Sections;
  skills: Skills;
  entities: Entities;
  experience_indicators: string[];
  education_info: string[];
};

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  size: companySizeEnum("size"),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  skills: text("skills").array(),
  location: varchar("location", { length: 255 }),
  remoteType: remoteTypeEnum("remote_type"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: varchar("salary_currency", { length: 3 }).default("GBP"),
  employmentType: employmentTypeEnum("employment_type"),
  experienceLevel: experienceLevelEnum("experience_level"),
  isActive: boolean("is_active").default(true).notNull(),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cvAnalyses = pgTable("cv_analyses", {
  id: serial("id").primaryKey(),

  // Clerk User ID
  userId: varchar("user_id", { length: 255 }).notNull(),

  // File Metadata
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size"), // in bytes
  fileUrl: varchar("file_url", { length: 512 }), // S3/cloud storage URL if applicable

  // Full Analysis Data (store the entire JSON)
  analysisData: json("analysis_data").$type<CVAnalysisData>().notNull(),

  // =====================
  // Denormalized Fields for Quick Queries
  // =====================

  // Contact Information (for easy access)
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  linkedin: varchar("linkedin", { length: 255 }),
  github: varchar("github", { length: 255 }),

  // Skills (arrays for filtering/matching)
  programmingLanguages: text("programming_languages").array(),
  frameworks: text("frameworks").array(),
  databases: text("databases").array(),
  cloudTools: text("cloud_tools").array(),

  // Parsed Text Sections (for search/display)
  objective: text("objective"),
  educationSummary: text("education_summary"),
  experienceSummary: text("experience_summary"),

  // Extracted Entities
  organizations: text("organizations").array(), // Companies worked at
  locations: text("locations").array(), // Geographic locations

  // Education Indicators
  educationLevel: varchar("education_level", { length: 100 }), // e.g., "BSc", "MSc"
  hasUniversityDegree: boolean("has_university_degree").default(false),

  // Status
  isActive: boolean("is_active").default(true), // Current CV vs historical versions

  // Timestamps
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk userId
  email: varchar("email", { length: 255 }).notNull().unique(),

  // User Profile
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),

  // Reference to active CV
  activeCvId: integer("active_cv_id"),

  // Preferences (will implement at a later date)
  // jobSearchPreferences: json("job_search_preferences"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  cvAnalyses: many(cvAnalyses),
  activeCv: one(cvAnalyses, {
    fields: [users.activeCvId],
    references: [cvAnalyses.id],
  }),
}));

export const cvAnalysesRelations = relations(cvAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [cvAnalyses.userId],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CvAnalysis = typeof cvAnalyses.$inferSelect;
export type NewCvAnalysis = typeof cvAnalyses.$inferInsert;
