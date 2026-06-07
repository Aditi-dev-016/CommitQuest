"""Google Gemini API client wrapper."""
import google.generativeai as genai
from app.config import settings

_model = None


def get_model():
    global _model
    if _model is None:
        genai.configure(api_key=settings.gemini_api_key)
        _model = genai.GenerativeModel("gemini-1.5-flash")
    return _model


async def generate_text(prompt: str) -> str:
    """Generate text with Gemini. Returns the response text."""
    model = get_model()
    response = await model.generate_content_async(prompt)
    return response.text


async def analyze_repository(repo_data: dict, issues: list[dict]) -> dict:
    """Generate a structured repository analysis."""
    prompt = f"""
You are an expert open-source contribution advisor. Analyze this GitHub repository and provide
a structured assessment for beginner contributors.

Repository: {repo_data.get('full_name')}
Description: {repo_data.get('description', 'No description')}
Language: {repo_data.get('language')}
Stars: {repo_data.get('stargazers_count')}
Open Issues: {repo_data.get('open_issues_count')}
Sample issues: {[i.get('title') for i in issues[:10]]}

Return a JSON object with:
- summary_text: 2-3 sentence plain English summary
- documentation_score: 0-100 estimated documentation quality
- complexity_score: 0-100 code complexity (higher = more complex)
- setup_difficulty_score: 0-100 setup difficulty (higher = harder)
- community_score: 0-100 community activity

Respond ONLY with valid JSON.
"""
    import json
    text = await generate_text(prompt)
    # Strip markdown code fences if present
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "summary_text": "Analysis unavailable.",
            "documentation_score": 50,
            "complexity_score": 50,
            "setup_difficulty_score": 50,
            "community_score": 50,
        }


async def explain_issue(issue_title: str, issue_body: str, repo_name: str) -> dict:
    """Generate a plain-English explanation of a GitHub issue."""
    prompt = f"""
You are a helpful mentor for beginner open-source contributors.

Repository: {repo_name}
Issue: {issue_title}
Description: {issue_body[:2000] if issue_body else 'No description'}

Explain this issue clearly for a developer new to this codebase. Return JSON with:
- plain_english: 2-4 sentence plain English explanation of the problem
- files_involved: list of likely file paths (guess based on context, max 5)
- skills_needed: list of skill tags (e.g. ["TypeScript", "React hooks"])
- suggested_steps: numbered steps as a single string

Respond ONLY with valid JSON.
"""
    import json
    text = await generate_text(prompt)
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "plain_english": issue_body or issue_title,
            "files_involved": [],
            "skills_needed": [],
            "suggested_steps": "1. Read the issue carefully.\n2. Explore the codebase.\n3. Submit a fix.",
        }
