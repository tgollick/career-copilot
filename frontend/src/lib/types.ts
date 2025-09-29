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
