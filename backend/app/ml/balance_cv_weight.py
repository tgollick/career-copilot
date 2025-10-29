def balance_cv_weights(analysis):
    """
    Build a comprehensive CV profile with weightings applied to the relevant sections 
    such as skills, experience, education, projects, and objective.

    Allows better performance when using TF-IDF and cosine similarity to match the CV profile to job descriptions.
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
        profile_parts.extend([skills_text] * 2)  # Double weight for skills
    
    # 2. CV sections (experience, projects, education)
    sections = analysis.get('sections', {})
    
    # Experience section (high weight)
    experience_text = sections.get('experience', '')
    if experience_text:
        profile_parts.extend([experience_text]) 
    
    # Projects section (high weight)
    projects_text = sections.get('projects', '')
    if projects_text:
        profile_parts.extend([projects_text])  
    
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
    weight_balanced_cv = " ".join(profile_parts)
    
    return weight_balanced_cv
