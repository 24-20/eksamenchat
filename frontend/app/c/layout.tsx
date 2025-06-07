import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModelDropdown } from "@/components/model-dropdown"
import LogoLink from "@/components/logo-link"
export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <SidebarProvider>
      <main className=" flex w-screen">
        <AppSidebar />

        <SidebarTrigger className=" absolute p-2 hover:bg-foreground/20 m-2 z-20 " />
        <div className=" pt-2 bg-accent min-h-screen flex-grow flex justify-items-end ">

          <nav className=" fixed z-10 h-12 p-2 pt-0 border-foreground/20 border-b-[1px] w-full flex pl-14 ">

            <div className=" max-w-2xl w-full flex items-center h-full justify-between ">
              < ModelDropdown />
              {/* <LogoLink /> */}
            </div>
          </nav>
          <div className="mt-16 flex justify-center w-full">
            <div className=" max-w-3xl w-full flex items-center justify-center h-[calc(100vh-100px)] overflow-scroll ">
              {children}
            </div>
          </div>
        </div>

      </main>
    </SidebarProvider>
  )
}




//className=" bg-secondary w-screen md:w-[calc(100vw-250px)] h-screen md:ml-[250px]"
