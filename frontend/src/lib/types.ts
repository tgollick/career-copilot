
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type JobWithSimilarityExplicit = {
  id: number;
  title: string;
  description: string;
  location: string | null;
  remoteType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string | null;
  experienceLevel: string | null;
  skills: string[] | null;
  requirements: string[] | null;
  postedAt: Date;
  companyId: number;
  similarity: string | null;
  matchQuality: string | null;
};

export type JobsApiResponse = {
  jobs: JobWithSimilarityExplicit[];
  pagination: PaginationInfo;
};
