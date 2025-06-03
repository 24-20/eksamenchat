// components/navbar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      {/* Mobile Menu Button */}
      <div className="flex items-center">
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <span className="hidden lg:block font-bold text-lg">Your App</span>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center gap-4">
        {/* Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Model</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Empty dropdown items for now */}
            <DropdownMenuItem>Model 1</DropdownMenuItem>
            <DropdownMenuItem>Model 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Empty dropdown items for now */}
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

