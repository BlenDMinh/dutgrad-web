import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3 max-w-[80%]">
      <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <div className="typing-dot"></div>
        <div className="typing-dot animation-delay-150"></div>
        <div className="typing-dot animation-delay-300"></div>
        <style jsx global>{`
          .typing-dot {
            @apply w-2 h-2 rounded-full bg-primary;
            animation: bounce 1s infinite;
          }
          .animation-delay-150 {
            animation-delay: 0.15s;
          }
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
