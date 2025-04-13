"use client";

import ChatRoomList from "@/app/chat/components/ChatRoomList";
import { chatRooms } from "@/mocks/chat_rooms";
import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string>("1");

  // 페이지 첫 로드 시 바로 첫 채팅방으로 리디렉션
  useEffect(() => {
    if (
      (pathname === "/chat" || pathname === "/chat/room") &&
      chatRooms.length > 0
    ) {
      router.push(`/chat/room/${chatRooms[0].id}`);
    }
  }, [pathname, router]);

  // URL 변경 시 선택된 채팅방 ID 업데이트
  useEffect(() => {
    const match = pathname.match(/\/chat\/room\/(\w+)$/);
    if (match && match[1]) {
      setSelectedRoomId(match[1]);
    }
  }, [pathname]);

  const handleRoomSelect = (roomId: string) => {
    if (roomId !== selectedRoomId) {
      router.push(`/chat/room/${roomId}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-108px)] w-full overflow-hidden">
      <div className="w-1/3 border-r min-w-[300px] overflow-y-auto">
        {chatRooms.length > 0 ? (
          <ChatRoomList
            chatRooms={chatRooms}
            selectedRoomId={selectedRoomId}
            onRoomSelect={handleRoomSelect}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            채팅 목록이 존재하지 않습니다
          </div>
        )}
      </div>

      <div className="flex-1 flex h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
