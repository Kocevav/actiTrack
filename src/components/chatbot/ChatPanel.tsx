import { ChangeEvent, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/message";
import { Send } from "lucide-react";

interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleSendUserMessage = async () => {
    if (!userMessage.trim()) return;

    setIsSending(true);

    const tempUserMessage = userMessage;
    setUserMessage("");

    const userMessageObj: Message = {
      id: Date.now().toString(), // Simple ID for now
      text: tempUserMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessageObj]);

    console.log("Sending userMessage:", tempUserMessage);
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: tempUserMessage }),
      });

      if (response.ok) {
        const botResponse = await response.json();
        console.log("Bot response:", botResponse);

        const botMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse.message || "No response", // Assuming API returns { message: "..." }
          isUser: false,
          timestamp: new Date(),
        };

        setIsSending(false);
        setMessages((prevMessages) => [...prevMessages, botMessageObj]);
      }
    } catch (error) {
      setIsSending(false);
      setUserMessage(tempUserMessage);
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        fixed bottom-20 right-7 z-50
        h-150 w-100
        flex flex-col justify-between
        bg-white
        rounded-lg
        overflow-hidden
        transition-all duration-300
        ${
          isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-4"
        } `}
    >
      <div className="flex justify-between items-center p-3 border-b border-b-gray-300">
        <div className="flex items-center gap-2">
          <div>🤖</div>
          <span>ActiTrackAI</span>
        </div>

        <div className=" ">
          <button
            onClick={onClose}
            className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 overflow-x-hidden">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isSending && (
          <div className="mr-auto italic text-gray bg-orange-300 px-1 py-1 rounded-lg max-w-xs">
            Bot is typing...
          </div>
        )}
      </div>

      <div className="border-white border-2 flex justify-between  border-t border-t-gray-300 p-2">
        <input
          placeholder="Your message here..."
          className="flex-1 border-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          type="text"
          value={userMessage}
          onChange={handleChange}
        />
        <button
          disabled={isSending}
          onClick={handleSendUserMessage}
          className={`p-2 rounded-lg transition-colors ${
            isSending ? "cursor-not-allowed" : "hover:bg-orange-200 cursor-pointer"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
