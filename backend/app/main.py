# # Every day above ground is a great day, remember that!
# from ml.cv_parser import extract_cv_text
# from ml.cv_analysis import CVAnalyser
# from ml.balance_cv_weight import balance_cv_weights
# from ml.tfidf import test_similarity
# import json
# from pathlib import Path
# from ml.config import jobs, AppConfig
# from ml.exceptions import PDFPassingError, CVAnalysisError, SpacyModelError, InsufficientDataError, TFIDFCalculationError

# def print_analysis_results(analysis):
#     # Print the analysis results, but make it look pretty and super readable
#     print("=" * 50)
#     print("CV ANALYSIS RESULTS")
#     print("=" * 50)
    
#     # Contact information
#     if analysis['contact_info']:
#         print("\nCONTACT INFORMATION:")
#         for key, value in analysis['contact_info'].items():
#             print(f"  {key.title()}: {value}")
    
#     # Technical skills
#     print("\nTECHNICAL SKILLS:")
#     for category, skills in analysis['skills'].items():
#         if skills:
#             category_name = category.replace('_', ' ').title()
#             print(f"  {category_name}:")
#             for skill in skills:
#                 print(f"    • {skill}")
    
#     # CV Sections
#     if analysis['sections']:
#         print("\nCV SECTIONS IDENTIFIED:")
#         for section, content in analysis['sections'].items():
#             print(f"  {section.title()}: {len(content)} characters")
    
#     # Extracted entities
#     print("\nEXTRACTED ENTITIES:")
#     for entity_type, entities in analysis['entities'].items():
#         if entities:
#             print(f"  {entity_type.title()}:")
#             for entity in entities:
#                 print(f"    • {entity}")
    
#     # Experience indicators
#     if analysis['experience_indicators']:
#         print("\nEXPERIENCE INDICATORS:")
#         for indicator in analysis['experience_indicators']:
#             print(f"  • {indicator}")
    
#     # Education information
#     if analysis['education_info']:
#         print("\nEDUCATION INFORMATION:")
#         for edu in analysis['education_info']:
#             print(f"  • {edu}")


# def validate_cv_path(cv_path: str):
#     """Validate CV file path exists and is readable"""
#     path = Path(cv_path)
    
#     if not path.exists():
#         raise CVAnalysisError(f"CV file does not exist: {cv_path}")
    
#     if not path.is_file():
#         raise CVAnalysisError(f"Path is not a file: {cv_path}")
    
#     if path.suffix.lower() not in ['.pdf']:
#         raise CVAnalysisError(f"Unsupported file type: {path.suffix}")

# def main(config):
#     # Initialise the CVAnalyser
#     cv_analyser = CVAnalyser()

#     # Validate cv path
#     validate_cv_path(config.cv_path)
    
#     # Better error handling for testing the CVAnalyser class
#     try:
#         print("Extracting text from CV...")
#         cv_text = extract_cv_text(config.cv_path)
        
#         print("Analyzing CV content...")
#         analysis = cv_analyser.analyse_cv_test(cv_text) 

#         # Build comprehensive CV profile
#         weighted_cv_text = balance_cv_weights(analysis)
        
#         # Debug print to see what we're including
#         print(f"CV profile length: {len(weighted_cv_text)} characters")
#         print(f"CV profile preview: {weighted_cv_text[:200]}...")
        
#         # Combine CV profile with job descriptions
#         all_documents = [weighted_cv_text] + jobs
        
#         # Display results
#         if config.show_analysis_results:
#             print_analysis_results(analysis)
        
#         # Save results to JSON for further processing
#         if config.save_analysis_results:
#             with open(config.output_file, 'w') as f:
#                 json.dump(analysis, f, indent=2)
        
#         print("\n" + "=" * 50)
#         print("Analysis complete!")

#         # TF-IDF and Cosine Similarity
#         print("Testing TF-IDF & Cosine Similarity...")
#         test_similarity(all_documents, config.show_tfidf_results)
        
#         print("\nTF-IDF & Cosine Similarity testing complete!")

#     except PDFPassingError as e:
#         print(f"PDF Error: {e}")
#         print("Please check that the file exists and is a valid PDF.")
#         return False
        
#     except SpacyModelError as e:
#         print(f"spaCy Model Error: {e}")
#         return False
        
#     except InsufficientDataError as e:
#         print(f"Data Error: {e}")
#         print("Please provide a CV with more content.")
#         return False
        
#     except TFIDFCalculationError as e:
#         print(f"Analysis Error: {e}")
#         return False
        
#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         raise  # Re-raise for debugging

# if __name__ == "__main__":
#     # Configure the application
#     config = AppConfig(
#         cv_path=r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf',
#         show_tfidf_results=True,
#         show_analysis_results=True,
#         save_analysis_results=True
#     )   

#     # Run the application with desired config
#     main(config)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from pydantic import BaseModel
from typing import Dict, List
from ml.balance_cv_weight import balance_cv_weights

from ml.tfidf import TFIDFFromScratch, calculate_similarity_results
from ml.cv_parser import extract_cv_text
from ml.cv_analysis import CVAnalyser
from ml.exceptions import CVAnalysisError, PDFPassingError, InsufficientDataError

app = FastAPI(
    title="Career Co-Pilot CV Analysis API",
    description="ML-powered CV analysis service",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
        "https://your-production-domain.com"  # Update with your domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize CV analyser (singleton pattern)
cv_analyser = CVAnalyser()
tfidf = TFIDFFromScratch()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Career Co-Pilot CV Analysis API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test if spaCy model is loaded
        test_doc = cv_analyser.nlp("test")
        return {
            "status": "healthy",
            "spacy_model": "loaded",
            "model_name": "en_core_web_sm"
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )

@app.post("/api/cv/analyze")
async def analyze_cv(file: UploadFile = File(...)):
    """
    Analyze a CV file and return structured analysis results.
    
    Args:
        file: PDF file of the CV
        
    Returns:
        JSON object containing:
        - contact_info: Email, phone, LinkedIn, GitHub
        - sections: Objective, education, experience, skills, projects
        - skills: Categorized technical skills
        - entities: Names, organizations, dates, locations
        - experience_indicators: Work experience phrases
        - education_info: Degrees and qualifications
    """
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported. Please upload a PDF CV."
        )
    
    # Validate file size (10MB max)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 10MB."
        )
    
    # Create temporary file to store uploaded PDF
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Write uploaded file to temp location
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Extract text from PDF
            cv_text = extract_cv_text(temp_file_path)
            
            # Analyze CV
            analysis_results = cv_analyser.analyse_cv_test(cv_text)
            
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "data": analysis_results,
                    "metadata": {
                        "filename": file.filename,
                        "file_size": len(content),
                        "text_length": len(cv_text)
                    }
                }
            )
            
        except PDFPassingError as e:
            raise HTTPException(
                status_code=400,
                detail=f"PDF processing error: {str(e)}"
            )
        except InsufficientDataError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient CV data: {str(e)}"
            )
        except CVAnalysisError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Analysis error: {str(e)}"
            )
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error processing CV: {str(e)}"
        )

"""
Request + response + JobMatchResult classes for /match-job endpoint so the FastAPI
endpoint knows what the request and response should look like
"""
class MatchJobRequest(BaseModel):
    cv_analysis: Dict
    job_descriptions: List[str]

class JobMatchResult(BaseModel):
    job_index: int
    similarity: float
    match_quality: str

class MatchJobResponse(BaseModel):
    success: bool
    results: List[JobMatchResult]

@app.post("/api/match-job")
async def generate_similarity(request: MatchJobRequest):
    """
    Match job endpoint for users who have analysed their CV to get
    cosine similarity results to each role based on TF-IDF class built from scratch
    to better understand the underlying logic (although I am very aware vectorisation using
    numpy would have been much faster!)
    """
    try:
        if not request.job_descriptions:
            raise HTTPException(
                    status_code=400,
                    detail="No job descriptions were provided in the request"
                    )

        if not request.cv_analysis:
            raise HTTPException(
                    status_code=400,
                    detail="No CV analysis provided in the request"
                    )

        weighted_cv_text = balance_cv_weights(request.cv_analysis)

        all_documents = [weighted_cv_text] + request.job_descriptions

        results, vocabulary, tfidf_matrix = calculate_similarity_results(all_documents)

        job_results = [
            JobMatchResult(
                job_index=result.job_index,
                similarity=float(result.similarity),
                match_quality=result.match_quality
                ) for result in results
        ]

        return MatchJobResponse(
                success=True,
                results=job_results
                )

    except Exception as e:
        raise HTTPException(
                status_code=500,
                detail=f"Error calcualting similarity results: {str(e)}"
                )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
