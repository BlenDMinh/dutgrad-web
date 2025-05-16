"use client";

import type React from "react";
import { useParams, useSearchParams } from "next/navigation";
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
      return;
    }

    const loadChatHistory = async () => {
      try {
        setIsInitialLoading(true);
        const chatHistories = await chatService.getSessionChatHistory(
          Number(sessionId)
        );
        if (chatHistories && chatHistories.length > 0) {
          setMessages(
            chatHistories.map((message) => ({
              id: message.id,
              content: message.content,
              isUser: message.isUser,
              timestamp: new Date(message.timestamp),
              isTempMessage: false,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadChatHistory();
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading || !sessionId) {
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
        tempMessageIntervalRef.current = null;
      }
      return;
    }

    const initialTempMessage: Message = {
      id: "temp-" + Date.now(),
      content: "",
      isUser: false,
      timestamp: new Date(),
      isTempMessage: true,
    };
    setTempMessage(initialTempMessage);
    tempMessageIntervalRef.current = setInterval(async () => {
      try {
        const tempContent = await chatService.getTempMessage(Number(sessionId));

        if (tempContent !== null && tempContent !== undefined) {
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
        console.error("Failed to fetch temporary message:", error);
      }
    }, 1000);

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
      setTempMessage(null);
      if (tempMessageIntervalRef.current) {
        clearInterval(tempMessageIntervalRef.current);
        tempMessageIntervalRef.current = null;
      }
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;

    try {
      await chatService.clearChatHistory(Number(sessionId));
      setMessages([]);
      toast.success("Chat history cleared successfully");
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      toast.error("Failed to clear chat history. Please try again.");
    }
  };

  const createNewSession = async () => {
    if (!spaceId) return;

    try {
      const newSession = await chatService.beginChatSession(Number(spaceId));
      if (newSession && newSession.id) {
        toast.success("New chat session created");
        window.location.href = `/spaces/${spaceId}/chat?sessionId=${newSession.id}`;
      }
    } catch (error) {
      console.error("Failed to create new session:", error);
      toast.error("Failed to create new chat session. Please try again.");
    }
  };

  const displayMessages = tempMessage ? [...messages, tempMessage] : messages;
  return (
    <div className="flex w-full">
      <div className="flex flex-col mx-5 mt-5 flex-1 bg-gradient-to-b from-background to-background/95 rounded overflow-hidden">
        <ChatHeader onClearChat={clearChat} onNewChat={createNewSession} />

        <div className="flex-1 overflow-hidden w-full">
          <ChatMessages
            messages={displayMessages}
            isLoading={(isLoading && !tempMessage) || isInitialLoading}
            isAtBottom={isAtBottom}
            setIsAtBottom={setIsAtBottom}
            setInput={setInput}
            inputRef={inputRef}
          />
        </div>

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
