"use client";
import { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-4 right-4 bg-orange-500
      text-white p-4 shadow-lg rounded-full hover:bg-orange-600 z-50"
    >
      {isOpen && <ChatPanel />}
    </button>
  );
}
