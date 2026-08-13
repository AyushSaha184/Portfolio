---
title: "System Architecture & Engineering Paradigms"
category: "Skills & Architecture"
targetSection: "#skills"
---

# System Architecture & Technical Paradigms

## RAG & Vector Retrieval Systems
- **Hybrid Dense + Sparse Search**: Fuses FAISS vector embeddings (semantic match) with BM25 (exact keyword match) via Reciprocal Rank Fusion (RRF).
- **Reranking**: Integrates NVIDIA `nv-rerank-qa-mistral-4b:1` for precision top-K re-ordering.
- **Chunking Strategies**: Extension-aware chunking (semantic, DOM-aware for HTML, AST code-structure for Python/JS/Go, row-group for CSV).
- **Caching Architecture**: Provider-side KV prompt caching, Redis retrieval/LLM response caching, and SQLite human-approved answer cache.

## Agentic AI & Microservices
- **Multi-Agent Orchestration**: LangGraph state graphs, parallel specialist reviews (Security, Code Quality, Tests, Docs), stateful query routing, and hallucination validator agents.
- **Model Context Protocol (MCP)**: Native Go and Python MCP servers (`Eval_MCP`) with stdio and REST stdio integration.
- **AST Parsing & Code Analysis**: Python AST parsers with canonical hashing for test generation and syntax auto-correction.
