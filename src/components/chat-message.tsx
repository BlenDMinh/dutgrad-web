import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"

type MessageProps = {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
};

export default function ChatMessage({ message }: MessageProps) {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg ${
        message.isUser
          ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
          : "bg-muted max-w-[80%]"
      }`}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        {message.isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2">{children}</p>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-2">{children}</blockquote>
                ),
                code: ({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean; }) => {
                  const match = /language-(\w+)/.exec(className || "")
                  if (inline) {
                    return (
                      <code className="px-1 py-0.5 rounded bg-muted-foreground/20 text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <pre className="p-3 rounded-md bg-muted-foreground/20 overflow-auto my-2 font-mono text-sm">
                      <code {...props}>{children}</code>
                    </pre>
                  )
                },
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <span
          className={`text-xs ${
            message.isUser
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
