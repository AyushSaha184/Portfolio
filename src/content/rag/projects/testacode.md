---
title: "TestaCode / AI-Test-Gen - Agentic Test Generation Suite"
tag: "Agentic Test Generator"
repo: "TestaCode"
year: "2025"
demoUrl: "https://testa-code.vercel.app"
githubUrl: "https://github.com/AyushSaha184/TestaCode"
targetSection: "#projects"
---

# TestaCode (AI-Test-Gen): Autonomous Test Generation Suite

## Overview
TestaCode is an AI-powered test generation platform with a FastAPI backend and React + TypeScript dashboard. It parses source files, classifies testing intent, executes multi-stage LLM chains, validates syntax, and auto-corrects syntax errors.

## Key Features & Capabilities
- **Multi-Language Support**: Generates tests for Python (`pytest`), JavaScript (`Jest`), TypeScript (`Jest`), and Java (`JUnit`).
- **AST Parsing & Intent Classification**: Python AST parser with canonical hashing; LLM JSON schema parser for JS/TS/Java. Predicts test scope, framework, and confidence level.
- **Multi-Stage Chain**: Analysis → Generation → Syntax Validation → Self-Evaluation. Auto-corrects syntax errors with up to 3 retry attempts.
- **Session Isolation & Idempotency**: `X-Session-Id` header isolation and request deduplication via `Idempotency-Key`.
- **Human-in-the-Loop Feedback**: Thumbs up/down feedback with correction notes stored for model fine-tuning.

## Tech Stack
- **Backend**: Python, FastAPI, Pydantic, PostgreSQL, Supabase Storage, AST parsing.
- **Frontend**: React 19, Vite, TypeScript, TanStack Query, Zustand, Monaco Code Editor.
