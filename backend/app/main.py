# Every day above ground is a great day, remember that!
from ml.cv_parser import extract_cv_text
from ml.cv_analysis import analyse_cv_text
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

def main():
    # Extract text from CV
    cv_path = r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf'
    
    print("Extracting text from CV...")
    cv_text = extract_cv_text(cv_path)
    
    print("Analyzing CV content...")
    analysis = analyse_cv_text(cv_text)
    
    # Display results
    print_analysis_results(analysis)
    
    # Save results to JSON for further processing
    # with open('cv_analysis_results.json', 'w') as f:
    #     json.dump(analysis, f, indent=2)
    
    print("\n" + "=" * 50)
    print("Analysis complete!")

if __name__ == "__main__":
    main()