"use client";

import type React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import ChatSkeleton from "@/components/chat-skeleton";
import { chatService } from "@/services/api/chat.service";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatInterface() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const spaceId = params.id;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Validate session ID
  useEffect(() => {
    if (!sessionId) {
      toast.error(
        "No chat session found. Please start a new chat from the space page."
      );
    }
  }, [sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    // Add user message to the UI
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show loading state
    setIsLoading(true);

    try {
      // Call the API to get bot response
      const response = await chatService.askQuestion(Number(sessionId), input);

      // Add bot response to the UI
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-center p-4 bg-background">
        <div className="flex flex-col items-center">
          <Bot className="h-6 w-6 text-primary mb-1" />
          <h2 className="font-semibold">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">
            Ask me anything about this space
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold">Start a conversation</h3>
                <p className="max-w-md">
                  Send a message to begin chatting with the AI assistant about
                  documents in this space.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && <ChatSkeleton />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex space-x-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about the space documents..."
            className="flex-1"
            disabled={!sessionId || isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !sessionId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
