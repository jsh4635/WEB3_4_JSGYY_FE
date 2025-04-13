"use client";

import ChatRoomHeader from "@/app/chat/components/ChatRoomHeader";
import MessageInput from "@/app/chat/components/MessageInput";
import MessageList from "@/app/chat/components/MessageList";
import { ApiMessage, getChatMessages } from "@/mocks/chat_messages";
import { getChatRoomById } from "@/mocks/chat_rooms";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isMine?: boolean;
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [myMemberId] = useState<number>(1); // 현재 로그인한 사용자 ID (실제로는 인증 상태에서 가져와야 함)

  const chatRoom = getChatRoomById(roomId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 유효한 채팅방 ID인지 확인
  useEffect(() => {
    if (!chatRoom) {
      router.push("/chat");
    }
  }, [roomId, router, chatRoom]);

  // 채팅방 ID에 따라 메시지 초기화
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      // mock 데이터에서 메시지 가져오기
      const sampleApiMessages: ApiMessage[] = getChatMessages(roomId);
      const convertedMessages = convertApiMessages(
        sampleApiMessages,
        myMemberId,
      );
      setMessages(convertedMessages);
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [roomId, myMemberId]);

  // API 메시지를 ChatMessage 형식으로 변환하는 함수
  const convertApiMessages = (
    apiMessages: ApiMessage[],
    currentMemberId: number,
  ): ChatMessage[] => {
    return apiMessages.map((msg) => ({
      id: String(msg.id),
      sender:
        msg.member_id === currentMemberId ? "나" : chatRoom?.nickname || "익명",
      message: msg.content,
      timestamp: formatTimestamp(msg.create_at),
      isMine: msg.member_id === currentMemberId,
    }));
  };

  // 타임스탬프 포맷팅 함수
  const formatTimestamp = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleSendMessage = (message: string) => {
    // 실제 애플리케이션에서는 API 호출로 메시지 전송
    // const newApiMessage = {
    //   member_id: myMemberId,
    //   chatroom_id: Number(roomId),
    //   content: message,
    //   create_at: new Date().toISOString()
    // };
    //
    // fetch(`/api/chatrooms/${roomId}/messages`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newApiMessage)
    // });

    // 클라이언트 화면에 메시지 즉시 추가 (낙관적 UI 업데이트)
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "나",
      message,
      timestamp: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      isMine: true,
    };

    setMessages([...messages, newMessage]);
  };

  if (!chatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">채팅방을 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* 채팅방 헤더 */}
      <ChatRoomHeader nickname={chatRoom.nickname} />

      {/* 채팅 메시지 */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : messages.length > 0 ? (
        <MessageList messages={messages} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          아직 대화 내용이 없습니다
        </div>
      )}

      {/* 메시지 입력창 */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
