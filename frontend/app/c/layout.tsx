import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <SidebarProvider>
      <main className=" flex w-screen">
        <AppSidebar />

        <SidebarTrigger className=" absolute p-2 hover:bg-foreground/20 m-2 z-20 " />
        <div className=" pt-2 bg-accent min-h-screen flex-grow flex justify-items-end flex-col ">

          <nav className=" fixed z-10 h-12 p-2 pl-16 border-foreground/20 border-b-[1px] w-full">testing</nav>
          <div className="mt-16">
            {children}
          </div>
        </div>

      </main>
    </SidebarProvider>
  )
}




//className=" bg-secondary w-screen md:w-[calc(100vw-250px)] h-screen md:ml-[250px]"
