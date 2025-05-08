"use client";

import type React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import { chatService } from "@/services/api/chat.service";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTempMessage?: boolean;
};

export default function ChatInterface() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const spaceId = params.id;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [tempMessage, setTempMessage] = useState<Message | null>(null);
  const tempMessageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!sessionId) {
      toast.error(
        "No chat session found. Please start a new chat from the space page."
      );
    }
  }, [sessionId]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
      }
    };
  }, []);

  // Fetch temporary messages when loading
  useEffect(() => {
    if (!isLoading || !sessionId) {
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
        tempMessageIntervalRef.current = null;
      }
      return;
    }

    // Create initial temp message
    const initialTempMessage: Message = {
      id: "temp-" + Date.now(),
      content: "",
      isUser: false,
      timestamp: new Date(),
      isTempMessage: true,
    };
    setTempMessage(initialTempMessage);

    // Start polling for temp messages
    tempMessageIntervalRef.current = setInterval(async () => {
      try {
        const tempContent = await chatService.getTempMessage(Number(sessionId));

        if (tempContent !== null) {
          setTempMessage((prev) =>
            prev
              ? { ...prev, content: tempContent }
              : {
                  id: "temp-" + Date.now(),
                  content: tempContent,
                  isUser: false,
                  timestamp: new Date(),
                  isTempMessage: true,
                }
          );
        }
      } catch (error) {
        // Silently fail - no need to show errors during polling
        console.error("Failed to fetch temporary message:", error);
      }
    }, 5000);

    return () => {
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
      }
    };
  }, [isLoading, sessionId]);

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

      // Clear temporary message
      setTempMessage(null);

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
      // Clear temp message and interval
      setTempMessage(null);
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
        tempMessageIntervalRef.current = null;
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

  // Combine regular messages with temp message for display
  const displayMessages = tempMessage ? [...messages, tempMessage] : messages;

  return (
    <div key={sessionId} className="flex w-full">
      <div className="flex flex-col mx-5 mt-5 flex-1 bg-gradient-to-b from-background to-background/95 rounded">
        <ChatHeader onClearChat={clearChat} />

        <ChatMessages
          messages={displayMessages}
          isLoading={isLoading && !tempMessage}
          isAtBottom={isAtBottom}
          setIsAtBottom={setIsAtBottom}
          setInput={setInput}
          inputRef={inputRef}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          sessionId={sessionId}
          historyIndex={historyIndex}
          queryHistory={queryHistory}
          setHistoryIndex={setHistoryIndex}
        />
      </div>

      <ChatSidebar sessionId={sessionId} />
    </div>
  );
}
