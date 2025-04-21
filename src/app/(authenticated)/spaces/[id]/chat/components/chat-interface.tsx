"use client";

import type React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Bot,
  Send,
  ChevronDown,
  FileQuestion,
  Settings,
  Trash2,
  ZapIcon,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import ChatSkeleton from "@/components/chat-skeleton";
import { chatService } from "@/services/api/chat.service";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

interface ChatSession {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
  chat_histories: any[];
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

export default function ChatInterface() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");
  const spaceId = params.id;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isAtBottom]);

  useEffect(() => {
    if (!sessionId) {
      toast.error(
        "No chat session found. Please start a new chat from the space page."
      );
    }

    const handleScrollEvent = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 10;
        setIsAtBottom(isBottom);
      }
    };

    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScrollEvent);
      return () =>
        scrollElement.removeEventListener("scroll", handleScrollEvent);
    }
  }, [sessionId]);

  const fetchSessionHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      const response = await chatService.getRecentChat();

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
      setHistoryError("Failed to load chat history. Please try again.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSessionHistory();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    if (queryHistory.length === 0 || queryHistory[0] !== input.trim()) {
      setQueryHistory((prev) => [input.trim(), ...prev.slice(0, 49)]);
    }
    setHistoryIndex(-1); 

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAtBottom(true);

    setIsLoading(true);

    try {
      const response = await chatService.askQuestion(Number(sessionId), input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }

    if (e.key === "ArrowUp" && !e.shiftKey && input === "") {
      e.preventDefault();
      if (queryHistory.length > 0) {
        const newIndex =
          historyIndex + 1 < queryHistory.length
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(queryHistory[newIndex] || "");
      }
    }

    if (e.key === "ArrowDown" && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(queryHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const clearChat = () => {
    if (
      confirm(
        "Are you sure you want to clear the chat history? This cannot be undone."
      )
    ) {
      setMessages([]);
      toast.success("Chat cleared successfully");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  return (
    <div className="flex w-full">
      <div className="flex flex-col mx-5 mt-5 flex-1 bg-gradient-to-b from-background to-background/95 rounded">
        <Card className="rounded border-x-0 border-t-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">
                  Ask me about documents in this space
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={clearChat}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear chat history</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chat settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-[calc(100vh-18rem)]" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-[50vh] text-center"
                >
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                    <FileQuestion className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Start a conversation
                  </h3>
                  <p className="max-w-md text-muted-foreground mb-8">
                    Send a message to begin chatting with the AI assistant about
                    documents in this space.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "What documents are available in this space?",
                      "Can you summarize the key points from the latest document?",
                      "What are the main topics covered in these documents?",
                      "Find information about specific terms in these documents",
                    ].map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="text-sm justify-start h-auto py-3 px-4"
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                      >
                        <ZapIcon className="h-3.5 w-3.5 mr-2 text-primary" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatSkeleton />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {!isAtBottom && messages.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-10 w-10 p-0 shadow-lg"
                onClick={() => {
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setIsAtBottom(true);
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>

        <Card className="rounded-none border-x-0 border-b-0 shadow-lg">
          <CardContent className="p-4">
            <form
              onSubmit={handleSendMessage}
              className="flex space-x-2 w-full"
            >
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question... (Shift+Enter for new line, Up/Down for history)"
                  className="resize-none min-h-[60px] max-h-[150px] bg-background/50 focus-visible:ring-primary/30 pl-4 pr-12 py-3"
                  disabled={!sessionId || isLoading}
                />
                <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                  {historyIndex > -1 && (
                    <span>
                      History: {historyIndex + 1}/{queryHistory.length}
                    </span>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim() || !sessionId}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-all duration-200 h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="rounded hidden md:block w-72 border-l border-border bg-background/50 mt-5">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Chat History</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={fetchSessionHistory}
                    disabled={isLoadingHistory}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4",
                        isLoadingHistory && "animate-spin"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chat history..."
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoadingHistory ? (
                <div className="space-y-2 p-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-2">
                        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : historyError ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-red-500 mb-2">{historyError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={fetchSessionHistory}
                  >
                    Try Again
                  </Button>
                </div>
              ) : recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{
                      x: 3,
                      backgroundColor: "rgba(var(--muted) / 0.3)",
                    }}
                    className={cn(
                      "rounded-md p-2 cursor-pointer transition-colors",
                      Number(sessionId) === chat.id && "bg-accent"
                    )}
                    onClick={() =>
                      router.push(
                        `/spaces/${chat.spaceId}/chat?sessionId=${chat.id}`
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium truncate max-w-[120px]">
                            {chat.spaceName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(chat.timestamp)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {chat.lastMessageType === "human" ? "You: " : "AI: "}
                          {truncateText(chat.lastMessage, 60)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No chat history yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start a new conversation to see your history here
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
