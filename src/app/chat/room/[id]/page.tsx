"use client";

import { api } from "@/api";
import { MessageSearchDTO } from "@/api/generated/models";
import ChatRoomHeader from "@/app/chat/components/ChatRoomHeader";
import MessageInput from "@/app/chat/components/MessageInput";
import MessageList from "@/app/chat/components/MessageList";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import chatSocketService from "@/lib/socket";

// UI에 표시하기 위한 메시지 타입
interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isMine?: boolean;
  image_url?: string | null;
  profile_url?: string | null;
}

interface ChatRoomResponse {
  id: number;
  title: string;
  nickname: string;
  lastMessage: string;
  unReadCount: number;
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

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [myMemberId, setMyMemberId] = useState<number>(0);
  const [chatRoom, setChatRoom] = useState<ChatRoomResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loginMemberStr = localStorage.getItem("loginMember");
        if (loginMemberStr) {
          const loginMember = JSON.parse(loginMemberStr) as LoginMember;
          setMyMemberId(loginMember.id);
        } else {
          setError("로그인 정보를 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("로그인 정보 파싱 오류:", error);
        setError("로그인 정보를 불러올 수 없습니다");
      }
    }
  }, []);

  // 채팅방 정보 및 메시지 가져오기
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!roomId || !myMemberId) return;

      setIsLoading(true);
      try {
        // enterRoom API를 사용하여 채팅방 메시지를 가져옵니다
        const messageSearchDTO: MessageSearchDTO = {
          message: "",
          page: 0,
          size: 50,
        };

        await api.enterRoom({
          roomId: parseInt(roomId),
          messageSearchDTO,
        });

        // 채팅방 정보를 별도로 가져옵니다 (getChatRooms API를 통해)
        const roomsResponse = await api.getChatRooms();

        if (roomsResponse?.data) {
          // response.data가 { rooms: [...] } 형태인지 확인
          const responseData = roomsResponse.data as ChatRoomsResponseData;
          const roomsData =
            responseData.rooms || (roomsResponse.data as ChatRoomResponse[]);

          if (!Array.isArray(roomsData)) {
            console.error("채팅방 데이터가 배열이 아닙니다:", roomsData);
            router.push("/chat");
            return;
          }

          const currentRoom = roomsData.find(
            (room) => String(room.id) === roomId,
          );

          if (currentRoom) {
            setChatRoom(currentRoom);
          } else {
            router.push("/chat");
            return;
          }
        }

        // 메시지는 초기에는 빈 배열로 설정하고, WebSocket 연결을 통해 수신
        setMessages([]);
      } catch (error) {
        console.error("채팅방 데이터 가져오기 실패:", error);
        router.push("/chat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoomData();
  }, [roomId, myMemberId, router]);

  // 소켓으로 새 메시지 구독
  useEffect(() => {
    if (!roomId || !myMemberId) return;

    const subscribeToRoom = async () => {
      try {
        // 소켓이 연결되어 있지 않으면 연결 시도
        if (!chatSocketService.isConnected()) {
          console.log("채팅방: 소켓 연결이 필요합니다. 연결 시도 중...");
          await chatSocketService.connect();
        }

        // 채팅방 구독
        console.log(`채팅방: 채팅방 ${roomId} 구독 시도`);
        await chatSocketService.subscribeToChatRoom(roomId, (socketMessage) => {
          console.log("채팅방: 새 메시지 수신:", socketMessage);

          // 새로운 메시지 내용 확인
          if (!socketMessage || !socketMessage.content) {
            console.error("채팅방: 잘못된 메시지 형식:", socketMessage);
            return;
          }

          // 새로운 메시지를 화면에 추가
          const isMyMessage = Number(socketMessage.memberId) === myMemberId;
          console.log("MyMessage", isMyMessage);
          console.log("socketMessageId", socketMessage.memberId);
          console.log("myMemberId", myMemberId);
          if (!isMyMessage) {
            // 새로운 메시지를 화면에 추가
            const newMessage: ChatMessage = {
              id: String(socketMessage.id || Date.now()),
              sender:
                Number(socketMessage.member_id) === myMemberId
                  ? "나"
                  : chatRoom?.nickname || "익명",
              message: socketMessage.content || "",
              timestamp: formatTimestamp(
                socketMessage.timestamp || new Date().toISOString(),
              ),
              isMine: Number(socketMessage.member_id) === myMemberId,
            };

            setMessages((prev) => [...prev, newMessage]);
          }
        });

        await chatSocketService.subscribeToChatRoomList(
          myMemberId,
          (chatRoomList) => {
            console.log("채팅방 목록 수신: ", socketMessage);
          },
        );
        console.log(`채팅방: 채팅방 ${roomId} 구독 성공`);
      } catch (error) {
        console.error("채팅방: 채팅방 구독 실패:", error);
        setError("채팅방 연결에 실패했습니다. 다시 시도해 주세요.");
      }
    };

    subscribeToRoom();

    // 컴포넌트 언마운트 시 구독만 해제 (연결은 유지)
    return () => {
      console.log(`채팅방: 채팅방 ${roomId} 구독 해제`);
      chatSocketService.unsubscribeFromChatRoom(roomId);
    };
  }, [roomId, myMemberId, chatRoom]);

  // 타임스탬프 포맷팅 함수
  const formatTimestamp = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !roomId || !myMemberId) return;

    // 클라이언트 화면에 메시지 즉시 추가 (낙관적 UI 업데이트)
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "나",
      message,
      timestamp: formatTimestamp(new Date().toISOString()),
      isMine: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setError(null); // 이전 오류 메시지 제거

    try {
      console.log("채팅방: 메시지 전송 시도:", message);

      // 메시지 전송 (내부적으로 REST API 또는 WebSocket 사용)
      await chatSocketService.sendMessage({
        roomId,
        message,
        memberId: String(myMemberId),
        chatRoomId: roomId,
      });

      console.log("채팅방: 메시지 전송 성공");
    } catch (error) {
      console.error("채팅방: 메시지 전송 실패:", error);

      // 오류 시 낙관적으로 추가했던 메시지를 오류 상태로 표시
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id
            ? { ...msg, message: msg.message + " (전송 실패)" }
            : msg,
        ),
      );

      // 오류 메시지 표시
      setError("메시지 전송에 실패했습니다. 다시 시도해 주세요.");

      // 3초 후 오류 메시지 자동 제거
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">채팅방을 찾을 수 없습니다</div>
      </div>
    );
  }

  // 메시지 데이터 유효성 검사 및 필터링
  const validMessages = messages.filter(
    (msg) =>
      msg && typeof msg.message === "string" && msg.message.trim() !== "",
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      {/* 채팅방 헤더 */}
      <ChatRoomHeader nickname={chatRoom.nickname} />

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-16 inset-x-0 mx-auto w-fit bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-md z-10">
          <p className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* 채팅 메시지 */}
      {validMessages.length > 0 ? (
        <MessageList messages={validMessages} />
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
