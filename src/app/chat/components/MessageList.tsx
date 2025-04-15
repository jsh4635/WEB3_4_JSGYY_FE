"use client";
import { api } from "@/api";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isMine?: boolean;
}

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 w-full ${message.isMine ? "flex-row-reverse" : ""}`}
        >
          {!message.isMine && <div className="w-2"></div>}
          <div
            className={`max-w-[70%] ${message.isMine ? "text-right" : "text-left"}`}
          >
            {!message.isMine && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{message.sender}</span>
              </div>
            )}
            <div
              className={`inline-block p-3 rounded-lg ${
                message.isMine
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-gray-100 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-line">{message.message}</p>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
