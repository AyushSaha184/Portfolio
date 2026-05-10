export interface Project {
  title: string;
  titleAccent: string;
  description: string;
  tag: string; // The primary tag/category
  techStack?: string[]; // Array of tech stack names
  imageUrl?: string; // URL for the project thumbnail/image
  demoUrl?: string;
  githubUrl: string;
  disabled?: boolean;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  floatSpeed: "slow" | "medium" | "fast";
}

export interface SocialLink {
  platform: "linkedin" | "github" | "x" | "email";
  url: string;
  icon: string;
  label: string;
}
