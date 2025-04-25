"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { APP_ROUTES } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { chatService } from "@/services/api/chat.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { UserTierInfo } from "./user/UserTierInfo";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideInLeft = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const slideInUp = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const animationState = {
  hasAnimated: false,
};

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

interface ChatMessage {
  id: number;
  session_id: number;
  message: {
    type: "human" | "ai";
    content: string;
    tool_calls?: any[];
    additional_kwargs: Record<string, any>;
    response_metadata: Record<string, any>;
    invalid_tool_calls?: any[];
  };
  created_at: string;
  updated_at: string;
}

interface ChatSession {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
  chat_histories: ChatMessage[];
}

interface RecentChat {
  id: number;
  spaceId: number;
  spaceName: string;
  lastMessage: string;
  lastMessageType: "human" | "ai";
  timestamp: string;
}

const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { logout, getAuthUser } = useAuth();
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = getAuthUser();
  const shouldReduceMotion = useReducedMotion();

  const [hasAnimated, setHasAnimated] = useState(animationState.hasAnimated);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      animationState.hasAnimated = true;
    }
  }, [hasAnimated]);

  isMobile =
    isMobile || typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const fetchRecentChats = async () => {
    if (isRecentChatsOpen) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await chatService.getRecentChat();
        console.log(response);

        if (response && Array.isArray(response)) {
          const formattedChats = response.map((session: ChatSession) => {
            const chatHistories = session.chat_histories || [];
            const lastChatMessage =
              chatHistories.length > 0
                ? chatHistories[chatHistories.length - 1]
                : null;

            const lastMessageContent = lastChatMessage
              ? lastChatMessage.message.content
              : "No messages yet";

            let spaceName = "Chat Session";
            if (session.space && session.space.name) {
              spaceName = session.space.name;
            } else {
              spaceName = `Chat Session ${session.id}`;
            }

            return {
              id: session.id,
              spaceId: session.space_id,
              spaceName: spaceName,
              lastMessage: lastMessageContent,
              lastMessageType: lastChatMessage?.message.type || "human",
              timestamp: lastChatMessage?.created_at || session.created_at,
            } as RecentChat;
          });

          formattedChats.sort(
            (a: RecentChat, b: RecentChat) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          setRecentChats(formattedChats);
        }
      } catch (error) {
        console.error("Failed to fetch recent chats:", error);
        setError("Failed to load recent chats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRecentChats();
  }, [isRecentChatsOpen]);

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

  const getInitialAnimationState = (forceDisable = false) => {
    if (shouldReduceMotion || hasAnimated || forceDisable) return "visible";
    return "hidden";
  };

  const SidebarContent = () => (
    <motion.div
      initial={getInitialAnimationState()}
      animate="visible"
      variants={fadeIn}
      className="flex flex-col h-full bg-background"
    >
      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        className="flex h-14 items-center justify-between border-b px-4"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <BrainCircuit className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.div
            initial={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xl font-bold"
          >
            DUT Grad AI
          </motion.div>
        </Link>
        <motion.div
          variants={fadeIn}
          initial={getInitialAnimationState()}
          animate="visible"
          className="flex items-center gap-2"
        >
          <ThemeToggle />
          {isMobile && (
            <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        className="p-4"
      >
        <motion.div
          initial={
            hasAnimated ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }
          }
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search AI spaces..."
            className="pl-9 transition-all duration-300 border-primary/20 focus:border-primary/60 hover:border-primary/40"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.2 }}
        className="p-4 border-b"
      >
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar>
              <AvatarImage alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex flex-col">
            <motion.span
              initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-medium"
            >
              {user?.username || "User"}
            </motion.span>
            <motion.span
              initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground"
            >
              {user?.email || "user@example.com"}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.3 }}
        className="p-4 border-b"
      >
        <div className="flex items-center justify-between mb-2">
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-medium flex items-center hover:text-primary transition"
            onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
          >
            <motion.div
              animate={{
                rotate: isRecentChatsOpen ? [0, 15, -15, 0] : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Clock className="mr-2 h-4 w-4" />
            </motion.div>
            Recent AI Chats
            <motion.span
              animate={{ rotate: isRecentChatsOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.span>
          </motion.button>

          {isRecentChatsOpen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={fetchRecentChats}
                      disabled={isLoading}
                    >
                      <RefreshCw
                        className={cn("h-4 w-4", isLoading && "animate-spin")}
                      />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh chats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <AnimatePresence>
          {isRecentChatsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-2 overflow-hidden"
            >
              {isLoading ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <motion.div
                        key={index}
                        variants={slideInUp}
                        className="flex items-center gap-3 p-2"
                      >
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2 text-sm text-red-500"
                >
                  {error}
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={fetchRecentChats}
                  >
                    Retry
                  </Button>
                </motion.div>
              ) : recentChats.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {recentChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      variants={slideInUp}
                      custom={index}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(var(--accent) / 0.3)",
                      }}
                      className="rounded-md transition-colors"
                    >
                      <Link
                        href={`/spaces/${chat.spaceId}/chat?sessionId=${chat.id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/40 transition-colors"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                        >
                          <Bot className="h-4 w-4 text-primary" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 * index }}
                              className="text-xs text-muted-foreground"
                            >
                              {getRelativeTime(chat.timestamp)}
                            </motion.p>
                          </div>
                          <div className="flex items-center gap-1">
                            {chat.lastMessageType === "human" ? (
                              <span className="text-xs text-muted-foreground">
                                You:{" "}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                AI:{" "}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground truncate">
                              {truncateText(chat.lastMessage, 40)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    animate={pulseAnimation}
                    className="text-center bg-primary/5 rounded-lg p-3"
                  >
                    <p className="text-sm text-muted-foreground">
                      No recent chats found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start a new conversation in any space
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.4 }}
        className="flex-1 overflow-y-auto"
      >
        <ScrollArea className="h-full">
          <motion.div
            variants={staggerContainer}
            initial={getInitialAnimationState()}
            animate="visible"
            className="flex flex-col gap-1 p-2"
          >
            <SidebarNav items={sidebarNavItems} hasAnimated={hasAnimated} />
          </motion.div>
        </ScrollArea>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.5 }}
        className="border-t p-4"
      >
        <UserTierInfo/>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center"
            onClick={() => logout()}
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.3 }}
            >
              <LogOut className="mr-2 h-4 w-4" />
            </motion.div>
            Log out
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
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
    <motion.aside
      initial={hasAnimated ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden md:block w-64 border-r h-screen overflow-hidden"
    >
      <SidebarContent />
    </motion.aside>
  );
}

export function SidebarNav({
  items,
  className,
  hasAnimated = false,
  ...props
}: SidebarNavProps & { hasAnimated?: boolean }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

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

  const getInitialAnimationState = () => {
    if (shouldReduceMotion || hasAnimated) return "visible";
    return "hidden";
  };

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          variants={slideInUp}
          initial={getInitialAnimationState()}
          animate="visible"
          custom={idx}
        >
          {item.href ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}>
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
                  <motion.div
                    initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.3 + idx * 0.1,
                    }}
                  >
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ) : (
            <div>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleMenu(item.title)}
                className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <motion.span
                  animate={
                    openMenus[item.title]
                      ? { rotate: [0, 10, -10, 0] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.span>
                {item.title}
                {item.badge && (
                  <motion.div
                    initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <Badge variant="secondary" className="ml-auto mr-2 text-xs">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
                <motion.span
                  animate={{ rotate: openMenus[item.title] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("ml-auto", item.badge && "ml-2")}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {openMenus[item.title] && item.subItems && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-6 mt-1 flex flex-col gap-1 overflow-hidden"
                  >
                    {item.subItems.map((subItem, subIdx) => (
                      <motion.div
                        key={subItem.href}
                        variants={slideInUp}
                        custom={subIdx}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ delay: 0.1 * subIdx }}
                      >
                        <Link
                          href={subItem.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                            pathname === subItem.href
                              ? "bg-muted text-primary"
                              : "transparent"
                          )}
                        >
                          <motion.span
                            animate={
                              pathname === subItem.href
                                ? { scale: [1, 1.2, 1] }
                                : { scale: 1 }
                            }
                            transition={{
                              duration: 0.5,
                              repeat: pathname === subItem.href ? 1 : 0,
                            }}
                          >
                            {subItem.icon}
                          </motion.span>
                          {subItem.title}
                          {subItem.badge && (
                            <motion.div
                              initial={
                                hasAnimated ? { scale: 1 } : { scale: 0 }
                              }
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                delay: 0.2 + subIdx * 0.1,
                              }}
                            >
                              <Badge
                                variant="secondary"
                                className="ml-auto text-xs"
                              >
                                {subItem.badge}
                              </Badge>
                            </motion.div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      ))}
    </nav>
  );
}
