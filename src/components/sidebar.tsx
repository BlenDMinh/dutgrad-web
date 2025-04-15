"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth.context";
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
} from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { APP_ROUTES } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href?: string;
    title: string;
    icon: React.ReactNode;
    badge?: string;
    subItems?: {
      title: string;
      href: string;
      icon: React.ReactNode;
      badge?: string;
    }[];
  }[];
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { logout, getAuthUser } = useAuth();
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  const user = getAuthUser();

  isMobile =
    isMobile || typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const recentChats = [
    {
      id: 1,
      name: "Web Dev Assistant",
      lastMessage: "How can I help with your code?",
    },
    { id: 2, name: "Math Tutor", lastMessage: "Let's solve that equation" },
    {
      id: 3,
      name: "Career Advisor",
      lastMessage: "Here are some job opportunities",
    },
  ];

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
  ];

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
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.username || "User"}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email || "user@example.com"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <button
          className="text-sm font-medium flex items-center w-full hover:text-primary transition"
          onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
        >
          <Clock className="mr-2 h-4 w-4" />
          Recent AI Chats
          <span className="ml-auto">
            {isRecentChatsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        </button>
        {isRecentChatsOpen && (
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{chat.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-2">
          <SidebarNav items={sidebarNavItems} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden md:block w-64 border-r h-screen overflow-hidden">
      <SidebarContent />
    </aside>
  );
}

export function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
  const initialState: Record<string, boolean> = {};

    items.forEach((item) => {
      if (item.subItems) {
        const shouldBeOpen = item.subItems.some((subItem) =>
          pathname.startsWith(subItem.href)
        );
        if (shouldBeOpen) {
          initialState[item.title] = true;
        }
      }
    });

    return initialState;
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => (
        <div key={item.title}>
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent"
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
                  {openMenus[item.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
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
                        pathname === subItem.href
                          ? "bg-muted text-primary"
                          : "transparent"
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
  );
}
