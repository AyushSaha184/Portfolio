import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "Intelli",
    titleAccent: "Docs",
    description:
      "A Retrieval-Augmented Generation (RAG) powered enterprise document assistant that provides instant answers from company-related docs.",
    tag: "Enterprise RAG Assistant",
    techStack: ["Python", "LangChain", "Qdrant", "FastAPI", "Redis", "Supabase"],
    imageUrl: "/logo/intellidocs.webp",
    demoUrl: "https://intelli-docs-five.vercel.app",
    githubUrl: "https://github.com/AyushSaha184/IntelliDocs",
  },
  {
    title: "Eval",
    titleAccent: "MCP",
    description:
      "A Model Context Protocol (MCP) Server that provides 15 tools for faster and more efficient accuracy evaluation for RAG systems.",
    tag: "RAG Evaluation Tool",
    techStack: ["Python", "FastMCP", "FastAPI", "Neon", "Redis"],
    imageUrl: "/logo/evalmcp.webp",
    githubUrl: "https://github.com/AyushSaha184/Eval_MCP",
  },
  {
    title: "Testa",
    titleAccent: "Code",
    description:
      "A multi-agent powered software testing suite built to automatically generate unit tests and enforce robust code validation.",
    tag: "Agentic Test Generator",
    techStack: ["Python", "LangGraph", "FastAPI", "Redis", "Neon"],
    imageUrl: "/logo/testacode.webp",
    demoUrl: "https://testa-code.vercel.app",
    githubUrl: "https://github.com/AyushSaha184/TestaGen",
  },
  {
    title: "PR",
    titleAccent: "Prep",
    description: "PR Prep is an AI-powered CLI agent that analyzes staged Git diffs, detects breaking changes via AST parsing, and drafts structured pull request descriptions with reviewer suggestions.",
    tag: "Command line agentic tool",
    techStack: ["Python", "Tree-sitter", "Typer", "LangGraph", "LangChain"],
    imageUrl: "/logo/prprep.webp",
    githubUrl: "https://github.com/AyushSaha184/PR-Prep",
  },
  {
    title: "Medi",
    titleAccent: "Flow",
    description: "A multi-agent system that analyzes X-rays, PDFs, and health records to identify potential medical conditions from user-provided data.",
    tag: "Multi-Agent pipeline",
    techStack: ["Python", "FastAPI", "LangGraph", "Microsoft Presidio", "pgVector", "Redis"],
    imageUrl: "/logo/mediflow.webp",
    demoUrl: "https://medi-flow-pied.vercel.app/",
    githubUrl: "https://github.com/AyushSaha184/MediFlow",
  },
  {
    title: "Raw",
    titleAccent: "Logger",
    description: "A local-first CLI tool for correlating logs across multiple services. It watches or ingests log files, normalizes timestamps with clock-skew estimation, stores events in an in-memory SQLite timeline.",
    tag: "Command Line Tool",
    techStack: ["Python", "FastAPI", "SQLite"],
    imageUrl: "/logo/rawlogger.webp",
    githubUrl: "https://github.com/AyushSaha184/Raw-Logger",
  },
  {
    title: "Reddif",
    titleAccent: "",
    description: "An Android app that pushes all notifications from different flairs in the subreddit r/PhotoshopRequest to your device.",
    tag: "Android notification App",
    techStack: ["Python", "FastAPI", "SQLite"],
    imageUrl: "/logo/reddif.webp",
    githubUrl: "https://github.com/AyushSaha184/Reddif",
  },
];
