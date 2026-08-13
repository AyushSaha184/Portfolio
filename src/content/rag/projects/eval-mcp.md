---
title: "Eval_MCP - Model Context Protocol Engine in Go"
tag: "Model Context Protocol Engine"
repo: "Eval_MCP"
year: "2025"
githubUrl: "https://github.com/AyushSaha184/Eval_MCP"
targetSection: "#projects"
---

# Eval_MCP: Single-Binary Model Context Protocol Server

## Overview
`Eval_MCP` is a high-performance, single-binary Model Context Protocol (MCP) server built natively in **Go** for prompt evaluation, RAG pipeline scoring, hallucination detection, regression tracking, and real-time dashboard analytics.

## Key Features & MCP Tools
- **Single Standalone Binary**: Compiles down to a single executable (`eval-mcp`) with zero runtime dependencies.
- **16 Native MCP Tools**: Full tool suite including:
  1. `register_golden_dataset` - Register test cases dataset.
  2. `run_eval_suite` - Queue prompt evaluation runs.
  3. `score_rag_pipeline` - Score retrieval & generation quality.
  4. `compare_prompt_versions` - Compare candidate prompt metric deltas.
  5. `detect_regression` - Catch regressions against project baselines.
  6. `suggest_fix` - LLM-as-a-judge prompt fix suggestions.
  7. `get_latest_suggestion`, `get_eval_history`, `get_run_status`, `list_projects`, `list_datasets`, `list_prompts`, `set_baseline_run`, `rerun_failed_cases`, `annotate_run`, `get_supported_metrics`.
- **Pure Go Heuristic Metrics**: Exact Match, Levenshtein Answer Correctness, Token-Overlap Hallucination & Faithfulness, Lexical Toxicity, Context Precision & Recall.
- **Embedded Dark Dashboard**: Web UI built-in at `http://localhost:8501` featuring glassmorphic aesthetics, live pass rates, and run histories.
- **Redis & Background Worker**: Asynchronous queue processing for heavy evaluation workloads.

## Tech Stack & Deployment
- **Language**: Go 1.22+.
- **Protocol**: Model Context Protocol (MCP stdio & REST API).
- **Backend Queue**: Redis & in-memory queue.
- **Deployment**: Supports local execution as well as Render Cloud backend via `render.yaml`.
