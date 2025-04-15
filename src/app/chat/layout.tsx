"use client";

import { api } from "@/api";
import ChatRoomList from "@/app/chat/components/ChatRoomList";
import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

// 소켓 서비스 import
import chatSocketService from "@/lib/socket";

// 채팅방 인터페이스 정의
interface ChatRoom {
  id: string;
  title: string;
  nickname: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount?: number;
}

// API 응답 타입 정의
interface ChatRoomResponse {
  id: number;
  title: string;
  nickname: string;
  lastMessage: string;
  unReadCount: number;
  updateAt?: string;
}

interface LoginMember {
  id: number;
  username?: string;
  name?: string;
  [key: string]: string | number | undefined;
}

interface ChatRoomsResponseData {
  rooms?: ChatRoomResponse[];
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      const response = await api.getChatRooms();

      if (response?.data) {
        // API 응답을 ChatRoom 인터페이스에 맞게 변환
        console.log("응답 데이터:", response.data);

        // response.data가 { rooms: [...] } 형태인지 확인
        const responseData = response.data as ChatRoomsResponseData;
        const roomsData =
          responseData.rooms || (response.data as ChatRoomResponse[]);

        if (!Array.isArray(roomsData)) {
          console.error("채팅방 데이터가 배열이 아닙니다:", roomsData);
          setChatRooms([]);
          setIsLoading(false);
          return;
        }

        // 디버깅: 첫 번째 채팅방의 lastMessage와 unReadCount 확인
        if (roomsData.length > 0) {
          console.log("첫 번째 채팅방 데이터:", roomsData[0]);
          console.log("lastMessage 타입:", typeof roomsData[0].lastMessage);
          console.log("lastMessage 값:", roomsData[0].lastMessage);
          console.log("unReadCount 타입:", typeof roomsData[0].unReadCount);
          console.log("unReadCount 값:", roomsData[0].unReadCount);
        }

        const rooms = roomsData.map((room: ChatRoomResponse) => ({
          id: String(room.id),
          title : room.title || "채팅방",
          nickname: room.nickname || room.title || "익명",
          lastMessage: room.lastMessage ? room.lastMessage : "",
          lastTimestamp: "",
          unreadCount: room.unReadCount,
        }));

        setChatRooms(rooms);

        // 채팅방이 있고 URL이 /chat 또는 /chat/room인 경우 첫번째 채팅방으로 이동
        if (
          rooms.length > 0 &&
          (pathname === "/chat" || pathname === "/chat/room")
        ) {
          router.push(`/chat/room/${rooms[0].id}`);
        }
      }
    } catch (error) {
      console.error("채팅방 목록 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 소켓 연결 (컴포넌트 마운트 시)
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // 이미 연결되어 있는지 확인
        if (chatSocketService.isConnected()) {
          console.log("레이아웃: 소켓이 이미 연결되어 있습니다.");
          setSocketConnected(true);
          return;
        }

        // 소켓 연결
        console.log("레이아웃: 소켓 연결 시도");
        await chatSocketService.connect();
        console.log("레이아웃: 소켓 연결 성공");
        setSocketConnected(true);
      } catch (error) {
        console.error("레이아웃: 소켓 연결 실패:", error);
      }
    };

    // 소켓 연결 및 채팅방 목록 가져오기
    initializeSocket().then(() => fetchChatRooms());

    // 컴포넌트 언마운트 시 구독만 해제 (연결은 유지)
    return () => {
      // 구독 중인 특정 채팅방이 있으면 해당 구독 해제
      if (selectedRoomId) {
        console.log(`레이아웃: 채팅방 ${selectedRoomId} 구독 해제`);
        chatSocketService.unsubscribeFromChatRoom(selectedRoomId);
      }

      // 소켓 연결 상태 추적을 위한 상태 변수만 리셋
      setSocketConnected(false);
    };
  }, []);

  useEffect(() => {
    if (!socketConnected || !selectedRoomId) return;

    const loginMemberStr = localStorage.getItem("loginMember");
    const loginMember = JSON.parse(loginMemberStr) as LoginMember;

    // 채팅방 구독
    console.log(`채팅방 ${selectedRoomId} 구독 시작`);
    chatSocketService.subscribeToChatRoom(
      selectedRoomId,
      (message) => {
        console.log("새 메시지 수신:", message);
        // 새 메시지 수신 시 채팅방 목록 새로고침
        fetchChatRooms();
      },
    );

    chatSocketService.subscribeToChatRoomList(
      loginMember.id,
      (chatRoomList) => {
        console.log("채팅방 목록 수신: ", chatRoomList);
        setChatRooms(chatRoomList);
      },
    );
    // 이전 구독 해제를 위한 클린업
    return () => {
      if (selectedRoomId) {
        console.log(`채팅방 ${selectedRoomId} 구독 해제`);
        chatSocketService.unsubscribeFromChatRoom(selectedRoomId);
      }
    };
  }, [selectedRoomId, socketConnected]);

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
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : chatRooms.length > 0 ? (
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
