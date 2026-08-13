import { portfolioVectorStore } from './vectorStore';
import type { SearchResult } from './vectorStore';

export type RAGResponse = {
  answer: string;
  sources: Array<{
    fileName: string;
    docTitle: string;
    sectionTitle: string;
    scorePercent: number;
    targetSection: string;
    githubUrl?: string;
    demoUrl?: string;
  }>;
  isError?: boolean;
};

const OUT_OF_SCOPE_REPLY = "I can only answer questions related to Ayush Saha's portfolio, projects, skills, education, and contact information.";

// Consolidated Master Knowledge Context embedded for 100% complete Gemini understanding
const MASTER_PORTFOLIO_SUMMARY = `
AYUSH SAHA PORTFOLIO KNOWLEDGE BASE:

Profile:
- Name: Ayush Saha
- Title: AI Engineer & 4th-year Computer Science Student
- Institution: Siliguri Institute of Technology (SIT), West Bengal, India
- GitHub: https://github.com/AyushSaha184
- LinkedIn: https://www.linkedin.com/in/AyushSaha184
- Specialization: RAG & Agentic AI Systems, Vector Search, Multi-Agent Orchestration, High-Performance Microservices.

All 6 Projects Built by Ayush Saha:
1. PRism (PR Prep): Autonomous GitHub App & AI code review engine using 4 parallel LangGraph agents (Security, Quality, Tests, Docs), hybrid vector search (pgvector), and human-in-the-loop approval queues. (Stack: Python, FastAPI, LangGraph, pgvector, Redis).
2. Eval_MCP: Single-binary Model Context Protocol (MCP) server built in Go for prompt evaluation, RAG pipeline scoring, regression tracking, and embedded dark web dashboard. Exposes 16 native MCP tools. (Stack: Go, FastMCP, Redis, Render).
3. IntelliDocs: Enterprise Multi-Agent RAG knowledge engine featuring Planner, Router, Retriever, Synthesizer, and Validator agents, FAISS + BM25 hybrid search, NVIDIA neural reranking, SSE streaming, and Supabase auth. (Stack: Python, FastAPI, FAISS, Qdrant, Redis, Supabase).
4. TestaCode (AI-Test-Gen): Autonomous AI test generator for Python, JS/TS, and Java. Features AST parsing, multi-stage LLM chains, syntax auto-correction retries, and session isolation. (Stack: Python, FastAPI, React 19, Pydantic).
5. booking-app: Full-stack appointment reservation system with Next.js 15, Drizzle ORM, Neon Serverless PostgreSQL, Upstash Redis rate limiting, Twilio SMS, and Google Calendar API. (Stack: Next.js 15, TypeScript, Drizzle, Neon, Redis, Twilio).
6. FiTrack: Cross-platform mobile fitness tracker built with React Native, MobX state management, Firebase authentication, and MMKV local storage. (Stack: React Native, MobX, Firebase).

Technical Skills & Technologies:
- Generative AI & RAG: RAG, Agentic AI, Model Context Protocol (MCP), FAISS, Qdrant, pgvector, BM25, Prompt Engineering, Open-Source LLMs, LangChain, LangGraph, LlamaIndex.
- Programming Languages: Go, Python, Java, TypeScript, JavaScript.
- Databases & Caching: PostgreSQL, Supabase, Neon, MySQL, Redis, Upstash, SQLite, MMKV, Drizzle ORM, SQLAlchemy.
- Web & Mobile: Next.js 15, Astro, React 19, React Native, FastAPI, Tailwind CSS, Docker, Render, Vercel, Git.
- CS Coursework: Operating Systems (OS), DBMS, Computer Networks, OOP, Data Structures & Algorithms (DSA), System Design.
`;

export async function executeRAGQuery(query: string, apiKey?: string): Promise<RAGResponse> {
  const trimmedQuery = query.trim();

  // 1. Retrieve Top 4 matching Markdown chunks using expanded Cosine Similarity
  const searchResults: SearchResult[] = portfolioVectorStore.search(trimmedQuery, 4);

  const sources = searchResults.map(res => ({
    fileName: res.chunk.sourceFile,
    docTitle: res.chunk.docTitle,
    sectionTitle: res.chunk.sectionTitle,
    scorePercent: Math.round(res.score * 100),
    targetSection: res.chunk.targetSection,
    githubUrl: res.chunk.githubUrl,
    demoUrl: res.chunk.demoUrl
  }));

  const envProc = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
  const effectiveApiKey =
    apiKey ||
    (import.meta.env.GEMINI_API_KEY as string) ||
    (import.meta.env.PUBLIC_GEMINI_API_KEY as string) ||
    envProc?.env?.GEMINI_API_KEY;

  // Build granular retrieved chunks context
  const retrievedChunksSnippet = searchResults.length > 0
    ? searchResults.map(r => `[Chunk: ${r.chunk.docTitle} - ${r.chunk.sectionTitle}]\n${r.chunk.content}`).join('\n\n')
    : "";

  // If Gemini Flash API key is provided, query Gemini Flash Model with full master context + top chunks
  if (effectiveApiKey && effectiveApiKey !== 'your_gemini_api_key_here') {
    try {
      const systemPrompt = `You are the AI Portfolio Assistant for Ayush Saha, a 4th-year Computer Science student and AI Engineer at SIT West Bengal.

User Query: "${trimmedQuery}"

Master Portfolio Knowledge Context:
${MASTER_PORTFOLIO_SUMMARY}

Specific Retrieved Details:
${retrievedChunksSnippet}

STRICT RESPONSE RULES:
1. ANY QUESTION ABOUT AYUSH SAHA IS IN-SCOPE: Questions asking about his projects, skills, tech stack, why to hire him, education, location, or contact info MUST be answered thoroughly and accurately using the context above.

2. PRONOUN RESOLUTION: Any pronouns such as "his", "he", "him", "your", "the developer", "the author" refer to Ayush Saha.

3. OUT-OF-SCOPE FILTER: If and ONLY if the user query is completely unrelated to Ayush Saha, software engineering, or portfolio topics (e.g. cooking recipes, sports scores, celebrity gossip, weather), respond EXACTLY with:
"${OUT_OF_SCOPE_REPLY}"

4. CLEAN FORMAT: Provide ONLY the direct, clear, helpful answer. Do NOT add prefix/suffix labels such as "Based on the documentation...", "Here is the answer...", or "Additional Context:". Use clean markdown bullet points if listing items.`;

      // Try modern Flash models in order
      const modelsToTry = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];
      let response: Response | null = null;
      let lastErrJson: any = null;

      for (const modelId of modelsToTry) {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${effectiveApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600
            }
          })
        });

        if (response.ok) break;

        if (response.status === 404) {
          lastErrJson = await response.json().catch(() => ({}));
          continue;
        } else {
          break;
        }
      }

      if (response && !response.ok) {
        const errJson = lastErrJson || await response.json().catch(() => ({}));
        const errMessage = errJson?.error?.message || response.statusText;

        if (response.status === 400 || response.status === 401 || response.status === 403) {
          return {
            answer: `⚠️ Gemini API Key Error: Invalid or expired API key (${response.status}). Please check your GEMINI_API_KEY in .env.`,
            sources: [],
            isError: true
          };
        }

        if (response.status === 429) {
          return {
            answer: "⚠️ Gemini API Rate Limit: Request quota exceeded. Please wait a minute before trying again.",
            sources: [],
            isError: true
          };
        }

        return {
          answer: `⚠️ Gemini API Error (${response.status}): ${errMessage}`,
          sources: [],
          isError: true
        };
      }

      if (response) {
        const data = await response.json();
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          const cleanAnswer = generatedText.trim();
          const isOutOfScope = cleanAnswer.includes("I can only answer questions related to Ayush Saha");

          return {
            answer: cleanAnswer,
            sources: isOutOfScope ? [] : sources
          };
        }
      }
    } catch (err: any) {
      return {
        answer: `⚠️ Network / Connection Error: Unable to reach Gemini API. ${err?.message || ''}`,
        sources: [],
        isError: true
      };
    }
  }

  // Local Grounded Fallback Engine (No API Key or Offline)
  if (searchResults.length > 0 && searchResults[0].score > 0.05) {
    const topChunk = searchResults[0].chunk;
    let cleanFallbackAnswer = topChunk.content;
    if (cleanFallbackAnswer.includes(': ')) {
      cleanFallbackAnswer = cleanFallbackAnswer.split(': ').slice(1).join(': ');
    }
    return {
      answer: cleanFallbackAnswer,
      sources
    };
  }

  // Default clean overview fallback for general queries
  return {
    answer: "Ayush Saha is an AI Engineer and 4th-year Computer Science student at Siliguri Institute of Technology (SIT), West Bengal. He has created 6 major projects including PRism (AI Code Reviewer), Eval_MCP (Go MCP Server), IntelliDocs (Enterprise RAG), TestaCode (AI Test Generator), booking-app, and FiTrack.",
    sources: []
  };
}
