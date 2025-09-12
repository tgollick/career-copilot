from dataclasses import dataclass
from pathlib import Path
from typing import Optional

# Dataclass for configuration
@dataclass
class AppConfig:
    """Application configuration for CV analysis and job matching"""
    cv_path: str
    show_analysis_results: bool = False
    save_analysis_results: bool = False
    show_tfidf_results: bool = False
    output_file: str = "cv_analysis_results.json"
    
    # Future FastAPI configs can go here
    api_host: str = "localhost"
    api_port: int = 8000

# Storing all configuration variables for improved code re-useability, maintainability and modularity

# Individual skill sets remain as sets for easy updates
programming_languages = {
    'python', 'javascript', 'typescript', 'java', 'c#', 'c++', 'c',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r',
    'matlab', 'perl', 'shell', 'bash', 'powershell', 'visual basic'
}

frameworks_libraries = {
    'react', 'angular', 'vue', 'node.js', 'express', 'next.js',
    'django', 'flask', 'spring', 'laravel', '.net', 'jquery',
    'bootstrap', 'tailwind', 'redux', 'numpy', 'pandas', 'scipy',
    'scikit-learn', 'tensorflow', 'pytorch', 'keras'
}

databases = {
    'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'oracle',
    'sql server', 'dynamodb', 'cassandra', 'elasticsearch'
}

cloud_tools = {
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab', 'bitbucket', 'vercel', 'netlify',
    'heroku', 'firebase', 'terraform'
}

# Combining all sub-skills into a single set for use in the TFIDF module
all_technical_skills = {
    *programming_languages,
    *frameworks_libraries,
    *databases,
    *cloud_tools
}

# Misc and text pre-processing configuration variables
jobs = [
    "React developer needed. Must have JavaScript TypeScript experience. Node.js backend knowledge preferred.",
    "Python Data Scientist role. Required: pandas numpy scikit-learn machine learning experience. PhD preferred.",
    "Full Stack Engineer position. Technologies: React Node.js MongoDB JavaScript. Startup environment.",
    "Java Enterprise Developer. Spring Boot microservices REST APIs. 5+ years experience required.",
    "Frontend Developer role. React TypeScript Redux experience essential. Modern web development."
]

job_terms = {
    'developer', 'engineer', 'scientist', 'analyst', 'manager',
    'senior', 'junior', 'lead', 'full', 'stack', 'frontend', 'backend',
    'fullstack', 'web', 'mobile', 'data', 'machine', 'learning',
    'artificial', 'intelligence', 'software', 'computer', 'science'
}

stop_words = {
    'experience', 'years', 'required', 'preferred', 'knowledge',
    'skills', 'looking', 'needed', 'position', 'role', 'company',
    'team', 'work', 'working', 'must', 'have', 'essential', 
    'technologies', 'startup', 'environment', 'modern', 'development'
}

