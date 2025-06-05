import { SquarePenIcon, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Ny chat",
    url: "#",
    icon: SquarePenIcon,
  },

]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarContent className=" bg-background w-[250px]">

        <SidebarGroup className=" mt-8">
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup className="absolute bottom-0">
          <SidebarGroupContent className=" flex border-border border-t ">
            <div className="h-20 w-full p-4 flex items-center gap-2 ">
              <User />
              Aleksander Sivertsen
            </div>

          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}
