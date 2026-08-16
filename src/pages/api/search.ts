import type { APIRoute } from 'astro';
import { executeRAGQuery } from '../../lib/rag/ragEngine';

// In-memory sliding window rate limiter
// Max 5 requests per 60 seconds per IP/client
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestMap = new Map<string, number[]>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestMap.get(clientIp) || [];
  
  // Filter out timestamps outside window
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestMap.set(clientIp, validTimestamps);
    return true;
  }
  
  validTimestamps.push(now);
  ipRequestMap.set(clientIp, validTimestamps);
  return false;
}

// Cleanup stale rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipRequestMap.entries()) {
      const valid = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        ipRequestMap.delete(ip);
      } else {
        ipRequestMap.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000);
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ status: "ok", message: "Ayush Saha AI Search RAG API is operational." }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || 'global-client';

    // Enforce Rate Limiting
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          answer: "⚠️ Rate Limit Exceeded: You have sent too many requests. Please wait 60 seconds before searching again.",
          sources: [],
          isError: true
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const query = body.query;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return new Response(
        JSON.stringify({
          answer: "Please enter a valid search query.",
          sources: [],
          isError: true
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await executeRAGQuery(query);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('RAG Search API Error:', error);
    return new Response(
      JSON.stringify({
        answer: `⚠️ Internal Search Error: ${error?.message || 'An unexpected error occurred.'}`,
        sources: [],
        isError: true
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
