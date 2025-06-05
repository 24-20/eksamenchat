import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <SidebarProvider>
      <main className=" flex w-screen">
        <AppSidebar />

        <SidebarTrigger className=" absolute p-2 hover:bg-foreground/20 m-2 " />
        <div className=" pt-2 bg-accent min-h-screen flex-grow flex justify-items-end flex-col ">
          {children}
        </div>

      </main>
    </SidebarProvider>
  )
}




//className=" bg-secondary w-screen md:w-[calc(100vw-250px)] h-screen md:ml-[250px]"
