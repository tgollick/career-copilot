import numpy as np
import math 
from collections import Counter
import re
from ml.cosine_similarity import calculate_cosine_similarity

class TFIDFFromScratch:
    """
    TF-IDF implementation from scratch to understand the mathematics behind text similarity.
    Defaults to smart preprocessing optimised for CV and job description matching.
    """

    def __init__(self):
        # Initialise variables to store vocabulary, IDF values and processed documents
        self.vocabulary = []
        self.idf_values = {}
        self.documents = []
        self.results = []

        # Technical skills vocabulary for focused preprocessing
        self.technical_skills = {
            'python', 'javascript', 'typescript', 'java', 'react', 'node', 'nodejs',
            'express', 'nextjs', 'next', 'redux', 'vue', 'angular', 'go', 'rust',
            'pandas', 'numpy', 'scikit', 'learn', 'tensorflow', 'pytorch',
            'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
            'aws', 'azure', 'git', 'github', 'spring', 'django', 'flask',
            'microservices', 'api', 'rest', 'graphql', 'css', 'html', 'bootstrap',
            'tailwind', 'vercel', 'netlify', 'firebase', 'c', 'cpp', 'csharp'
        }
        
        # Job-related terms (relevant in context of job descriptions)
        self.job_terms = {
            'developer', 'engineer', 'scientist', 'analyst', 'manager',
            'senior', 'junior', 'lead', 'full', 'stack', 'frontend', 'backend',
            'fullstack', 'web', 'mobile', 'data', 'machine', 'learning',
            'artificial', 'intelligence', 'software', 'computer', 'science'
        }
        
        # Stop words to ignore completely
        self.stop_words = {
            'experience', 'years', 'required', 'preferred', 'knowledge',
            'skills', 'looking', 'needed', 'position', 'role', 'company',
            'team', 'work', 'working', 'must', 'have', 'essential', 
            'technologies', 'startup', 'environment', 'modern', 'development'
        }

    def preprocess_text(self, text: str):
        """
        Smart preprocessing focused on technical relevance.
        Normalises skill variations and filters to relevant terms only.
        """
        # Convert to lowercase and extract words
        text = text.lower()
        words = re.findall(r'\b[a-zA-Z]+\b', text)
        
        # Normalise common variations
        normalised_words = []
        for word in words:
            # Handle specific normalisations
            if word in ['js']:
                normalised_words.append('javascript')
            elif word in ['nodejs', 'node']:
                normalised_words.append('nodejs')
            elif word in ['nextjs', 'next']:
                normalised_words.append('nextjs')
            elif word in ['scikit']:
                normalised_words.append('scikit')
            elif word == 'learn' and any('scikit' in w for w in words):
                normalised_words.append('scikit')  # Handle scikit-learn
            elif word == 'c++':
                normalised_words.append('cpp')
            elif word == 'c#':
                normalised_words.append('csharp')
            else:
                normalised_words.append(word)
        
        # Filter to keep only relevant terms
        filtered_words = []
        for word in normalised_words:
            if word in self.technical_skills:
                # Technical skills get double weight for emphasis
                filtered_words.extend([word] * 2)
            elif word in self.job_terms:
                # Job terms get normal weight
                filtered_words.append(word)
            # Stop words are ignored entirely
        
        return filtered_words

    def calculate_tf(self, document_words):
        """
        Calculate Term Frequency for each word in the document.
        TF(word) = (Number of times word appears in document) / (Total words in document)
        """
        total_words = len(document_words)
        word_counts = Counter(document_words)

        # Calculate term frequency for each word
        tf_dict = {}
        for word, count in word_counts.items():
            tf_dict[word] = count / total_words

        return tf_dict

    def calculate_idf(self, documents):
        """
        Calculate Inverse Document Frequency for each word across all documents.
        IDF(word) = log(Total documents / Documents containing word)
        """
        total_docs = len(documents)
        all_words = set()

        # Get all unique words from all documents
        for doc in documents:
            all_words.update(doc)

        # Calculate IDF for each word
        idf_dict = {}
        for word in all_words:
            containing_docs = sum(1 for doc in documents if word in doc)
            idf_dict[word] = math.log(total_docs / containing_docs)

        return idf_dict

    def calculate_tfidf(self, documents_text):
        """
        Calculate TF-IDF vectors for all documents using smart preprocessing.
        Returns numpy array of TF-IDF vectors.
        """
        # Preprocess all documents
        documents = [self.preprocess_text(doc) for doc in documents_text]
        self.documents = documents

        # Calculate IDF values across all documents
        self.idf_values = self.calculate_idf(documents)
        
        # Build vocabulary from all unique words
        self.vocabulary = list(self.idf_values.keys())

        # Calculate TF-IDF vectors for each document
        tfidf_vectors = []
        for doc in documents:
            # Calculate term frequencies for this document
            tf_dict = self.calculate_tf(doc)

            # Create TF-IDF vector for this document
            tfidf_vector = []
            for word in self.vocabulary:
                tf = tf_dict.get(word, 0)
                idf = self.idf_values.get(word, 0)
                tfidf_score = tf * idf
                tfidf_vector.append(tfidf_score)

            tfidf_vectors.append(tfidf_vector)

        return np.array(tfidf_vectors)

    def display_analysis(self, documents_text):
        """
        Display detailed analysis of TF-IDF calculation results.
        """
        print("TF-IDF ANALYSIS (SMART PREPROCESSING)")
        print("=" * 50)

        # Calculate TF-IDF matrix
        tfidf_matrix = self.calculate_tfidf(documents_text)

        print(f"Vocabulary size: {len(self.vocabulary)}")
        print(f"Number of documents: {len(self.documents)}")
        print(f"Technical vocabulary: {sorted(self.vocabulary)}")

        # Show most distinctive words (highest IDF values)
        print(f"\nMost distinctive words (highest IDF):")
        sorted_idf = sorted(self.idf_values.items(), key=lambda x: x[1], reverse=True)
        for word, idf in sorted_idf[:10]:
            print(f"  {word}: IDF = {idf:.3f}")

        # Show top TF-IDF terms for each document
        for i, (doc_text, tfidf_vector) in enumerate(zip(documents_text, tfidf_matrix)):
            print(f"\nDocument {i+1}: '{doc_text[:50]}...'")
            
            # Get top TF-IDF terms for this document
            word_scores = list(zip(self.vocabulary, tfidf_vector))
            top_terms = sorted(word_scores, key=lambda x: x[1], reverse=True)[:5]
            
            print(f"  Top TF-IDF terms:")
            for word, score in top_terms:
                if score > 0:
                    print(f"    {word}: {score:.3f}")
        
        return tfidf_matrix

def get_similarity_description(cosine_similarity):
    """
    Convert similarity score to human-readable description.
    Thresholds calibrated for comprehensive CV profiles with smart preprocessing.
    """
    if cosine_similarity >= 0.55:
        return "Excellent Match"
    elif cosine_similarity >= 0.35:
        return "Strong Match"
    elif cosine_similarity >= 0.25:
        return "Good Match"
    elif cosine_similarity >= 0.15:
        return "Moderate Match"
    elif cosine_similarity >= 0.08:
        return "Weak Match"
    else:
        return "No Match"

def test_similarity(all_documents, print_results=False):
    """
    Test CV similarity against job descriptions using TF-IDF and cosine similarity.
    """
    
    # Calculate TF-IDF using our implementation
    tfidf = TFIDFFromScratch()
    tfidf_matrix = tfidf.calculate_tfidf(all_documents)
    
    # Extract job descriptions (all except first document which is CV)
    job_descriptions = all_documents[1:]
    
    results = []

    if print_results:
        print(f"\nCV SIMILARITY TESTING")
        print("=" * 50)
        print(f"Focused vocabulary size: {len(tfidf.vocabulary)}")
        print(f"Technical terms: {sorted(tfidf.vocabulary)}")
        print(f"\nCV Matching Results:")

    # Calculate similarity between CV and each job
    for i, job in enumerate(job_descriptions, 1):
        similarity = calculate_cosine_similarity(tfidf_matrix[0], tfidf_matrix[i])

        # Store results
        result = {
            'job_index': i,
            'similarity': similarity,
            'description': job,
            'match_quality': get_similarity_description(similarity)
        }
        results.append(result)

        if print_results:
            print(f"\nJob {i}: {get_similarity_description(similarity)}")
            print(f"   Similarity: {similarity:.4f} ({similarity*100:.1f}%)")
            print(f"   Description: {job}")

            # Show top matching terms
            cv_vector = tfidf_matrix[0]
            job_vector = tfidf_matrix[i]
            contributions = cv_vector * job_vector

            word_contributions = list(zip(tfidf.vocabulary, contributions))
            top_matches = sorted(word_contributions, key=lambda x: x[1], reverse=True)[:3]

            print(f"   Top matching terms:")
            for word, contribution in top_matches:
                if contribution > 0:
                    print(f"     • {word}: {contribution:.4f}")
    
    return results