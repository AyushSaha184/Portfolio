"use client";

import React, { useState, useEffect, useRef } from "react";
import { BorderBeam } from "./ui/border-beam";
import { GenerateButton } from "./ui/generate-button";
import { executeRAGQuery } from "../lib/rag/ragEngine";
import type { RAGResponse } from "../lib/rag/ragEngine";

const sampleQueries = [
  "Tell me about PRism & AI code reviews",
  "What experience does Ayush have with RAG & Vector DBs?",
  "What projects are built with Go or Next.js?",
  "How to contact Ayush Saha?",
  "What is Eval_MCP and its 16 MCP tools?",
  "Tell me about IntelliDocs multi-agent pipeline",
  "What is TestaCode test generator?",
  "Where is Ayush studying and what is his major?"
];

export const AISearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ragResult, setRagResult] = useState<RAGResponse | null>(null);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const resetModalState = () => {
    setQuery("");
    setRagResult(null);
    setDisplayedAnswer("");
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetModalState();
  };

  // Trigger setup for #ai-search-trigger button & Cmd+K keyboard shortcut
  useEffect(() => {
    const handleOpen = () => {
      resetModalState();
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    const triggerBtn = document.getElementById("ai-search-trigger");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", handleOpen);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) {
            resetModalState();
            return false;
          } else {
            setTimeout(() => inputRef.current?.focus(), 100);
            return true;
          }
        });
      }
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (triggerBtn) triggerBtn.removeEventListener("click", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Typewriter effect for AI answer
  useEffect(() => {
    if (!ragResult?.answer) {
      setDisplayedAnswer("");
      return;
    }

    let i = 0;
    const fullText = ragResult.answer;
    setDisplayedAnswer("");

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedAnswer((prev) => fullText.slice(0, i + 3));
        i += 3;
      } else {
        setDisplayedAnswer(fullText);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [ragResult]);

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    setQuery(q);
    setIsLoading(true);
    setRagResult(null);

    try {
      // 1. Attempt server API route
      const apiRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const data = await apiRes.json().catch(() => null);
        if (data) {
          setRagResult(data);
          setIsLoading(false);
          return;
        }
      }

      if (apiRes && apiRes.status === 429) {
        const data = await apiRes.json().catch(() => null);
        setRagResult({
          answer: data?.answer || "⚠️ Rate Limit Exceeded: You are making requests too quickly. Please wait 60 seconds before trying again.",
          sources: [],
          isError: true
        });
        setIsLoading(false);
        return;
      }

      // Fallback to client-side RAG engine
      const fallbackRes = await executeRAGQuery(q);
      setRagResult(fallbackRes);
    } catch {
      const fallbackRes = await executeRAGQuery(q);
      setRagResult(fallbackRes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJumpToSection = (targetSection: string) => {
    closeModal();
    if (targetSection) {
      const el = document.querySelector(targetSection);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Glassmorphic Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={closeModal}
      />

      {/* Main Dialog Box Container with Double BorderBeam */}
      <div className="relative w-full max-w-2xl bg-[#090b10]/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 z-10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* DOUBLE BORDER BEAM EFFECT */}
        <BorderBeam size={450} duration={7} delay={0} colorFrom="#ffffff" colorTo="rgba(255, 255, 255, 0)" borderWidth={1.5} rx={24} />
        <BorderBeam size={450} duration={7} delay={3.5} colorFrom="#ffffff" colorTo="rgba(255, 255, 255, 0)" borderWidth={1.5} rx={24} />

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Ayush's projects, RAG skills, architecture..."
            className="w-full bg-[#030406]/90 border border-white/20 rounded-2xl py-3.5 pl-4 pr-24 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all shadow-inner"
          />

          <div className="absolute right-2 top-1.5 bottom-1.5 flex items-center">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl transition-all disabled:opacity-40"
            >
              {isLoading ? "Thinking..." : "Search"}
            </button>
          </div>
        </form>

        {/* Preset Sample Prompt Chips */}
        {!ragResult && !isLoading && (
          <div className="mt-5 pt-1 shrink-0">
            <p className="text-xs font-medium text-white/50 mb-2.5">Suggested queries:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSearch(sample)}
                  className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all text-left"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Content Output Area */}
        <div className="mt-5 overflow-y-auto pr-1 space-y-4 text-left flex-1 custom-scrollbar">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {ragResult && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Answer Content Box */}
              <div
                className={`border rounded-2xl p-5 text-sm leading-relaxed font-normal whitespace-pre-wrap shadow-inner ${
                  ragResult.isError
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : "bg-[#030406]/70 border-white/10 text-white/90"
                }`}
              >
                {displayedAnswer}
              </div>
            </div>
          )}
        </div>

        {/* Dialog Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end shrink-0">
          <GenerateButton onClick={closeModal}>
            Close
          </GenerateButton>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;
