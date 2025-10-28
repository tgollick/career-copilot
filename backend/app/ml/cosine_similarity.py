import numpy as np


def calculate_cosine_similarity(vec1, vec2, show_calculation=False): 
    """
    Contains the code to calculate the 
    cosine similarity between two vectors (CV & job) 
    """

    # Calculate dot product of the two vectors
    dot_product = np.dot(vec1, vec2)

    # Calculate magnitudes of both vectors
    magnitude_vec1 = np.sqrt(np.sum(vec1 ** 2))
    magnitude_vec2 = np.sqrt(np.sum(vec2 ** 2))

    # Return 0 if either vector has zero magnitude
    if magnitude_vec1 == 0 or magnitude_vec2 == 0:
        return 0
    
    # Calculate cosine similarity
    cosine_similarity = dot_product / (magnitude_vec1 * magnitude_vec2)

    # Optionally display calculation details
    if show_calculation:
        print("Cosine similarity calculation:")
        print(f"   Dot product: {dot_product:.3f}")
        print(f"   Magnitude of vec1: {magnitude_vec1:.3f}")
        print(f"   Magnitude of vec2: {magnitude_vec2:.3f}")
        print(f"   Cosine similarity: {cosine_similarity:.3f}")

    return cosine_similarity

def get_similarity_description(cosine_similarity):
    """
    Convert similarity score to human-readable description.
    Thresholds calibrated for comprehensive CV profiles with smart preprocessing.
    """
    if cosine_similarity >= 0.50:
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

