import { loadRAGDocuments } from './documents';
import type { RAGDocument } from './documents';

export type RAGChunk = {
  id: string;
  sourceFile: string;
  docTitle: string;
  sectionTitle: string;
  content: string;
  targetSection: string;
  githubUrl?: string;
  demoUrl?: string;
  repo?: string;
};

function parseFrontmatter(rawContent: string): { frontmatter: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: rawContent };
  }

  const frontmatterStr = match[1];
  const body = rawContent.replace(frontmatterRegex, '');
  const frontmatter: Record<string, string> = {};

  frontmatterStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key] = val;
    }
  });

  return { frontmatter, body };
}

export function generateRAGChunks(): RAGChunk[] {
  const docs: RAGDocument[] = loadRAGDocuments();
  const chunks: RAGChunk[] = [];
  let chunkCounter = 0;

  for (const doc of docs) {
    const { frontmatter, body } = parseFrontmatter(doc.content);
    const docTitle = frontmatter.title || doc.fileName.replace('.md', '');
    const targetSection = frontmatter.targetSection || '#home';
    const githubUrl = frontmatter.githubUrl;
    const demoUrl = frontmatter.demoUrl;
    const repo = frontmatter.repo;

    // Split body into sections by Markdown headers (e.g. ## Header)
    const sections = body.split(/(?=^#{1,3}\s+)/m);

    for (const sec of sections) {
      const trimmed = sec.trim();
      if (!trimmed) continue;

      let sectionTitle = docTitle;
      const headerMatch = trimmed.match(/^#{1,3}\s+(.+)$/m);
      if (headerMatch) {
        sectionTitle = headerMatch[1].trim();
      }

      // Cleanup markdown syntax for cleaner vector matching
      const cleanText = trimmed
        .replace(/^#{1,3}\s+.+$/m, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // convert markdown links to text
        .replace(/[*_`#-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText.length < 20) continue;

      chunkCounter++;
      chunks.push({
        id: `chunk-${chunkCounter}-${doc.fileName.replace('.md', '')}`,
        sourceFile: doc.fileName,
        docTitle,
        sectionTitle,
        content: `${sectionTitle}: ${cleanText}`,
        targetSection,
        githubUrl,
        demoUrl,
        repo
      });
    }
  }

  return chunks;
}
