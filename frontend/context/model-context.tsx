'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type ModelContextValue = {
  model: string
  setModel: React.Dispatch<React.SetStateAction<string>>
}

const ModelContext = createContext<ModelContextValue | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState('model1')
  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const ctx = useContext(ModelContext)
  if (!ctx) {
    throw new Error('useModel must be used within a ModelProvider')
  }
  return ctx
}
