"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAppContext } from "@/app/app-context"

export function ModelDropdown() {
  const { knowledgeBase, setKnowledgeBase, model, setModel } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const knowledgeBases = [
    { id: "matte_r2", label: "Matte R2" },
    { id: "matte_r1", label: "Matte R1" },
    { id: "fysikk_ii", label: "Fysikk II" },
  ];

  const gptModels = [
    { id: "gpt_o4_mini", label: "GPT-o4-mini", description: "Raskest" },
    { id: "gpt_4o", label: "GPT-4o", description: "Anbefalt" },
  ];

  const [tempKnowledgeBase, setTempKnowledgeBase] = React.useState(knowledgeBase.id);
  const [tempModel, setTempModel] = React.useState(model.id);

  const handleSave = () => {
    const selectedKB = knowledgeBases.find((kb) => kb.id === tempKnowledgeBase);
    const selectedModel = gptModels.find((m) => m.id === tempModel);

    if (selectedKB) {
      setKnowledgeBase(selectedKB);
      localStorage.setItem('kb', selectedKB.id); // Update localStorage
    }
    if (selectedModel) {
      setModel(selectedModel);
      localStorage.setItem('model', selectedModel.id); // Update localStorage
    }

    // Update the URL search params
    const params = new URLSearchParams(searchParams.toString());
    if (selectedModel) {
      params.set('model', selectedModel.id);
    }
    if (selectedKB) {
      params.set('kb', selectedKB.id);
    }

    router.push(`?${params.toString()}`, { scroll: false });

    setOpen(false);
  };

  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="border-none outline-none">
        <Button className="hover:bg-foreground/20 bg-accent text-foreground/80 border-none text-lg font-light shadow-none outline-none">
          {model.label} <span className="text-foreground/40">/ {knowledgeBase.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 grid gap-2 bg-background border">
        <div className="col-span-2 font-thin text-sm pl-2 mt-2">Modeller</div>
        <DropdownMenuRadioGroup
          value={tempModel}
          onValueChange={(value) => setTempModel(value)}
          className="col-span-2 grid grid-cols-2 gap-2"
        >
          {gptModels.map((m) => (
            <DropdownMenuRadioItem
              onSelect={(e) => e.preventDefault()}
              key={m.id}
              value={m.id}
              className="text-center cursor-pointer flex flex-col items-start justify-start"
            >
              {m.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <div className="col-span-2 font-thin text-sm pl-2 mt-2">Kunnskapsbaser</div>
        <DropdownMenuRadioGroup
          value={tempKnowledgeBase}
          onValueChange={(value) => setTempKnowledgeBase(value)}
          className="col-span-2 grid grid-cols-2 gap-2"
        >
          {knowledgeBases.map((kb) => (
            <DropdownMenuRadioItem
              onSelect={(e) => e.preventDefault()}
              key={kb.id}
              value={kb.id}
              className="text-center cursor-pointer flex flex-col items-start justify-start"
            >
              {kb.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <div className="col-span-2 flex justify-end p-2">
          <Button onClick={handleSave} variant="outline" size="sm">
            Lagre
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
