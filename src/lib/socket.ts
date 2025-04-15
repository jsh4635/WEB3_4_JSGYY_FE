// src/lib/socket.ts
import { Client, StompSubscription } from "@stomp/stompjs";
import axios from "axios";
import SockJS from "sockjs-client";

// 메시지 인터페이스 정의
interface Message {
  roomId: string;
  message: string;
  memberId: string;
  chatRoomId: string;
}

// 알림 인터페이스 정의
interface Notification {
  id: string;
  memberId: string;
  username: string;
  message: string;
  type: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  title: string;
  nickname: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount?: number;
}

// 채팅 메시지 인터페이스 정의
export interface ChatMessage {
  id: string;
  content: string;
  member_id: string;
  chatroom_id: string;
  timestamp: string;
  image_url?: string;
  profile_url?: string;
}

export interface ChatRoomList {
  id: string;
  title: string;
  nickname: string;
  lastMessage: string;
  unReadCount: number;
}
// loginMember 인터페이스 정의
interface LoginMember {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  [key: string]: string | undefined;
}

class ChatSocketService {
  private client: Client | null = null;
  private subscriptions: { [key: string]: StompSubscription } = {};
  private myMemberId: string | null = null;
  private connecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts: number = 0;
  private MAX_RECONNECT_ATTEMPTS: number = 5;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const loginMemberStr = localStorage.getItem("loginMember");
        if (loginMemberStr) {
          const loginMember = JSON.parse(loginMemberStr) as LoginMember;
          this.myMemberId = loginMember.id;
        }
      } catch (error) {
        console.error("로그인 정보 파싱 오류:", error);
        this.myMemberId = null;
      }
    }
  }

  // 연결 상태 확인 메서드
  isConnected(): boolean {
    return this.client !== null && this.client.active;
  }

  // 연결 중인지 확인하는 메서드
  isConnecting(): boolean {
    return this.connecting;
  }

  connect(): Promise<void> {
    // 이미 연결되어 있는 경우
    if (this.isConnected()) {
      console.log("이미 STOMP 클라이언트가 연결되어 있습니다.");
      return Promise.resolve();
    }

    // 이미 연결 시도 중인 경우, 진행 중인 Promise 반환
    if (this.connectionPromise && this.connecting) {
      console.log("소켓 연결 시도 중입니다. 기존 요청을 반환합니다.");
      return this.connectionPromise;
    }

    // 새로운 연결 시도
    this.connecting = true;
    this.connectionPromise = new Promise((resolve, reject) => {
      // 이전 연결 해제
      this.cleanupConnection();

      // const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const API_URL = "http://localhost:8080";
      console.log("소켓 연결 주소:", `${API_URL}/ws`);

      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        debug: () => {},
        connectHeaders: {
          Authorization:
            typeof window !== "undefined"
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
        },
        onConnect: () => {
          console.log("STOMP 연결 성공");
          this.connecting = false;
          this.reconnectAttempts = 0;

          // 로그인 정보가 있으면 알림 구독
          if (this.myMemberId) {
            this.subscribeToNotifications(this.myMemberId, (notification) => {
              console.log("알림 수신:", notification);
            });
          }

          resolve();
        },
        onStompError: (frame) => {
          console.error("STOMP 오류:", frame);
          this.connecting = false;
          reject(new Error(`STOMP Error: ${frame.headers.message}`));
        },
        onDisconnect: () => {
          console.log("STOMP 연결 해제됨");
          this.connecting = false;
        },
        onWebSocketClose: () => {
          console.log("WebSocket 연결 종료됨");
          this.connecting = false;
          this.tryReconnect();
        },
        onWebSocketError: (error) => {
          console.error("WebSocket 오류:", error);
          this.connecting = false;
        },
      });

      // 연결 활성화
      try {
        this.client.activate();
      } catch (error) {
        console.error("STOMP 활성화 중 오류:", error);
        this.connecting = false;
        reject(error);
      }
    });

    // 연결 시도 결과를 반환
    return this.connectionPromise.catch((error) => {
      this.connecting = false;
      this.connectionPromise = null;
      throw error;
    });
  }

  // 자동 재연결 시도
  private tryReconnect(): void {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.log("최대 재연결 시도 횟수에 도달했습니다.");
      return;
    }

    if (this.connecting) {
      console.log("이미 연결 시도 중입니다.");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `재연결 시도 중... (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`,
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("재연결 실패:", error);
      });
    }, 2000 * this.reconnectAttempts); // 지수적으로 대기 시간 증가
  }

  disconnect(): void {
    console.log("STOMP 클라이언트 연결 해제 요청");
    // 모든 구독 해제 및 연결 해제
    this.cleanupConnection();
    this.connecting = false;
    this.connectionPromise = null;
  }

  // 연결 및 구독 정리
  private cleanupConnection(): void {
    // 모든 구독 해제
    Object.values(this.subscriptions).forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn("구독 해제 중 오류:", error);
      }
    });
    this.subscriptions = {};

    // 클라이언트 연결 해제
    if (this.client) {
      try {
        if (this.client.active) {
          this.client.deactivate();
        }
      } catch (error) {
        console.warn("클라이언트 비활성화 중 오류:", error);
      }
      this.client = null;
    }
  }

  // 특정 채팅방 구독
  async subscribeToChatRoom(
    roomId: string,
    callback: (message: ChatMessage) => void,
  ): Promise<void> {
    // 연결이 없으면 먼저 연결 시도
    if (!this.isConnected()) {
      try {
        console.log("채팅방 구독 전 소켓 연결 시도");
        await this.connect();
      } catch (error) {
        console.error("채팅방 구독을 위한 소켓 연결 실패:", error);
        throw error;
      }
    }

    // 이미 구독 중인 경우 중복 구독 방지
    const subKey = `chat-${roomId}`;
    if (this.subscriptions[subKey]) {
      console.log(`이미 채팅방 ${roomId}에 구독 중입니다.`);
      return;
    }

    console.log(`채팅방 ${roomId} 구독 시작`);
    console.log("subscriptions", this.subscriptions);
    // 채팅방 구독
    try {
      this.subscriptions[subKey] = this.client!.subscribe(
        `/sub/chat/room/${roomId}`,
        (message) => {
          try {
            console.log("채팅방 메시지 수신:", message);
            console.log("채팅방 메시지:", message.body);
            const receivedMsg = JSON.parse(message.body) as ChatMessage;
            callback(receivedMsg);
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        },
      );
      console.log(`채팅방 ${roomId} 구독 성공`);
    } catch (error) {
      console.error(`채팅방 ${roomId} 구독 실패:`, error);
      throw error;
    }
  }

  async subscribeToChatRoomList(
    memberId: Number,
    callback: (message: ChatRoom[]) => void,
  ): Promise<void> {
    console.log("MemberId :", memberId);
    // 연결이 없으면 먼저 연결 시도
    if (!this.isConnected()) {
      try {
        console.log("채팅방 구독 전 소켓 연결 시도");
        await this.connect();
      } catch (error) {
        console.error("채팅방 구독을 위한 소켓 연결 실패:", error);
        throw error;
      }
    }

    // 이미 구독 중인 경우 중복 구독 방지
    const subRoomListKey = `chatroom-${memberId}`;
    console.log("ListKey", subRoomListKey);

    

    // 채팅방 목록 구독
    console.log(`채팅방 목록 ${memberId} 구독 시작`);
    try {
      this.subscriptions[subRoomListKey] = this.client!.subscribe(
        `/sub/chat/roomList/${memberId}`,
        (message) => {
          try {
            console.log("채팅방 목록 메시지 수신:", message);
            const receivedMsg = JSON.parse(message.body) as ChatRoom[];
            console.log("채팅방 목록 메시지:", receivedMsg);
            callback(receivedMsg);
          } catch (error) {
            console.error("채팅방 목록 메시지 파싱 오류:", error);
          }
        },
      );
      console.log(`채팅방 목록 ${memberId} 구독 성공`);
    } catch (error) {
      console.error(`채팅방 목록 ${memberId} 구독 실패:`, error);
      throw error;
    }
  }

  // 채팅방 구독 해제
  unsubscribeFromChatRoom(roomId: string): void {
    const subKey = `chat-${roomId}`;
    if (this.subscriptions[subKey]) {
      try {
        console.log(`채팅방 ${roomId} 구독 해제`);
        this.subscriptions[subKey].unsubscribe();
        delete this.subscriptions[subKey];
      } catch (error) {
        console.warn(`채팅방 ${roomId} 구독 해제 중 오류:`, error);
      }
    }
  }

  // 알림 구독
  async subscribeToNotifications(
    memberId: string,
    callback: (notification: Notification) => void,
  ): Promise<void> {
    // 연결이 없으면 먼저 연결 시도
    if (!this.isConnected()) {
      try {
        console.log("알림 구독 전 소켓 연결 시도");
        await this.connect();
      } catch (error) {
        console.error("알림 구독을 위한 소켓 연결 실패:", error);
        throw error;
      }
    }

    const subKey = `notification-${memberId}`;
    if (this.subscriptions[subKey]) {
      console.log(`이미 사용자 ${memberId}의 알림에 구독 중입니다.`);
      return;
    }

    console.log(`사용자 ${memberId}의 알림 구독 시작`);
    try {
      this.subscriptions[subKey] = this.client!.subscribe(
        `/sub/notification/${memberId}`,
        (message) => {
          try {
            const notification = JSON.parse(message.body) as Notification;
            callback(notification);
          } catch (error) {
            console.error("알림 파싱 오류:", error);
          }
        },
      );
      console.log(`사용자 ${memberId}의 알림 구독 성공`);
    } catch (error) {
      console.error(`사용자 ${memberId}의 알림 구독 실패:`, error);
      throw error;
    }
  }

  // 메시지 전송 (API 또는 WebSocket 사용)
  async sendMessage(message: Message): Promise<void> {
    const roomId = parseInt(message.roomId);
    const content = message.message;

    try {
      // 먼저 REST API로 메시지 전송 시도
      console.log(`API를 통해 채팅방 ${roomId}에 메시지 전송:`, content);

      // axios를 사용하여 직접 URL에 요청 보내기
      const API_URL = "http://localhost:8080";
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      await axios.post(
        `${API_URL}/pub/chat/message`,
        {
          roomId: message.roomId,
          message: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        },
      );

      console.log("API를 통한 메시지 전송 성공");
      return;
    } catch (apiError) {
      // API 호출 실패 시 WebSocket으로 시도
      console.warn(
        "API를 통한 메시지 전송 실패, WebSocket으로 시도:",
        apiError,
      );

      // 연결이 없으면 먼저 연결 시도
      if (!this.isConnected()) {
        try {
          console.log("메시지 전송 전 소켓 연결 시도");
          await this.connect();
        } catch (error) {
          console.error("메시지 전송을 위한 소켓 연결 실패:", error);
          throw error;
        }
      }

      try {
        console.log(
          `WebSocket을 통해 채팅방 ${message.roomId}에 메시지 전송:`,
          message.message,
        );
        this.client!.publish({
          destination: "/pub/chat/message",
          body: JSON.stringify(message),
        });
        console.log("WebSocket을 통한 메시지 전송 성공");
      } catch (socketError) {
        console.error("WebSocket을 통한 메시지 전송 실패:", socketError);
        throw socketError;
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const chatSocketService = new ChatSocketService();
export default chatSocketService;
