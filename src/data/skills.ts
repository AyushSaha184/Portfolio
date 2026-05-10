import { SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages/Technologies",
    icon: "fas fa-code",
    skills: ["Java", "Python", "C"],
    floatSpeed: "medium",
  },
  {
    title: "Databases/Tools",
    icon: "fas fa-database",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Qdrant",
      "Supabase",
      "Neon",
      "Git",
      "Docker",
    ],
    floatSpeed: "slow",
  },
  {
    title: "Libraries/Frameworks",
    icon: "fas fa-layer-group",
    skills: ["LangChain", "LangGraph", "LlamaIndex", "FastMCP", "FastAPI"],
    floatSpeed: "fast",
  },
  {
    title: "Generative AI",
    icon: "fas fa-robot",
    skills: [
      "Natural Language Processing",
      "Transformers",
      "Open Source LLMs",
      "Retrieval Augmented Generation",
      "AI Agents",
      "Model Context Protocol",
    ],
    floatSpeed: "slow",
  },
];
