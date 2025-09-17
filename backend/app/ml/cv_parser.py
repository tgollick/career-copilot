import pdfplumber
from .exceptions import PDFPassingError, InsufficientDataError

# Extracting the text out of the pdf to analyse later in the pipeline
def extract_cv_text(pdf_path: str):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Check if the PDF is empty
            if not pdf.pages:
                raise PDFPassingError(f"CV appears to be empty: {pdf_path}")

            text = ""

            for page in pdf.pages:
                page_text = page.extract_text()
                # Check if the page is empty
                if not page_text:
                    raise PDFPassingError(f"No text found on page: {pdf_path}")
                
                text += (page_text + "\n")

            # Check if the CV contains enough data
            if len(text) < 100:
                raise InsufficientDataError(f"CV doesnt contain enough data: {pdf_path}")
            
            return text
    except FileNotFoundError:
        raise PDFPassingError(f"CV File not found: {pdf_path}")
    except Exception as e:
        raise PDFPassingError(f"Error extracting text from PDF: {e}")
