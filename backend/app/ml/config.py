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

experience_indicators = {
    'lead', 'led', 'leading', 'leadership', 'mentor', 'mentored', 'mentoring',
    'manage', 'managed', 'managing', 'management', 'supervise', 'supervised',
    'train', 'trained', 'training', 'coach', 'coached', 'coaching',
    'architect', 'architecture', 'design', 'designed', 'designing',
    'build', 'built', 'building', 'create', 'created', 'creating',
    'develop', 'developed', 'developing', 'implement', 'implemented', 'implementing',
    'scale', 'scaled', 'scaling', 'optimize', 'optimized', 'optimizing',
    'performance', 'production', 'deploy', 'deployed', 'deployment',
    'maintain', 'maintained', 'maintenance', 'support', 'supported',
    'deliver', 'delivered', 'delivering', 'ship', 'shipped', 'shipping',
    'launch', 'launched', 'launching', 'release', 'released', 'releasing',
    'complete', 'completed', 'completing', 'finish', 'finished',
    'collaborate', 'collaborated', 'collaboration', 'coordinate', 'coordinated',
    'integrate', 'integrated', 'integration', 'migrate', 'migrated', 'migration',
    'senior', 'junior', 'principal', 'staff', 'lead',
    'improve', 'improved', 'increase', 'increased', 'reduce', 'reduced',
    'enhance', 'enhanced', 'solve', 'solved', 'fix', 'fixed'
}

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

