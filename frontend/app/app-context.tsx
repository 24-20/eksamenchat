'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Model {
  id: string;
  label: string;
}

interface AppContextType {
  knowledgeBase: Model;
  setKnowledgeBase: (data: Model) => void;
  model: Model;
  setModel: (data: Model) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// These are the valid models and knowledgeBases you support
const knowledgeBases = [
  { id: "matte_r2", label: "Matte R2" },
  { id: "matte_r1", label: "Matte R1" },
  { id: "fysikk_ii", label: "Fysikk II" },
];

const gptModels = [
  { id: "gpt_o4_mini", label: "GPT-o4-mini" },
  { id: "gpt_4o", label: "GPT-4o" },
];

// Default values
const defaultKnowledgeBase = { id: "matte_r2", label: "Matte R2" };
const defaultModel = { id: "gpt_4o", label: "GPT-4o" };

export const AppProvider = ({ children }: AppProviderProps) => {
  // Start as undefined and set them after checking URL/localStorage
  const [knowledgeBase, setKnowledgeBase] = useState<Model | undefined>(undefined);
  const [model, setModel] = useState<Model | undefined>(undefined);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const modelIdFromUrl = params.get("model");
    const kbIdFromUrl = params.get("kb");

    let resolvedModel: Model | undefined = undefined;
    let resolvedKB: Model | undefined = undefined;

    // Try URL first
    if (modelIdFromUrl) {
      resolvedModel = gptModels.find((m) => m.id === modelIdFromUrl);
    }
    if (kbIdFromUrl) {
      resolvedKB = knowledgeBases.find((kb) => kb.id === kbIdFromUrl);
    }

    // Fallback to localStorage
    if (!resolvedModel) {
      const modelIdFromStorage = localStorage.getItem("model");
      if (modelIdFromStorage) {
        resolvedModel = gptModels.find((m) => m.id === modelIdFromStorage);
      }
    }
    if (!resolvedKB) {
      const kbIdFromStorage = localStorage.getItem("kb");
      if (kbIdFromStorage) {
        resolvedKB = knowledgeBases.find((kb) => kb.id === kbIdFromStorage);
      }
    }

    // Final fallback to defaults if still not found
    if (!resolvedModel) {
      resolvedModel = defaultModel;
    }
    if (!resolvedKB) {
      resolvedKB = defaultKnowledgeBase;
    }

    // Set in state
    setModel(resolvedModel);
    setKnowledgeBase(resolvedKB);

    // Save to localStorage
    localStorage.setItem("model", resolvedModel.id);
    localStorage.setItem("kb", resolvedKB.id);

    // If params are missing, update URL
    let shouldUpdateUrl = false;
    if (!modelIdFromUrl || !kbIdFromUrl) {
      shouldUpdateUrl = true;
    }

    if (shouldUpdateUrl) {
      const updatedParams = new URLSearchParams();
      updatedParams.set("model", resolvedModel.id);
      updatedParams.set("kb", resolvedKB.id);

      router.replace(`?${updatedParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  if (!knowledgeBase || !model) {
    // Optional: Return nothing until we have loaded model/kb
    return null;
  }

  return (
    <AppContext.Provider value={{ knowledgeBase, setKnowledgeBase, model, setModel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
