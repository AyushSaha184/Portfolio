// Automated document loader for RAG knowledge store
export type RAGDocument = {
  filePath: string;
  fileName: string;
  content: string;
};

export function loadRAGDocuments(): RAGDocument[] {
  const modules = import.meta.glob('/src/content/rag/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
  }) as Record<string, string>;

  const docs: RAGDocument[] = [];

  for (const [filePath, content] of Object.entries(modules)) {
    const fileName = filePath.split('/').pop() || filePath;
    docs.push({
      filePath,
      fileName,
      content: typeof content === 'string' ? content : String(content)
    });
  }

  return docs;
}
