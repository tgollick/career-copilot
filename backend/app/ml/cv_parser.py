import pdfplumber

# Extracting the text out of the pdf to analyse later in the pipeline
def extract_cv_text(pdf_path: str):
    text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += (page.extract_text() + "\n")

    return text
