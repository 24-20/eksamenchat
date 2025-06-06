"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAppContext } from "@/app/app-context"

export function ModelDropdown() {
  const { knowledgeBase, setKnowledgeBase, model, setModel } = useAppContext();

  const knowledgeBases = [
    { id: "matte_r2", label: "Matte R2" },
    { id: "matte_r1", label: "Matte R1" },
    { id: "fysikk_ii", label: "Fysikk II" },
  ];

  const gptModels = [
    { id: "gpt_4", label: "GPT-4" },
    { id: "gpt_4o", label: "GPT-4o" },
    { id: "gpt_4_mini", label: "GPT-4 Mini" },
  ];

  const [tempKnowledgeBase, setTempKnowledgeBase] = React.useState(knowledgeBase.id);
  const [tempModel, setTempModel] = React.useState(model.id);

  const handleSave = () => {
    const selectedKB = knowledgeBases.find((kb) => kb.id === tempKnowledgeBase);
    const selectedModel = gptModels.find((m) => m.id === tempModel);

    if (selectedKB) setKnowledgeBase(selectedKB);
    if (selectedModel) setModel(selectedModel);

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
            <DropdownMenuRadioItem onSelect={e => e.preventDefault()} key={m.id} value={m.id} className="text-center cursor-pointer">
              {m.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <div className="col-span-2 font-thin text-sm pl-2">Kunnskapsbaser</div>
        <DropdownMenuRadioGroup
          value={tempKnowledgeBase}
          onValueChange={(value) => setTempKnowledgeBase(value)}
          className="col-span-2 grid grid-cols-2 gap-2"
        >
          {knowledgeBases.map((kb) => (
            <DropdownMenuRadioItem onSelect={e => e.preventDefault()} key={kb.id} value={kb.id} className="text-center cursor-pointer">
              {kb.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <div className="col-span-2 flex justify-end m-2">
          <Button onClick={handleSave} className=" bg-accent hover:bg-foreground/20 text-foreground">
            Lagre
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
