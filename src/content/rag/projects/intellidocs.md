---
title: "IntelliDocs - Enterprise RAG Knowledge System"
tag: "Enterprise RAG Knowledge System"
repo: "IntelliDocs"
year: "2025"
demoUrl: "https://intelli-docs-five.vercel.app"
githubUrl: "https://github.com/AyushSaha184/IntelliDocs"
targetSection: "#projects"
---

# IntelliDocs: Enterprise-Scale Multi-Agent RAG System

## Overview
IntelliDocs is an enterprise-grade Retrieval-Augmented Generation (RAG) knowledge engine that turns document repositories into interactive knowledge bases. It features a Multi-Agent Orchestration Pipeline, Low-Latency SSE Streaming, and Hybrid Vector + Keyword Search.

## Architectural Highlights
- **Multi-Agent Orchestration**:
  - `QueryPlanner`: Classifies queries into 6 types (`trivial`, `factual`, `summarization`, `analytical`, `comparative`, `multi_hop`) and decomposes multi-hop queries.
  - `ConditionalRouter`: Routes queries to `DIRECT_LLM`, `SINGLE_AGENT`, `MULTI_AGENT`, or `HUMAN_REVIEW`.
  - `RetrieverAgent`: Hybrid search retriever with cache check.
  - `SynthesizerAgent`: Context compression and LLM answer generation with streaming SSE.
  - `ValidatorAgent`: Asynchronous post-stream hallucination checker using secondary LLM.
- **Hybrid Dense-Sparse Search**: Fuses FAISS vector embeddings with BM25 keyword matching using Reciprocal Rank Fusion (RRF), followed by optional NVIDIA neural reranking (`nv-rerank-qa-mistral-4b:1`).
- **Extension-Aware Chunking**: 8 specialized chunking strategies for PDF, Markdown, HTML, Python/JS/Go code, CSV, JSON, and Notebooks.
- **Four-Level Caching**: Provider-side KV Cache, Redis Retrieval Cache, Redis LLM Cache, and SQLite Human-Approved Answer Cache.
- **Session Isolation & Auth**: Supabase Auth (Google OAuth & Email/Password) + isolated per-session document storage in FAISS/Qdrant.

## Tech Stack
- **Backend**: Python, FastAPI, LangChain, FAISS, Qdrant, BM25, Redis, Supabase, SQLite.
- **LLMs & Embeddings**: OpenRouter, Gemini, Cerebras (Validator), NVIDIA BGE-M3 Embeddings.
- **Frontend**: React 19, Vite, Tailwind CSS, Server-Sent Events (SSE).
