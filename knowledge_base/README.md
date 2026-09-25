# MenstruAI Verified Knowledge Base & RAG Architecture

This directory houses curated, peer-reviewed clinical guidelines, public health references, and structured FAQs that ground the upcoming **MenstruAI Phase 2 Retrieval-Augmented Generation (RAG) assistant**.

---

## 1. Planned RAG Flow

```text
User Question
      ↓
Query Processing & Intent Validation
      ↓
Embedding Generation (e.g. text-embedding-3-small or all-MiniLM-L6-v2)
      ↓
Vector Search (ChromaDB / FAISS / Qdrant)
      ↓
Verified Knowledge Base Chunks (WHO, ACOG, NHS, Mayo Clinic)
      ↓
Relevant Context Injection
      ↓
LLM Synthesis with Non-Diagnostic Guardrails
      ↓
Safety Validation & Fact Check
      ↓
Educational Response + Source Citations
```

---

## 2. Knowledge Ingestion Pipeline (Phase 2 Roadmap)

1. **Document Ingestion:** Cleaned Markdown and PDF guideline documents from health agencies.
2. **Chunking Strategy:** Semantic chunking with 400-token boundaries and 50-token overlap to maintain medical coherence.
3. **Metadata Tagging:** Tagging by clinical category (Cycle Basics, Hygiene, Dysmenorrhea, PMS, Red Flags).
4. **Vector Storage:** Embedded into an indexing engine for sub-millisecond retrieval.
5. **Guardrails:** Automatic detection of high-risk medical terms triggering immediate recommendations to consult a licensed medical professional.

---

## 3. Data Sources

* **ACOG:** American College of Obstetricians and Gynecologists
* **WHO:** World Health Organization Guidance on Menstrual Health and Rights
* **NHS:** National Health Service (UK) Clinical Conditions Guides
* **Mayo Clinic:** Patient Care & Health Information Guidelines
