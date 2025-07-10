import { ChangeEvent, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/message";
import { Send } from "lucide-react";
import { X } from "lucide-react";

interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);

    const saved = localStorage.getItem("actiTrack-chat");
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("actiTrack-chat", JSON.stringify(messages));
    }
  }, [messages]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendUserMessage();
    }
  };

  const handleClear = () => {
    localStorage.removeItem("actiTrack-chat");
    setMessages([]);
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

  return (
    <div
      className={`
        fixed bottom-20 right-7 z-50
        h-150 w-100
        flex flex-col justify-between
        bg-white
        rounded-3xl
        overflow-hidden
        transition-all duration-300
        ${
          isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-4"
        } `}
    >
      <div className="flex justify-between items-center p-3 border-b border-b-gray-300">
        <div className="flex items-center gap-2">
          <div>🤖</div>
          <span className="font-bold text-xl">ActiBot</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="bg-gradient-to-r px-5 py-1 
            from-orange-500 to-orange-700 
            hover:from-orange-600 hover:to-orange-800 cursor-pointer hover:animate-bounce
            text-white font-semibold 
            rounded-xl shadow-lg c
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={handleClear}
          >
            Clear
          </button>

          <button
            onClick={onClose}
            className="
            hover:bg-gray-300 hover:animate-pulse 
            rounded-lg cursor-pointer
            transition-colors duration-300"
          >
            <X size={27} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 overflow-x-hidden">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isSending && (
          <div
            className="
          flex justify-start
          animate-bounce
          italic
          bg-neutral-900/90 border border-orange-400/10 text-neutral-200
          px-3 py-2 rounded-lg w-fit"
          >
            ActiBot is typing...
          </div>
        )}
      </div>

      <div className="border-white border-2 flex justify-between  border-t border-t-gray-300 p-2">
        <input
          placeholder="Your message here..."
          className="flex-1 border-none focus:outline-none"
          type="text"
          value={userMessage}
          onChange={handleChange}
          disabled={isSending}
          onKeyDown={handleKeyDown}
        />
        <button
          disabled={isSending}
          onClick={handleSendUserMessage}
          className={`p-2 rounded-lg transition-colors ${
            isSending
              ? "cursor-not-allowed"
              : "hover:bg-orange-200 cursor-pointer"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
