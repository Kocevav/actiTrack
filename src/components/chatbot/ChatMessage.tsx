import { Message } from "@/types/message";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs break-words w-fit ${
          message.isUser
            ? "bg-orange-500/90 text-white"               
            : "bg-neutral-900/90 border border-orange-400/10 text-neutral-200"  
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
