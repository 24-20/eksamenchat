'use client'


import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/sidebar_chat"; // We'll define a Sidebar component
import { Navbar } from "@/components/navbar_chat";   // We'll define a Navbar component

export default function RootLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-muted p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

