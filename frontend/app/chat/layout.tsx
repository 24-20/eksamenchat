import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebarchat } from "@/components/sidebar_chat"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebarchat/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
