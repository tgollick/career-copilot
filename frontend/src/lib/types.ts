import { LargeNumberLike } from "crypto";

export type CVAnalysisResults = {
  contact_info: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
  };
  sections: {
    personal_statement: string;
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
  skills: {
    programming_languages: string[];
    frameworks_libraries: string[];
    databases: string[];
    cloud_tools: string[];
    other_skills: string[];
  };
  entities: {
    names: string[];
    organizations: string[];
    dates: string[];
    locations: string[];
  };
  experience_indicators: string[];
  education_info: string[];
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// FIXED: Updated to match actual database schema with nullable fields
export type JobWithSimilarityExplicit = {
  // Job fields
  id: number;
  title: string;
  description: string;
  location: string | null; // ← Fixed: was string, now string | null
  remoteType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string | null;
  experienceLevel: string | null;
  skills: string[] | null;
  requirements: string[] | null;
  postedAt: Date;
  companyId: number;
  
  // Similarity fields (nullable)
  similarity: string | null;
  matchQuality: string | null;
};

// API Response type
export type JobsApiResponse = {
  jobs: JobWithSimilarityExplicit[];
  pagination: PaginationInfo;
};
