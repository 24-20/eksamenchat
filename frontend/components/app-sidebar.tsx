'use client';

import { SquarePenIcon, User, MoreHorizontal, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { fetchUserChats } from "@/app/actions/fetchchats"
import { deleteChat } from "@/app/actions/deletechat"
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Ny chat",
    url: "/c",
    icon: SquarePenIcon,
  },
]

interface Chat {
  id: string;
  title: string | null;
  created_at: string;
  user_id: string;
}

export function AppSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true);
      try {
        const result = await fetchUserChats();
        if (result.success) {
          setChats(result.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          console.error('Failed to fetch chats:', result.error);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleDeleteChat = async (chatId: string) => {
    setDeletingChatId(chatId);
    try {
      const result = await deleteChat(chatId);
      if (result.success) {
        // Remove the deleted chat from state
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        // If we're currently viewing this chat, redirect to new chat
        if (window.location.pathname.includes(chatId)) {
          router.push('/c/new');
        }
      } else {
        console.error('Failed to delete chat:', result.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setDeletingChatId(null);
    }
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className=" mt-8">
          <SidebarGroupLabel>Nylige chatter</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading chats...
                </div>
              ) : !isAuthenticated ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  User must be signed in to see chats
                </div>
              ) : chats.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No chats yet
                </div>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id} className="group">
                    <div className="flex items-center w-full">
                      <SidebarMenuButton asChild className="flex-1">
                        <a href={`/c/${chat.id}`} className="truncate">
                          <span className="truncate">{truncateTitle(chat.title ? chat.title : 'title loading...')}</span>
                        </a>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={deletingChatId === chat.id}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteChat(chat.id)}
                            className="text-destructive focus:text-destructive"
                            disabled={deletingChatId === chat.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingChatId === chat.id ? 'Deleting...' : 'Delete chat'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
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
