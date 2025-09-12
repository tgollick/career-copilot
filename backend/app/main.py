# Every day above ground is a great day, remember that!
from ml.cv_parser import extract_cv_text
from ml.cv_analysis import CVAnalyser
from ml.balance_cv_weight import balance_cv_weights
from ml.tfidf import test_similarity
import json
from ml.config import jobs

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


def main(show_analysis_results=False, save_analysis_results=False, show_tfidf_results=False):
    # Initialise the CVAnalyser
    cv_analyser = CVAnalyser()

    # Extract text from CV
    cv_path = r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf'
    
    # Better error handling for testing the CVAnalyser class
    try:
        print("Extracting text from CV...")
        cv_text = extract_cv_text(cv_path)
        
        print("Analyzing CV content...")
        analysis = cv_analyser.analyse_cv_test(cv_text) 

        # Build comprehensive CV profile
        weighted_cv_text = balance_cv_weights(analysis)
        
        # Debug print to see what we're including
        print(f"CV profile length: {len(weighted_cv_text)} characters")
        print(f"CV profile preview: {weighted_cv_text[:200]}...")
        
        # Combine CV profile with job descriptions
        all_documents = [weighted_cv_text] + jobs
        
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