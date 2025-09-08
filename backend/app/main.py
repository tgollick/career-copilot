# Every day above ground is a great day, remember that!
from ml.cv_parser import extract_cv_text
from ml.cv_analysis import CVAnalyser
from ml.tfidf_cosine_similarity import test_similarity
import json

def print_analysis_results(analysis):
    # Print the analysis results, but make it look pretty and super readable
    print("=" * 50)
    print("CV ANALYSIS RESULTS")
    print("=" * 50)
    
    # Contact information
    if analysis['contact_info']:
        print("\nCONTACT INFORMATION:")
        for key, value in analysis['contact_info'].items():
            print(f"  {key.title()}: {value}")
    
    # Technical skills
    print("\nTECHNICAL SKILLS:")
    for category, skills in analysis['skills'].items():
        if skills:
            category_name = category.replace('_', ' ').title()
            print(f"  {category_name}:")
            for skill in skills:
                print(f"    • {skill}")
    
    # CV Sections
    if analysis['sections']:
        print("\nCV SECTIONS IDENTIFIED:")
        for section, content in analysis['sections'].items():
            print(f"  {section.title()}: {len(content)} characters")
    
    # Extracted entities
    print("\nEXTRACTED ENTITIES:")
    for entity_type, entities in analysis['entities'].items():
        if entities:
            print(f"  {entity_type.title()}:")
            for entity in entities:
                print(f"    • {entity}")
    
    # Experience indicators
    if analysis['experience_indicators']:
        print("\nEXPERIENCE INDICATORS:")
        for indicator in analysis['experience_indicators']:
            print(f"  • {indicator}")
    
    # Education information
    if analysis['education_info']:
        print("\nEDUCATION INFORMATION:")
        for edu in analysis['education_info']:
            print(f"  • {edu}")


def build_comprehensive_cv_profile(analysis):
    """
    Build a comprehensive CV profile including skills, experience, education, and projects.
    The smart preprocessing will filter out irrelevant terms anyway.
    """
    profile_parts = []
    
    # 1. All technical skills (highest priority)
    all_skills = []
    for category in ['programming_languages', 'frameworks_libraries', 'databases', 'cloud_tools']:
        skills = analysis['skills'].get(category, [])
        if skills:
            all_skills.extend(skills)
    
    if all_skills:
        # Repeat skills multiple times for emphasis
        skills_text = " ".join(str(skill) for skill in all_skills)
        profile_parts.extend([skills_text] * 3)  # Triple weight for skills
    
    # 2. CV sections (experience, projects, education)
    sections = analysis.get('sections', {})
    
    # Experience section (high weight)
    experience_text = sections.get('experience', '')
    if experience_text:
        profile_parts.extend([experience_text] * 2)  # Double weight
    
    # Projects section (high weight)
    projects_text = sections.get('projects', '')
    if projects_text:
        profile_parts.extend([projects_text] * 2)  # Double weight
    
    # Education section (normal weight)
    education_text = sections.get('education', '')
    if education_text:
        profile_parts.append(education_text)
    
    # Objective section (normal weight)
    objective_text = sections.get('objective', '')
    if objective_text:
        profile_parts.append(objective_text)
    
    # 3. Experience indicators (job-relevant phrases)
    experience_indicators = analysis.get('experience_indicators', [])
    if experience_indicators:
        indicators_text = " ".join(str(indicator) for indicator in experience_indicators)
        profile_parts.append(indicators_text)
    
    # 4. Education information (degrees, institutions)
    education_info = analysis.get('education_info', [])
    if education_info:
        edu_text = " ".join(str(edu) for edu in education_info)
        profile_parts.append(edu_text)
    
    # 5. Filtered entities (organisations, job titles)
    entities = analysis.get('entities', {})
    
    # Add relevant organisations (companies, universities)
    organizations = entities.get('organizations', [])
    if organizations:
        # Filter to likely relevant ones (basic filtering)
        relevant_orgs = []
        for org in organizations:
            org_str = str(org).lower()
            # Skip obviously irrelevant entities
            if len(org_str) > 2 and 'manchester metropolitan university' in org_str:
                relevant_orgs.append(org)
            elif len(org_str) > 3 and any(tech_word in org_str for tech_word in 
                ['tech', 'software', 'data', 'digital', 'systems', 'solutions']):
                relevant_orgs.append(org)
        
        if relevant_orgs:
            orgs_text = " ".join(relevant_orgs)
            profile_parts.append(orgs_text)
    
    # 6. Contact info (for completeness, though less important for matching)
    contact_info = analysis.get('contact_info', {})
    if contact_info:
        # Include things like GitHub, LinkedIn which might be relevant
        contact_text = " ".join(f"{key} {value}" for key, value in contact_info.items() 
                              if key in ['github', 'linkedin'])
        if contact_text:
            profile_parts.append(contact_text)
    
    # Combine all parts
    comprehensive_profile = " ".join(profile_parts)
    
    return comprehensive_profile

def main(show_analysis_results=False, save_analysis_results=False, show_tfidf_results=False):
    # Initialise the CVAnalyser
    cv_analyser = CVAnalyser()

    # Extract text from CV
    cv_path = r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf'

    # Sample job descriptions for testing (can be changed to any job description)
    jobs = [
        "React developer needed. Must have JavaScript TypeScript experience. Node.js backend knowledge preferred.",
        "Python Data Scientist role. Required: pandas numpy scikit-learn machine learning experience. PhD preferred.",
        "Full Stack Engineer position. Technologies: React Node.js MongoDB JavaScript. Startup environment.",
        "Java Enterprise Developer. Spring Boot microservices REST APIs. 5+ years experience required.",
        "Frontend Developer role. React TypeScript Redux experience essential. Modern web development."
    ]
    
    # Better error handling for testing the CVAnalyser class
    try:
        print("Extracting text from CV...")
        cv_text = extract_cv_text(cv_path)
        
        print("Analyzing CV content...")
        analysis = cv_analyser.analyse_cv_test(cv_text)

        # Build comprehensive CV profile
        cv_profile_text = build_comprehensive_cv_profile(analysis)
        
        # Debug print to see what we're including
        print(f"CV profile length: {len(cv_profile_text)} characters")
        print(f"CV profile preview: {cv_profile_text[:200]}...")
        
        # Combine CV profile with job descriptions
        all_documents = [cv_profile_text] + jobs
        
        # Display results
        if show_analysis_results:
            print_analysis_results(analysis)
        
        # Save results to JSON for further processing
        if save_analysis_results:
            with open('cv_analysis_results.json', 'w') as f:
                json.dump(analysis, f, indent=2)
        
        print("\n" + "=" * 50)
        print("Analysis complete!")
    except Exception as e:
        print(f"Error analyzing CV: {e}")
        raise

    # TF-IDF and cosine similarity testing with error handling
    try: 
        print("Testing TF-IDF & Cosine Similarity...")
        similarity_results = test_similarity(all_documents, show_tfidf_results)
        
        # Display summary results if not showing detailed results
        if not show_tfidf_results:
            print("\nJOB MATCHING SUMMARY:")
            print("-" * 30)
            for result in similarity_results:
                print(f"Job {result['job_index']}: {result['match_quality']} ({result['similarity']:.1%})")
        
        print("\nTF-IDF & Cosine Similarity testing complete!")
        return similarity_results
        
    except Exception as e:
        print(f"Error calculating TF-IDF & Cosine Similarity: {e}")
        raise

if __name__ == "__main__":
    # Run with detailed output for development
    main(show_analysis_results=False, save_analysis_results=False, show_tfidf_results=True)