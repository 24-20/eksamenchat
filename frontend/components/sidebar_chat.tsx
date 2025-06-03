// components/sidebar.tsx

"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet"; // Shadcn Sheet

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent side="left" className="w-64">
            {/* Your sidebar content here */}
            <div className="p-4">
              <h2 className="text-xl font-bold">Menu</h2>
              {/* Add your sidebar nav items */}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 h-full border-r bg-background">
          <div className="flex flex-col flex-1 p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            {/* Add your sidebar nav items */}
          </div>
        </div>
      </div>
    </>
  );
}

