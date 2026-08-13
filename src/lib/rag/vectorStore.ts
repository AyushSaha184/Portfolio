import { generateRAGChunks } from './chunker';
import type { RAGChunk } from './chunker';

export type SearchResult = {
  chunk: RAGChunk;
  score: number; // 0 to 1 score (e.g. 0.85 = 85%)
};

// Expand query terms and pronouns to align with portfolio knowledge base vocabulary
function expandQuery(query: string): string {
  let q = query.toLowerCase();

  // Map pronouns -> Ayush / Developer
  q = q.replace(/\b(his|he|him|your|yours|author|developer|candidate|who|person)\b/g, 'ayush saha developer');

  // Map skill terms -> skills technical stack
  q = q.replace(/\b(skillset|skills|skill|techstack|stack|expertise|tech|technologies|tools|languages|frameworks|know|knows|capabilities|specialty|specialization)\b/g, 'skills technical stack expertise generative ai rag agentic python go fastmcp postgresql');

  // Map project terms -> projects
  q = q.replace(/\b(projects|project|work|repos|repositories|built|apps|applications|portfolio)\b/g, 'projects prism eval_mcp intellidocs testacode booking app fitrack github');

  // Map contact terms -> contact
  q = q.replace(/\b(contact|reach|touch|email|connect|hire|linkedin|github|location|address)\b/g, 'contact social links sit siliguri email github linkedin');

  // Map education terms -> education
  q = q.replace(/\b(education|college|university|study|studying|degree|coursework|sit|siliguri)\b/g, 'education sit siliguri computer science degree coursework');

  return `${query} ${q}`;
}

// Tokenize text into lowercase words, filtering out common stopwords
function tokenize(text: string): string[] {
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
    'with', 'this', 'but', 'they', 'have', 'had', 'what', 'whats', 'when', 'where',
    'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopwords.has(word));
}

export class VectorStore {
  private chunks: RAGChunk[] = [];
  private chunkTokens: Map<string, string[]> = new Map();
  private docFrequencies: Map<string, number> = new Map();
  private totalDocs: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    this.chunks = generateRAGChunks();
    this.totalDocs = this.chunks.length;

    for (const chunk of this.chunks) {
      // Include title, docTitle, sectionTitle, content, and file name in token representation
      const tokens = tokenize(`${chunk.docTitle} ${chunk.sectionTitle} ${chunk.content} ${chunk.sourceFile} ${chunk.targetSection}`);
      this.chunkTokens.set(chunk.id, tokens);

      const uniqueTokens = new Set(tokens);
      for (const token of uniqueTokens) {
        this.docFrequencies.set(token, (this.docFrequencies.get(token) || 0) + 1);
      }
    }
  }

  // Calculate TF-IDF vector for a set of tokens
  private computeVector(tokens: string[]): Map<string, number> {
    const termFreq: Map<string, number> = new Map();
    for (const t of tokens) {
      termFreq.set(t, (termFreq.get(t) || 0) + 1);
    }

    const vector: Map<string, number> = new Map();
    for (const [term, count] of termFreq.entries()) {
      const tf = count / tokens.length;
      const df = this.docFrequencies.get(term) || 1;
      const idf = Math.log((this.totalDocs + 1) / (df + 1)) + 1; // Standard smoothed IDF
      vector.set(term, tf * idf);
    }
    return vector;
  }

  // Compute cosine similarity between query vector and chunk vector
  private cosineSimilarity(v1: Map<string, number>, v2: Map<string, number>): number {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (const [term, weight1] of v1.entries()) {
      mag1 += weight1 * weight1;
      const weight2 = v2.get(term);
      if (weight2) {
        dotProduct += weight1 * weight2;
      }
    }

    for (const weight2 of v2.values()) {
      mag2 += weight2 * weight2;
    }

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  public search(query: string, topK: number = 3): SearchResult[] {
    const expanded = expandQuery(query);
    const queryTokens = tokenize(expanded);
    if (!queryTokens.length) return [];

    const queryVector = this.computeVector(queryTokens);
    const results: SearchResult[] = [];

    for (const chunk of this.chunks) {
      const chunkTokens = this.chunkTokens.get(chunk.id) || [];
      if (!chunkTokens.length) continue;

      const chunkVector = this.computeVector(chunkTokens);
      let score = this.cosineSimilarity(queryVector, chunkVector);

      const queryLower = query.toLowerCase();

      // Boost score for skill queries matching skill documents
      if ((queryLower.includes('skill') || queryLower.includes('tech') || queryLower.includes('know')) && chunk.sourceFile.includes('skills')) {
        score = Math.min(1.0, score + 0.3);
      }

      // Boost score if exact term matches document title or project repo name
      if (chunk.docTitle.toLowerCase().includes(queryLower) || (chunk.repo && queryLower.includes(chunk.repo.toLowerCase()))) {
        score = Math.min(1.0, score + 0.35);
      }

      if (score > 0.02) {
        results.push({ chunk, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

// Global singleton vector store instance
export const portfolioVectorStore = new VectorStore();
