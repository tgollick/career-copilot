import spacy
import re
from typing import Dict, List
from .config import programming_languages, frameworks_libraries, databases, cloud_tools, experience_indicators
from .patterns import section_patterns, contact_patterns, experience_patterns, education_patterns
from .exceptions import SpacyModelError

class CVAnalyser:
    def __init__(self):
        # Load the base model
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.all_technical_skills = []
        except OSError:
            raise SpacyModelError(
                "spaCy English model not found. Install with: "
                "python -m spacy download en_core_web_sm"
            )
        except Exception as e:
            raise SpacyModelError(f"Failed to load spaCy model: {str(e)}")

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

        self.all_technical_skills = [
            skill.lower() 
            for skill_category in results['skills'].values()  
            for skill in skill_category  
        ]
        
        # Improved entity recognition with context provided for better extraction
        results['entities'] = self._extract_entities_with_context(
                doc,
                results['sections'],
                )
        
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
        for info_type, pattern in contact_patterns.items():
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
            for section_name, pattern in section_patterns.items():
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

    def _extract_skills_comprehensive(self, text: str) -> Dict[str, List[str]]:
        # Make sure the text is all lowercase before searching for key skills
        lower_text = text.lower()

        # Initialise the skills variable to store the skills
        skills = {
            'programming_languages': [],
            'frameworks_libraries': [],
            'databases': [],
            'cloud_tools': [],
            'other_skills': []      
        }

        # Extract skills using _find_skills_in_text function
        skills['programming_languages'] = self._find_skills_in_text(lower_text, programming_languages)
        skills['frameworks_libraries'] = self._find_skills_in_text(lower_text, frameworks_libraries)
        skills['databases'] = self._find_skills_in_text(lower_text, databases)
        skills['cloud_tools'] = self._find_skills_in_text(lower_text, cloud_tools)

        # Return the skills
        return skills
    
    def _find_skills_in_text(self, text: str, skill_set: set) -> List[str]:
        # Initialise the found skills variable to store the skills
        found_skills = []

        for skill in skill_set:
            # Handle edge cases of skills for example "Nodejs" vs "Node.js"
            skill_varitations = [skill, skill.replace(".", ""), skill.replace(" ", "")]

            # Loop through the skill_varitations and check if the skill is in the text
            for variation in skill_varitations:
                if variation in text:
                    # Ensure the skill is the whole word and not found in a word
                    # E.g. "C" should not be found in "Cafe Manager"
                    if len(skill) <= 2:
                        pattern = r'\b' + re.escape(skill.upper()) + r'\b'
                        if re.search(pattern, text.upper()):
                            found_skills.append(skill.upper())
                            break
                    else:
                        # If not a shorter skill like C# or C then assume a match and append found_skills array
                        found_skills.append(skill.title())
                        break

        # Return the found skills
        return found_skills

    def _extract_entities_with_context(self, full_doc, sections: Dict[str, str]) -> Dict[str, List[str]]:
        entities = {
            'names': [],
            'organisations': [],
            'dates': [],
            'locations': [],
        }

        # Focusing on organisations from experience section (most likely previous or current employers)
        experience_text = sections.get('experience', '')

        if experience_text:
            exp_doc = self.nlp(experience_text)

            for ent in exp_doc.ents:
                if ent.label_ == 'ORG':
                    entity_text = ent.text.strip()

                    if self._is_valid_employer(entity_text, experience_text):
                        entities['organisations'].append(entity_text)

        
        # Focusing on organsations from education (most likely universities, schools etc)
        education_text = sections.get('education', '')

        if education_text:
            edu_doc = self.nlp(education_text)

            for ent in edu_doc.ents:
                if ent.label_ == 'ORG':
                    entity_text = ent.text.strip()

                    if self._is_valid_school(entity_text, education_text):
                        entities['organisations'].append(entity_text)

        for ent in full_doc.ents:
            if ent.label_ in ['GPE', 'LOC', 'DATE']:
                entity_text = ent.text.strip()

                if ent.label_ in ['GPE', 'LOC']:
                    if entity_text.lower() not in self.all_technical_skills:
                        if len(entity_text) > 2 and not entity_text.endswith('.js'):
                            entities['locations'].append(entity_text)
                else:
                    if '-' in entity_text or len(entity_text) > 4:
                        entities['dates'].append(entity_text)

        for key in entities:
            entities[key] = list(dict.fromkeys(entities[key]))

        return entities

    def _is_valid_employer(self, org_name: str, experience_context: str) -> bool:
        
        org_lower = org_name.lower()
        context_lower = experience_context.lower()

        # Reject obvious false positives
        if org_name.startswith('•') or org_name.startswith('-'):
            return False
        
        if len(org_name) < 3:
            return False
        
        # Reject if it's actually a skill or technology
        if org_lower in self.all_technical_skills:
            return False
        
        # Reject common section headers or formatting artifacts
        if org_lower in ['experience', 'work history', 'employment', 'career']:
            return False

        # Positive signals that its actually an employer
        # Trying to see if the name is surrounded by employment indicator terms
        org_position = context_lower.find(org_lower)

        if org_position != -1:
            context_window = context_lower[max(0, org_position-200): min(len(context_lower), org_position+200)]

            employer_indications = [
                'worked at', 'working at', 'employed by', 'position at',
                'role at', 'joined', 'company', 'organisation', 'firm', 'employer',
                'client'
            ]

            if any(indicator in context_window for indicator in employer_indications):
                return True 

        company_patterns = [
            r'\b(ltd|limited|inc|incorporated|corp|corporation|llc|plc)\b',
            r'\b(group|holdings|partners|associates|solutions)\b'
        ]
        
        for pattern in company_patterns:
            if re.search(pattern, org_lower):
                return True

        return True

    def _is_valid_school(self, org_name: str, education_context: str):

        org_lower = org_name.lower()
        context_lower = education_context.lower()

        if org_name.startswith('•') or len(org_name) < 3:
            return False
        
        if org_lower in self.all_technical_skills:
            return False

        education_keywords = [
            'university', 'college', 'school', 'academy', 'institute',
            'polytechnic', 'metropolitan', 'high'
        ]

        if any(keyword in org_lower for keyword in education_keywords):
            return True

        org_position = context_lower.find(org_lower)

        if org_position != -1:
            context_window = context_lower[max(0, org_position-150): min(len(context_lower), org_position+150)]

            degree_indicators = [
                'bsc', 'msc', 'ba', 'ma', 'phd', 'bachelor', 'hons', 'master',
                'degree', 'diploma', 'gcse', 'a-level', 'qualification'
            ]

            if any(indicator in context_window for indicator in degree_indicators):
                return True

        return False

    def _extract_experience_indicators(self, text: str) -> List[str]:
        # Extract phrases that indicate work experience
        # Variable to store extracted experience indicators
        indicators = []
        
        # Loop through the experience_patterns and extract the experience indicators using regex
        for pattern in experience_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            indicators.extend(matches)

        words = text.split(" ")

        for w in words:
            if w in experience_indicators:
                indicators.append(w)
        
        # Return the experience indicators
        return indicators

    def _extract_education_info(self, text: str) -> List[str]:
        # Extract education information
        # Variable to store extracted education information
        education_info = []
        
        # Loop through the education_patterns and extract the education information using regex
        for pattern in education_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            education_info.extend(matches)
        
        # Return the education information
        return education_info

# Exporting the class rather than a function to utalise a singleton pattern in main.py
__all__ = ['CVAnalyser']  
