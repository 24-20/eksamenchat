'use client'

import { createContext, useContext, useState, ReactNode } from "react";

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

export const AppProvider = ({ children }: AppProviderProps) => {
  const [knowledgeBase, setKnowledgeBase] = useState<Model>({ id: "matte_r2", label: "Matte R2" });
  const [model, setModel] = useState<Model>({ id: "gpt_4o", label: "GPT-4o" });

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
