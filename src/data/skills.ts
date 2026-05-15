import { SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "fas fa-code",
    skills: ["Java", "Python", "C"],
    floatSpeed: "medium",
  },
  {
    title: "Libraries/Frameworks",
    icon: "fas fa-layer-group",
    skills: ["FastAPI", "LangChain", "LangGraph", "LlamaIndex", "FastMCP", "REST APIs"],
    floatSpeed: "fast",
  },
  {
    title: "Databases",
    icon: "fas fa-database",
    skills: ["PostgreSQL", "MySQL", "Redis", "Qdrant"],
    floatSpeed: "slow",
  },
  {
    title: "Cloud/Deployment",
    icon: "fas fa-cloud",
    skills: ["Docker", "Vercel", "Supabase", "Neon", "Render", "Git", "Linux"],
    floatSpeed: "medium",
  },
  {
    title: "Coursework",
    icon: "fas fa-book",
    skills: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "Computer Networks", "OOP"],
    floatSpeed: "fast",
  },
  {
    title: "Generative AI",
    icon: "fas fa-robot",
    skills: [
      "Retrieval Augmented Generation",
      "AI Agents",
      "NLP",
      "Transformers",
      "Open Source LLMs",
      "Model Context Protocol"
    ],
    floatSpeed: "slow",
  },
];
