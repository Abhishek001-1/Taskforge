"""OpenRouter AI service — resume analysis & goal suggestions via NVIDIA Nemotron."""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
TIMEOUT = 120  # seconds — LLM calls can be slow


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.frontend_origin.split(",")[0].strip(),
        "X-Title": "TaskForge AI",
    }


def _extract_json(text: str) -> dict[str, Any]:
    """Extract the first JSON object from LLM output (handles ```json fences)."""
    # Try direct parse first
    text = text.strip()
    if text.startswith("{"):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
    # Try to find JSON in code fences
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    # Last resort — find first { to last }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass
    raise ValueError("Could not parse JSON from AI response")


async def call_openrouter(system_prompt: str, user_prompt: str) -> str:
    """Call OpenRouter chat completions and return the assistant message content."""
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 4096,
    }
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=_headers())
        resp.raise_for_status()
        data = resp.json()
    return data["choices"][0]["message"]["content"]


# ── Resume Analysis ──────────────────────────────────────────────────────────

RESUME_SYSTEM_PROMPT = """You are an expert career analyst and technical recruiter.
Analyze the given resume text and return a JSON object with EXACTLY these keys:

{
  "skills": ["skill1", "skill2", ...],
  "programming_languages": ["lang1", "lang2", ...],
  "frameworks": ["framework1", ...],
  "tools": ["tool1", ...],
  "projects": [{"name": "...", "description": "..."}],
  "experience": [{"role": "...", "company": "...", "duration": "..."}],
  "education": [{"degree": "...", "institution": "...", "year": "..."}],
  "domains": ["domain1", "domain2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["area needing improvement 1", ...],
  "suggestions": ["actionable suggestion 1", ...],
  "career_summary": "A 2-3 sentence career profile summary."
}

Return ONLY the JSON object, no markdown fences, no extra text."""


async def analyze_resume(resume_text: str) -> dict[str, Any]:
    """Analyze resume text and return structured data."""
    raw = await call_openrouter(RESUME_SYSTEM_PROMPT, resume_text)
    return _extract_json(raw)


# ── Goal Suggestions ─────────────────────────────────────────────────────────

SUGGESTIONS_SYSTEM_PROMPT = """You are an AI interview preparation coach.
Based on the user's resume analysis and their recent preparation activity, generate personalized
daily interview preparation goals.

Return a JSON object with EXACTLY this structure:
{
  "suggestions": [
    {
      "title": "Short actionable title",
      "category": "DSA|System Design|Backend|AI/ML|HR|Project|Revision",
      "description": "1-2 sentence description of what to do",
      "estimated_minutes": 30
    }
  ]
}

Rules:
- Generate 5 to 10 suggestions
- Mix categories based on the user's profile (heavy on weak areas)
- estimated_minutes should be realistic (15-90 range)
- Be specific: mention exact topics, algorithms, or concepts
- If the user has been doing DSA heavily, suggest more system design or HR prep
- Return ONLY the JSON object"""


async def generate_suggestions(
    resume_analysis: dict[str, Any],
    tracker_state: dict[str, Any],
) -> list[dict[str, Any]]:
    """Generate personalized goal suggestions based on resume + tracker data."""
    # Build context about recent activity
    days = tracker_state.get("days", {})
    recent_dates = sorted(days.keys(), reverse=True)[:7]
    recent_summary_parts: list[str] = []
    for d in recent_dates:
        day = days[d]
        parts: list[str] = []
        dsa = day.get("dsa", {})
        if dsa.get("solved", 0) > 0:
            parts.append(f"DSA: solved {dsa['solved']}, {dsa.get('difficulty', 'Medium')}")
        if day.get("system", {}).get("read"):
            parts.append(f"System Design: {day['system'].get('title', 'read')}")
        if day.get("ai", {}).get("completed"):
            parts.append(f"AI/ML: {day['ai'].get('topic', 'studied')}")
        if day.get("hr", {}).get("practiced"):
            parts.append("HR: practiced")
        if parts:
            recent_summary_parts.append(f"{d}: {', '.join(parts)}")

    recent_text = "\n".join(recent_summary_parts) if recent_summary_parts else "No recent activity tracked."

    user_prompt = f"""Resume Analysis:
{json.dumps(resume_analysis, indent=2)}

Recent 7-day Activity:
{recent_text}

Generate personalized interview preparation goals for today."""

    raw = await call_openrouter(SUGGESTIONS_SYSTEM_PROMPT, user_prompt)
    parsed = _extract_json(raw)
    return parsed.get("suggestions", [])
