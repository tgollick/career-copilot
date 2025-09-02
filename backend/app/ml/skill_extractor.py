import spacy

# Load pre-trained model (download first: python -m spacy download en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

def analyze_cv_text(text):
    # Process text through spaCy pipeline
    doc = nlp(text)
    
    # Extract different types of information
    results = {
        'entities': [],      # Names, organizations, dates
        'skills': [],        # Technical skills
        'experience_years': None,
        'education': []
    }
    
    # Named Entity Recognition (NER)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            results['entities'].append(("name", ent.text))
        elif ent.label_ == "ORG":
            results['entities'].append(("organization", ent.text))
        elif ent.label_ == "DATE":
            results['entities'].append(("date", ent.text))
    
    # Custom skill extraction
    skill_patterns = ["Python", "JavaScript", "React", "Node.js", "SQL", "AWS"]
    for token in doc:
        if token.text in skill_patterns and results['skills'].count(token.text) == 0:
            results['skills'].append(token.text)
    
    return results