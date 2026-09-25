"""
MenstruAI Retrieval-Augmented Generation (RAG) Architecture (Phase 2)
=====================================================================

Pipeline:
User Question
      ↓
Query Processing & Intent Validation
      ↓
Semantic Text Embedding (e.g. text-embedding-3 / BGE-small)
      ↓
Vector Similarity Search (ChromaDB / Qdrant / FAISS)
      ↓
Verified Knowledge Base Chunks (ACOG, WHO, NHS, PubMed guidelines)
      ↓
Context Injection & Grounding Prompting
      ↓
Large Language Model (LLM Inference)
      ↓
Safety Validation & Hallucination Check
      ↓
Educational, Non-Diagnostic Response
"""

from typing import List, Dict, Any


class RAGPipelineInterface:
    """
    Interface definition for MenstruAI Knowledge-Grounded RAG Pipeline.
    """

    def __init__(self, vector_store_uri: str = "sqlite:///./chroma_menstruai"):
        self.vector_store_uri = vector_store_uri
        self.is_initialized = False

    def retrieve_relevant_contexts(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Phase 2: Will query vector database using cosine similarity on verified documents.
        """
        return []

    def format_grounded_prompt(self, query: str, contexts: List[Dict[str, Any]]) -> str:
        """
        Phase 2: Injects retrieved contexts into system prompt with strict non-diagnostic boundary instructions.
        """
        return f"Educational query context for: {query}"
