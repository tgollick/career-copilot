# Storing all regex patterns for improved code re-useability, maintainability and modularity

section_patterns = {
    'objective': r'(?i)(objective|summary|profile|about)',
    'experience': r'(?i)(experience|employment|work|career)',
    'education': r'(?i)(education|qualifications|academic|university|degree)',
    'skills': r'(?i)(skills|technologies|technical|competencies)',
    'projects': r'(?i)(projects|portfolio|work samples)'
}

contact_patterns = {
    'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    'phone': r'(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}',
    'linkedin': r'linkedin\.com/in/[\w-]+',
    'github': r'github\.com/[\w-]+'
}

experience_patterns = [
    r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
    r'experienced?\s+in\s+([^.]+)',
    r'worked?\s+(?:as\s+)?(?:a\s+)?([^.]+)',
    r'(\d+)\+?\s*years?\s+(?:working\s+)?with'
]

education_patterns = [
    r'(BSc|MSc|BA|MA|PhD|Bachelor|Master|Degree)\s+[^.]+',
    r'(University|College|School)\s+[^.]+',
    r'(GCSE|A-Level|A Level)\s+[^.]*'
]

