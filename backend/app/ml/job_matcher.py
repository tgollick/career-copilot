from .cosine_similarity import calculate_cosine_similarity, get_similarity_description
from .tfidf import TFIDFFromScratch
from .job_match_result import JobMatchResult

def display_similarity_results(results, tfidf_vocabulary, tfidf_matrix):
    # Display TF-IDF analysis
    print("\nCV SIMILARITY TESTING")
    print("=" * 50)
    print(f"Focused vocabulary size: {len(tfidf_vocabulary)}")
    print(f"Technical terms: {sorted(tfidf_vocabulary)}")
    print("\nCV Matching Results:")

    # Display results
    for result in results:
        print(f"Job {result.job_index}: {result.match_quality}")
        print(f"   Similarity: {result.similarity:.4f} ({result.similarity*100:.1f}%)")
        print(f"   Description: {result.description}")

        # Show top matching terms
        cv_vector = tfidf_matrix[0]
        job_vector = tfidf_matrix[result.job_index]
        contributions = cv_vector * job_vector

        word_contributions = list(zip(tfidf_vocabulary, contributions))
        top_matches = sorted(word_contributions, key=lambda x: x[1], reverse=True)[:3]

        print("   Top matching terms:")
        for word, contribution in top_matches:
            if contribution > 0:
                print(f"     • {word}: {contribution:.4f}")

def calculate_similarity_results(all_documents):
    """
    Calculate TF-IDF and cosine similarities using from-scratch implementation.
    Optionally uses threading for concurrent similarity calculations.
    """

    tfidf = TFIDFFromScratch()
    tfidf_matrix = tfidf.calculate_tfidf(all_documents)
    
    cv_vector = tfidf_matrix[0]
    job_descriptions = all_documents[1:]
    
    # For small batches, sequential is fine
    if len(job_descriptions) < 20:
        results = _calculate_sequential(cv_vector, tfidf_matrix, job_descriptions)
    else:
        # For larger batches, use threading  
        results = _calculate_parallel(cv_vector, tfidf_matrix, job_descriptions)
    
    return results, tfidf.vocabulary, tfidf_matrix


def _calculate_sequential(cv_vector, tfidf_matrix, job_descriptions):
    """
    Sequential calculation for smaller job batches, not worth the overhead
    """
    results = []

    for i, job in enumerate(job_descriptions, 1):
        similarity = calculate_cosine_similarity(cv_vector, tfidf_matrix[i])
        match_quality = get_similarity_description(similarity)
        results.append(JobMatchResult(i, similarity, job, match_quality))

    return results


def _calculate_parallel(cv_vector, tfidf_matrix, job_descriptions, max_workers=4):
    """
    Parallel calculation using ThreadPoolExecutor.
    Still uses from-scratch cosine_similarity function, just runs multiple at once.
    """

    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    results = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit jobs to thread pool 
        future_to_index = {
            executor.submit(calculate_cosine_similarity, cv_vector, tfidf_matrix[i+1]): (i+1, job_descriptions[i])
            for i in range(len(job_descriptions))
        }
        
        # Collect results
        for future in as_completed(future_to_index):
            job_index, job_desc = future_to_index[future]
            similarity = future.result()
            match_quality = get_similarity_description(similarity)
            results.append(JobMatchResult(job_index, similarity, job_desc, match_quality))
    
    # Maintain order, important for Next.JS route
    results.sort(key=lambda x: x.job_index)

    return results

def test_similarity(all_documents, print_results=False):
    """
    Test CV similarity against job descriptions using TF-IDF and cosine similarity.
    """
    
    results, tfidf_vocabulary, tfidf_matrix = calculate_similarity_results(all_documents)
    
    if print_results:
        display_similarity_results(results, tfidf_vocabulary, tfidf_matrix)
    
    return results
