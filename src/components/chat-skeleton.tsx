import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3 max-w-[80%]">
      <Avatar className="h-9 w-9 bg-primary/10">
        <AvatarFallback className="bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </AvatarFallback>
      </Avatar>
      
      <Card className="py-2 px-4 bg-muted/50 border-muted">
        <div className="flex items-center space-x-2">
          <LoadingDot />
          <LoadingDot delay="150ms" />
          <LoadingDot delay="300ms" />
        </div>
      </Card>
    </div>
  );
}

interface LoadingDotProps {
  delay?: string;
}

function LoadingDot({ delay = "0ms" }: LoadingDotProps) {
  return (
    <span 
      className="block w-2 h-2 rounded-full bg-primary/70 animate-bounce" 
      style={{ animationDelay: delay }}
    />
  );
}
