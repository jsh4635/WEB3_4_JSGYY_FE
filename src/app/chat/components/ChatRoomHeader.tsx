"use client";

interface ChatRoomHeaderProps {
  nickname: string;
}

export default function ChatRoomHeader({ nickname }: ChatRoomHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="w-2"></div>
      <h2 className="text-lg font-semibold">{nickname}</h2>
    </div>
  );
}
