def flatten_analysis(analysis):
    """
    Take the analysis object, finds the relevant sections and flattens it to a string ready for the TFIDF instance
    """
    profile_parts = []
    
    # 1. All technical skills (highest priority)
    all_skills = []
    for category in ['programming_languages', 'frameworks_libraries', 'databases', 'cloud_tools']:
        skills = analysis['skills'].get(category, [])
        if skills:
            all_skills.extend(skills)
    
    if all_skills:
        skills_text = " ".join(str(skill) for skill in all_skills)
        profile_parts.extend([skills_text])     

    # 2. CV sections (experience, projects, education)
    sections = analysis.get('sections', {})
    
    # Experience section 
    experience_text = sections.get('experience', '')
    if experience_text:
        profile_parts.extend([experience_text]) 
    
    # Projects section 
    projects_text = sections.get('projects', '')
    if projects_text:
        profile_parts.extend([projects_text])  
    
    # Education section 
    education_text = sections.get('education', '')
    if education_text:
        profile_parts.append(education_text)
    
    # Objective section 
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
        relevant_orgs = []
        for org in organizations:
            relevant_orgs.append(org)
        
        if relevant_orgs:
            orgs_text = " ".join(relevant_orgs)
            profile_parts.append(orgs_text)
    
    # Combine all parts
    flatten_analysis = " ".join(profile_parts)
    
    return flatten_analysis
