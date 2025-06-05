import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" bg-secondary w-screen md:w-[calc(100vw-250px)] h-screen md:ml-[250px]">
        <SidebarTrigger className=" absolute p-2 hover:bg-foreground/20 m-2 " />
        {children}
      </main>
    </SidebarProvider>
  )
}
