import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "Intelli",
    titleAccent: "Docs",
    description:
      "A Retrieval-Augmented Generation (RAG) powered enterprise document assistant that provides instant answers from company-related docs.",
    tag: "Enterprise RAG Assistant",
    techStack: ["Python", "LangChain", "Qdrant", "FastAPI", "Redis", "Supabase"],
    imageUrl: "", // Add actual image URL when ready
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
    imageUrl: "", // Add actual image URL when ready
    githubUrl: "https://github.com/AyushSaha184/Eval_MCP",
  },
  {
    title: "Testa",
    titleAccent: "Code",
    description:
      "A multi-agent powered software testing suite built to automatically generate unit tests and enforce robust code validation.",
    tag: "Agentic Test Generator",
    techStack: ["Python", "LangGraph", "FastAPI", "Redis", "Neon"],
    demoUrl: "https://testa-code.vercel.app",
    githubUrl: "https://github.com/AyushSaha184/TestaGen",
  },
  {
    title: "Project",
    titleAccent: "Four",
    description: "Description for the new upcoming project goes here. This is a placeholder for future work.",
    tag: "Upcoming",
    techStack: ["TypeScript", "Next.js", "Framer Motion"],
    imageUrl: "",
    githubUrl: "https://github.com/AyushSaha184/placeholder-1",
  },
  {
    title: "Project",
    titleAccent: "Five",
    description: "Description for the new upcoming project goes here. This is a placeholder for future work.",
    tag: "Upcoming",
    techStack: ["Go", "Docker", "Kubernetes"],
    imageUrl: "",
    githubUrl: "https://github.com/AyushSaha184/placeholder-2",
  },
  {
    title: "Project",
    titleAccent: "Six",
    description: "Description for the new upcoming project goes here. This is a placeholder for future work.",
    tag: "Upcoming",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    imageUrl: "",
    githubUrl: "https://github.com/AyushSaha184/placeholder-3",
  },
  {
    title: "Project",
    titleAccent: "Seven",
    description: "Description for the new upcoming project goes here. This is a placeholder for future work.",
    tag: "Upcoming",
    techStack: ["Rust", "WASM", "Svelte"],
    imageUrl: "",
    githubUrl: "https://github.com/AyushSaha184/placeholder-4",
  },
];
