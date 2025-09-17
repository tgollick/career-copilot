# This file contains the exceptions for the CV analysis module for more explicit error handling

class CVAnalysisError(Exception):
    """Base class for all CV analysis errors"""
    pass

class PDFPassingError(CVAnalysisError):
    """Error when a PDF file is not passed correctly"""
    pass

class SpacyModelError(CVAnalysisError):
    """Error when the spacy model is not loaded correctly"""
    pass

class InsufficientDataError(CVAnalysisError):
    """Error when there is insufficient data to perform an analysis"""
    pass

class TFIDFCalculationError(CVAnalysisError):
    """Error when the TFIDF calculation fails"""
    pass