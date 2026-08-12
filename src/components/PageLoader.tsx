"use client";

import React, { useState, useEffect } from "react";
import { MultiStepLoader } from "./ui/loader";

const portfolioLoadingStates = [
  { text: "Initializing RAG & Agentic AI Core..." },
  { text: "Connecting Vector Databases (Qdrant & Redis)..." },
  { text: "Loading Multi-Agent Pipelines..." },
  { text: "Fetching Verified Repositories..." },
  { text: "Ayush Saha Portfolio Ready!" },
];

export const PageLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("portfolio_initial_loaded");
    if (hasLoaded) {
      setLoading(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("portfolio_initial_loaded", "true");
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  if (!loading) return null;

  return (
    <MultiStepLoader
      loadingStates={portfolioLoadingStates}
      loading={loading}
      duration={650}
      loop={false}
      onComplete={handleComplete}
    />
  );
};

export default PageLoader;
