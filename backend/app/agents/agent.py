
from dotenv import load_dotenv
import os
from smolagents import tool
from typing import Optional

load_dotenv('.env')
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY") or ""

class ExamMetadata:
    def __init__(self, year: Optional[int] = None, season: Optional[str] = None, 
                 problem: Optional[int] = None, part: Optional[int] = None):
        self.year = year
        self.season = season
        self.problem = problem
        self.part = part

def validate_metadata(metadata: ExamMetadata) -> Optional[str]:
    """
    Validate exam metadata and return error message in Norwegian if invalid
    """
    if metadata.season is not None and metadata.season not in ["Vår", "Høst"]:
        return "Sesong må være enten 'Vår' eller 'Høst'."
    
    if metadata.part is not None and metadata.part not in [1, 2]:
        return "Del må være enten 1 eller 2."
    
    return None

def create_description_embedding(description: str) -> list:
    """
    Placeholder function for creating embeddings from description
    """
    # This would normally use an embedding model like OpenAI's text-embedding-ada-002
    # or a local embedding model
    return [0.1, 0.2, 0.3]  # Placeholder embedding

def query_supabase_exam_problems(description_embedding: list, metadata: ExamMetadata) -> str:
    """
    Placeholder function for querying Supabase with embeddings and metadata filters
    """
    # This would normally:
    # 1. Use the embedding for similarity search
    # 2. Apply metadata filters to the SQL query
    # 3. Return relevant exam problems
    
    filters = []
    if metadata.year:
        filters.append(f"year = {metadata.year}")
    if metadata.season:
        filters.append(f"season = '{metadata.season}'")
    if metadata.problem:
        filters.append(f"problem_number = {metadata.problem}")
    if metadata.part:
        filters.append(f"part = {metadata.part}")
    
    # Placeholder SQL query construction
    base_query = "SELECT * FROM exam_problems WHERE similarity(embedding, $1) > 0.8"
    if filters:
        base_query += " AND " + " AND ".join(filters)
    
    # Placeholder return
    return f"Found relevant exam problems with filters: {', '.join(filters) if filters else 'none'}"

@tool
def fetch_examproblem_description(
    description: str, 
    metadata: dict
) -> str:
    """
    This is a tool that returns the most relevant exam problems based 
    on a description and some exam metadata, exam metadata is optional and can be left empty 
    if no metadata is used in query

    Args:
        description: The description of the problem or topic to search for
        metadata: Dictionary containing exam metadata with optional keys:
                 - year: Any year (int)
                 - season: "Vår" or "Høst" (case sensetive) (str)
                 - problem: Any problem number (int) 
                 - part: 1 or 2 (int)
    """
    try:
        # Create ExamMetadata object from dictionary
        exam_metadata = ExamMetadata(
            year=metadata.get('year'),
            season=metadata.get('season'),
            problem=metadata.get('problem'),
            part=metadata.get('part')
        )
        
        # Validate metadata
        error_message = validate_metadata(exam_metadata)
        if error_message:
            return error_message
        
        # Create embedding from description
        description_embedding = create_description_embedding(description)
        
        # Query Supabase for relevant exam problems
        result = query_supabase_exam_problems(description_embedding, exam_metadata)
        
        return result
        
    except Exception as e:
        return f"En feil oppstod under søket med fetch_examproblem_description: {str(e)}"



