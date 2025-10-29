import numpy as np
import math 
from collections import Counter
import re
from .config import job_terms, all_technical_skills, experience_indicators
from .exceptions import TFIDFCalculationError, InsufficientDataError

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
            if word in all_technical_skills:
                filtered_words.append(word * 3)
            elif word in experience_indicators:
                filtered_words.append(word * 2)
            elif word in job_terms:
                filtered_words.append(word)
        
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

        # Check if documents_text is empty 
        if not documents_text:
            raise TFIDFCalculationError("No documents provided for anaylsis")

        try:
            # Preprocess all documents
            documents = [self.preprocess_text(doc) for doc in documents_text]

            # Remove empty documents after preprocessing
            non_empty_docs = [doc for doc in documents if doc]

            # Raise error if there is missing information after preprocessing
            if len(non_empty_docs) < len(documents):
                raise InsufficientDataError(
                    f"Only {len(non_empty_docs)}/{len(documents)} documents contained relevant information for analysis"
                )

            self.documents = documents

            # Calculate IDF values across all documents
            self.idf_values = self.calculate_idf(documents)

            # Raise error if no vocabulary found after IDF calculation
            if not self.idf_values:
                raise TFIDFCalculationError("No vocabulary found after IDF calculation")
            
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
        
        except Exception as e:
            if isinstance(e, (TFIDFCalculationError, InsufficientDataError)):
                raise
            raise TFIDFCalculationError(f"Error calculating TF-IDF: {str(e)}")   

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
        print("\nMost distinctive words (highest IDF):")
        sorted_idf = sorted(self.idf_values.items(), key=lambda x: x[1], reverse=True)
        for word, idf in sorted_idf[:10]:
            print(f"  {word}: IDF = {idf:.3f}")

        # Show top TF-IDF terms for each document
        for i, (doc_text, tfidf_vector) in enumerate(zip(documents_text, tfidf_matrix)):
            print(f"\nDocument {i+1}: '{doc_text[:50]}...'")
            
            # Get top TF-IDF terms for this document
            word_scores = list(zip(self.vocabulary, tfidf_vector))
            top_terms = sorted(word_scores, key=lambda x: x[1], reverse=True)[:5]
            
            print("  Top TF-IDF terms:")
            for word, score in top_terms:
                if score > 0:
                    print(f"    {word}: {score:.3f}")
        
        return tfidf_matrix
