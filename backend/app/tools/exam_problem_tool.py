
# ───────────────────────────── app/tools/exam_problem_tool.py ─────────────────────────────
"""
Custom SmolAgents tool for fetching exam problems from Supabase.

Import path inside the application:
    from app.tools.exam_problem_tool import fetch_examproblem_description
"""

from typing import Optional

from dotenv import load_dotenv
import os

from smolagents import tool

# Load environment (only needed if you later decide to add an embedding model that
# requires OPENAI_API_KEY)
load_dotenv(".env")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY") or ""  # noqa: S105

# ───────────────────────────── helper classes & fns ─────────────────────────────
class ExamMetadata:
    def __init__(
        self,
        year: Optional[int] = None,
        season: Optional[str] = None,
        problem: Optional[int] = None,
        part: Optional[int] = None,
    ):
        self.year = year
        self.season = season
        self.problem = problem
        self.part = part


def validate_metadata(metadata: ExamMetadata) -> Optional[str]:
    """
    Validate exam metadata and return an error message in Norwegian if invalid.
    """
    if metadata.season is not None and metadata.season not in ["Vår", "Høst"]:
        return "Sesong må være enten 'Vår' eller 'Høst'."

    if metadata.part is not None and metadata.part not in [1, 2]:
        return "Del må være enten 1 eller 2."

    return None


def create_description_embedding(description: str) -> list[float]:
    """
    Placeholder - return a fake embedding for the given description.
    Replace with your real embedding call if / when you add one.
    """
    return [0.1, 0.2, 0.3]


def query_supabase_exam_problems(
    description_embedding: list[float], metadata: ExamMetadata
) -> str:
    """
    Placeholder Supabase query – replace with real SQL / RPC call.
    """
    filters: list[str] = []
    if metadata.year:
        filters.append(f"year = {metadata.year}")
    if metadata.season:
        filters.append(f"season = '{metadata.season}'")
    if metadata.problem:
        filters.append(f"problem_number = {metadata.problem}")
    if metadata.part:
        filters.append(f"part = {metadata.part}")

    base_query = "SELECT * FROM exam_problems WHERE similarity(embedding, $1) > 0.8"
    if filters:
        base_query += " AND " + " AND ".join(filters)

    # Demo output
    return (
        "Found relevant exam problems"
        f"{' with filters: ' + ', '.join(filters) if filters else ''}"
    )


# ──────────────────────────────────── TOOL ────────────────────────────────────
@tool
def fetch_examproblem_description(description: str, metadata: dict) -> str:
    """
    Finn relevante eksamensoppgaver basert på en beskrivelse.

    Args:
        description:    Beskrivelse av temaet du vil søke etter.
        metadata:       (Frivillig) Ordbok med ekstra filtrering:
                        • year (int)   – Årstall
                        • season (str) – 'Vår' eller 'Høst'
                        • problem (int)– Oppgavenummer
                        • part (int)   – Del 1 eller 2
    """
    try:
        exam_metadata = ExamMetadata(
            year=metadata.get("year"),
            season=metadata.get("season"),
            problem=metadata.get("problem"),
            part=metadata.get("part"),
        )

        if (msg := validate_metadata(exam_metadata)) is not None:
            return msg

        embedding = create_description_embedding(description)
        result = query_supabase_exam_problems(embedding, exam_metadata)
        return result

    except Exception as exc:  # noqa: BLE001
        return f"En feil oppstod under søket med fetch_examproblem_description: {exc}"
