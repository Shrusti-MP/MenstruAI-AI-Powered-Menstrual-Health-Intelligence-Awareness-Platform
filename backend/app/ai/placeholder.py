"""
MenstruAI AI Assistant Architecture Specification (Phase 2)
===========================================================
This module defines the architectural interfaces and contracts for the upcoming
privacy-preserving MenstruAI intelligent health assistant.

Design Principles:
1. Grounded Generation: Responses must be synthesized strictly from verified medical
   and educational clinical knowledge bases.
2. Safety Guardrails: All queries and prompts pass through non-diagnostic intent
   classification, medical emergency triage, and red-flag symptom detectors.
3. Privacy Preservation: Zero user tracking record identifiers or personally
   identifiable health information (PHI) are transmitted to external LLM providers.
"""

from typing import Dict, Any, List


class AIAssistantInterface:
    """
    Abstract interface for MenstruAI conversational assistant planned for Phase 2.
    """

    async def generate_educational_response(
        self,
        user_query: str,
        chat_history: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        """
        Placeholder method for Phase 2.
        Will integrate RAG pipeline with safety filters.
        """
        raise NotImplementedError(
            "MenstruAI Assistant is scheduled for implementation in Phase 2 with full RAG."
        )


class RedFlagSafetyFilter:
    """
    Safety filter module for recognizing medical emergencies, acute pain, or
    situations requiring urgent medical intervention.
    """

    CRITICAL_KEYWORDS = [
        "severe bleeding", "unconscious", "fainting", "high fever", "sudden intense pain",
        "toxic shock", "emergency", "suicide", "depression crisis"
    ]

    @classmethod
    def evaluate_emergency(cls, query: str) -> bool:
        lower_q = query.lower()
        return any(keyword in lower_q for keyword in cls.CRITICAL_KEYWORDS)
