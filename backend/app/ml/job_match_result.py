# JobMatchResult class to store job match results (more pythonic)

class JobMatchResult:
    def __init__(self, job_index, similarity, description, match_quality):
        self.job_index = job_index
        self.similarity = similarity
        self.description = description
        self.match_quality = match_quality
    
    def __str__(self):
        return f"{self.match_quality}: {self.description[:50]}..."
    
    def __repr__(self):
        return f"JobMatchResult({self.job_index}, {self.similarity:.3f}, '{self.match_quality}')"
    
    def __lt__(self, other):
        return self.similarity < other.similarity