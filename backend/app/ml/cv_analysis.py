import spacy
import re
from typing import Dict, List, Tuple

class CVAnalyser:
    def __init__(self):
        # Load the base model
        self.nlp = spacy.load("en_core_web_sm")

        # After testing the base model, it was not able to extract the skills, so we created our own list of skills specific to the job domain.

        # List of programming languages to extract
        self.programming_languages = {
            'python', 'javascript', 'typescript', 'java', 'c#', 'c++', 'c',
            'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r',
            'matlab', 'perl', 'shell', 'bash', 'powershell', 'visual basic'
        }

        # List of frameworks and libraries to extract
        self.frameworks_libraries = {
            'react', 'angular', 'vue', 'node.js', 'express', 'next.js',
            'django', 'flask', 'spring', 'laravel', '.net', 'jquery',
            'bootstrap', 'tailwind', 'redux', 'numpy', 'pandas', 'scipy',
            'scikit-learn', 'tensorflow', 'pytorch', 'keras'
        }
        
        # List of databases to extract
        self.databases = {
            'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'oracle',
            'sql server', 'dynamodb', 'cassandra', 'elasticsearch'
        }
        
        # List of cloud tools to extract
        self.cloud_tools = {
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'git', 'github', 'gitlab', 'bitbucket', 'vercel', 'netlify',
            'heroku', 'firebase', 'terraform'
        }
        
        # CV section patterns (case insensitive)
        self.section_patterns = {
            'objective': r'(?i)(objective|summary|profile|about)',
            'experience': r'(?i)(experience|employment|work|career)',
            'education': r'(?i)(education|qualifications|academic|university|degree)',
            'skills': r'(?i)(skills|technologies|technical|competencies)',
            'projects': r'(?i)(projects|portfolio|work samples)'
        }
        
        # Contact info patterns
        self.contact_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}',
            'linkedin': r'linkedin\.com/in/[\w-]+',
            'github': r'github\.com/[\w-]+'
        }

    def analyse_cv_test(self, text: str) -> Dict:
        # Process the text with the loaded spaCy model
        doc = self.nlp(text)

        # Initialise the results variable to store the analysis results
        # Now including all the custom sections to better extract and group information
        results = {
            'contact_info': {},
            'sections': {},
            'skills': {
                'programming_languages': [],
                'frameworks_libraries': [],
                'databases': [],
                'cloud_tools': [],
                'other_skills': []
            },
            'entities': {
                'names': [],
                'organizations': [],
                'dates': [],
                'locations': []
            },
            'experience_indicators': [],
            'education_info': []
        }

        # Extract contact information
        results['contact_info'] = self._extract_contact_info(text)
        
        # Identify CV sections
        results['sections'] = self._identify_sections(text)
        
        # Enhanced skill extraction
        results['skills'] = self._extract_skills_comprehensive(text)
        
        # Improved entity extraction with filtering
        results['entities'] = self._extract_entities_filtered(doc, text)
        
        # Extract experience indicators
        results['experience_indicators'] = self._extract_experience_indicators(text)
        
        # Extract education information
        results['education_info'] = self._extract_education_info(text)
        
        # Return the results
        return results

    def _extract_contact_info(self, text: str) -> Dict[str, str]:
        # Initialise the contact_info variable to store the contact information
        contact_info = {}

        # Loop through the contact_patterns dictionary and extract the contact information using regex
        for info_type, pattern in self.contact_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                # If the match is a string, store it as is, otherwise store the first match
                contact_info[info_type] = matches[0] if isinstance(matches[0], str) else matches[0]

        # Return the contact information
        return contact_info

    def _identify_sections(self, text: str) -> Dict[str, str]:
        # Initialise the sections variable to store the sections
        sections = {}

        # Split the text into individual lines
        lines = text.split('\n')

        # Two variables to track the current section and content whilst parsing the text
        current_section = None
        current_content = []

        # Loop through the lines and identify the sections
        for line in lines:
            # Remove leading and trailing whitespace
            line = line.strip()

            # Skip empty lines
            if not line:
                continue
            
            # Variable to track if a regex pattern has been matched and therefore a new section has been found
            section_found = None

            # Iterate through the section_patterns dictionary and extract the section information using regex (if found)
            for section_name, pattern in self.section_patterns.items():
                if re.search(pattern, line) and len(line) < 50:
                    section_found = section_name
                    break

            # If a section has been found, save the current section and reset the current content
            if section_found:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content)
                    
                current_content = []
                current_section = section_found
            else:
                # If no section has been found, add the line to the current content
                if current_section:
                    current_content.append(line)

        # Save final section
        if current_section and current_content:
            sections[current_section] = '\n'.join(current_content)

        # Return the sections
        return sections