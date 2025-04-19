"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth.context"
import {
  LayoutDashboard,
  User,
  LogOut,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Users,
  Sparkles,
  Plus,
  Bot,
  X,
  Search,
  Clock,
  BrainCircuit,
  RefreshCw,
} from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { APP_ROUTES } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { chatService } from "@/services/api/chat.service"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href?: string
    title: string
    icon: React.ReactNode
    badge?: string
    subItems?: {
      title: string
      href: string
      icon: React.ReactNode
      badge?: string
    }[]
  }[]
}

interface SidebarProps {
  isMobile?: boolean
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  id: number
  session_id: number
  message: {
    type: "human" | "ai"
    content: string
    tool_calls?: any[]
    additional_kwargs: Record<string, any>
    response_metadata: Record<string, any>
    invalid_tool_calls?: any[]
  }
  created_at: string
  updated_at: string
}

interface ChatSession {
  id: number
  user_id: number
  space_id: number
  created_at: string
  updated_at: string
  user: any
  space: any
  user_query: any
  chat_histories: ChatMessage[]
}

// Update the RecentChat interface to match the API response structure
interface RecentChat {
  id: number
  spaceId: number
  spaceName: string
  lastMessage: string
  lastMessageType: "human" | "ai"
  timestamp: string
}

// Function to format relative time
const getRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Function to truncate text
const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { logout, getAuthUser } = useAuth()
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false)
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const user = getAuthUser()

  isMobile = isMobile || typeof window !== "undefined" ? window.innerWidth < 768 : false

  const fetchRecentChats = async () => {
    if (isRecentChatsOpen) {
      try {
        setIsLoading(true)
        setError(null)
        const response = await chatService.getRecentChat()
        console.log(response)

        if (response && Array.isArray(response)) {
          const formattedChats = response.map((session: ChatSession) => {
            // Get the most recent message from chat_histories
            const chatHistories = session.chat_histories || []
            const lastChatMessage = chatHistories.length > 0 ? chatHistories[chatHistories.length - 1] : null

            // Extract the message content
            const lastMessageContent = lastChatMessage ? lastChatMessage.message.content : "No messages yet"

            // Determine the space name
            let spaceName = "Chat Session"
            if (session.space && session.space.name) {
              spaceName = session.space.name
            } else {
              spaceName = `Chat Session ${session.id}`
            }

            return {
              id: session.id,
              spaceId: session.space_id,
              spaceName: spaceName,
              lastMessage: lastMessageContent,
              lastMessageType: lastChatMessage?.message.type || "human",
              timestamp: lastChatMessage?.created_at || session.created_at,
            } as RecentChat
          })

          // Sort by most recent activity
          formattedChats.sort((a: RecentChat, b: RecentChat) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

          setRecentChats(formattedChats)
        }
      } catch (error) {
        console.error("Failed to fetch recent chats:", error)
        setError("Failed to load recent chats. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Update the useEffect hook to properly parse the API response
  useEffect(() => {
    fetchRecentChats()
  }, [isRecentChatsOpen])

  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: APP_ROUTES.DASHBOARD,
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "AI Spaces",
      icon: <BrainCircuit className="mr-2 h-4 w-4" />,
      badge: "New",
      subItems: [
        {
          title: "Create AI Space",
          href: APP_ROUTES.SPACES.CREATE,
          icon: <Plus className="mr-2 h-4 w-4" />,
        },
        {
          title: "Discover Spaces",
          href: APP_ROUTES.SPACES.PUBLIC,
          icon: <Sparkles className="mr-2 h-4 w-4" />,
        },
        {
          title: "My AI Spaces",
          href: APP_ROUTES.SPACES.MINE,
          icon: <MessageSquare className="mr-2 h-4 w-4" />,
        },
        {
          title: "Invitations",
          href: APP_ROUTES.MY_INVITATIONS,
          icon: <Users className="mr-2 h-4 w-4" />,
          badge: "3",
        },
      ],
    },
    {
      title: "Profile",
      href: APP_ROUTES.PROFILE,
      icon: <User className="mr-2 h-4 w-4" />,
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DUT Grad AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isMobile && (
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search AI spaces..." className="pl-9" />
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage alt="User" />
            <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.username || "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <button
            className="text-sm font-medium flex items-center hover:text-primary transition"
            onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
          >
            <Clock className="mr-2 h-4 w-4" />
            Recent AI Chats
            <span className="ml-2">
              {isRecentChatsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          </button>

          {isRecentChatsOpen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={fetchRecentChats}
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh chats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {isRecentChatsOpen && (
          <div className="space-y-2">
            {isLoading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))
            ) : error ? (
              <div className="text-center py-2 text-sm text-red-500">
                {error}
                <Button variant="link" size="sm" className="ml-2 h-auto p-0" onClick={fetchRecentChats}>
                  Retry
                </Button>
              </div>
            ) : recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/spaces/${chat.spaceId}/chat?sessionId=${chat.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{getRelativeTime(chat.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {chat.lastMessageType === "human" ? (
                        <span className="text-xs text-muted-foreground">You: </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">AI: </span>
                      )}
                      <p className="text-xs text-muted-foreground truncate">{truncateText(chat.lastMessage, 40)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">No recent chats found</div>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-2">
          <SidebarNav items={sidebarNavItems} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="destructive" className="w-full flex items-center justify-center" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="hidden md:block w-64 border-r h-screen overflow-hidden">
      <SidebarContent />
    </aside>
  )
}

export function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}

    items.forEach((item) => {
      if (item.subItems) {
        const shouldBeOpen = item.subItems.some((subItem) => pathname.startsWith(subItem.href))
        if (shouldBeOpen) {
          initialState[item.title] = true
        }
      }
    })

    return initialState
  })

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => (
        <div key={item.title}>
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              {item.icon}
              {item.title}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ) : (
            <div>
              <button
                onClick={() => toggleMenu(item.title)}
                className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              >
                {item.icon}
                {item.title}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto mr-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
                <span className={cn("ml-auto", item.badge && "ml-2")}>
                  {openMenus[item.title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              </button>
              {openMenus[item.title] && item.subItems && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                        pathname === subItem.href ? "bg-muted text-primary" : "transparent",
                      )}
                    >
                      {subItem.icon}
                      {subItem.title}
                      {subItem.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {subItem.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
