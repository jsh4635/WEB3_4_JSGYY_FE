"use client";

import { useState } from "react";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (content.trim() && onSendMessage) {
      onSendMessage(content);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="메시지를 입력해 주세요"
          className="flex-1 p-2 border rounded-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`p-2 rounded-lg ${
            content.trim()
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={handleSend}
          disabled={!content.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
}
