---
title: "PRism - GitHub App & AI Code Review Engine"
tag: "GitHub App & Code Review AI"
repo: "PRism"
year: "2025"
githubUrl: "https://github.com/AyushSaha184/PRism"
targetSection: "#projects"
---

# PRism: Repository-Grounded AI Pull Request Reviewer

## Overview
PRism (PR Prep) is an autonomous GitHub App and web platform designed to review pull requests using four parallel repository-grounded AI specialists: Security, Code Quality, Test Coverage, and Documentation.

## Core Features
- **4 Parallel AI Specialists**: Security Agent, Quality Agent, Tests Agent, and Docs Agent running concurrently via LangGraph orchestration.
- **Hybrid Code Retrieval**: Combines pgvector vector search with full-text search to retrieve relevant code and context rather than reviewing diffs in isolation.
- **Human-in-the-Loop (HITL) Gate**: High-confidence reviews post automatically to GitHub. CRITICAL findings, low-confidence scores, or disputed outputs are escalated to a web approval queue for human review.
- **Auditable Event Spine**: Every model call, tool invocation, confidence decision, and reviewer action is logged in an append-only event trail.
- **Resilient & Secure Ingress**: GitHub HMAC-SHA256 signature verification, delivery deduplication via Redis/ARQ, circuit breakers, and rootless sandboxed tool execution.

## Technical Architecture & Stack
- **Backend API**: Python 3.12, FastAPI, Pydantic, SQLAlchemy async, asyncpg.
- **Workflow Orchestration**: LangGraph (behind an abstract workflow interface).
- **Queue & Checkpointing**: Redis and ARQ job queues.
- **AI & Vector Memory**: Provider-neutral LLM client, OpenAI embeddings (`text-embedding-3-large`), Tiger Cloud / PostgreSQL with `pgvector` and `pgvectorscale` DiskANN.
- **Frontend Dashboard**: Next.js, React, TypeScript, Tailwind CSS.
- **GitHub Integration**: GitHub App with signed webhooks, installation tokens, REST API.
