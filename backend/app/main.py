# Every day above ground is a great day, remember that!
from ml.cv_parser import extract_cv_text
from ml.cv_analysis import CVAnalyser
from ml.balance_cv_weight import balance_cv_weights
from ml.tfidf import test_similarity
import json
from pathlib import Path
from ml.config import jobs, AppConfig
from ml.exceptions import PDFPassingError, CVAnalysisError, SpacyModelError, InsufficientDataError, TFIDFCalculationError

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


def validate_cv_path(cv_path: str):
    """Validate CV file path exists and is readable"""
    path = Path(cv_path)
    
    if not path.exists():
        raise CVAnalysisError(f"CV file does not exist: {cv_path}")
    
    if not path.is_file():
        raise CVAnalysisError(f"Path is not a file: {cv_path}")
    
    if path.suffix.lower() not in ['.pdf']:
        raise CVAnalysisError(f"Unsupported file type: {path.suffix}")

def main(config):
    # Initialise the CVAnalyser
    cv_analyser = CVAnalyser()

    # Validate cv path
    validate_cv_path(config.cv_path)
    
    # Better error handling for testing the CVAnalyser class
    try:
        print("Extracting text from CV...")
        cv_text = extract_cv_text(config.cv_path)
        
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
        if config.show_analysis_results:
            print_analysis_results(analysis)
        
        # Save results to JSON for further processing
        if config.save_analysis_results:
            with open(config.output_file, 'w') as f:
                json.dump(analysis, f, indent=2)
        
        print("\n" + "=" * 50)
        print("Analysis complete!")

        # TF-IDF and Cosine Similarity
        print("Testing TF-IDF & Cosine Similarity...")
        test_similarity(all_documents, config.show_tfidf_results)
        
        print("\nTF-IDF & Cosine Similarity testing complete!")

    except PDFPassingError as e:
        print(f"PDF Error: {e}")
        print("Please check that the file exists and is a valid PDF.")
        return False
        
    except SpacyModelError as e:
        print(f"spaCy Model Error: {e}")
        return False
        
    except InsufficientDataError as e:
        print(f"Data Error: {e}")
        print("Please provide a CV with more content.")
        return False
        
    except TFIDFCalculationError as e:
        print(f"Analysis Error: {e}")
        return False
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise  # Re-raise for debugging

if __name__ == "__main__":
    # Configure the application
    config = AppConfig(
        cv_path=r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf',
        show_tfidf_results=True,
        show_analysis_results=False,
        save_analysis_results=False
    )   

    # Run the application with desired config
    main(config)