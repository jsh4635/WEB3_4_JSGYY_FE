import { client } from "./client";
import { ApiResponse, ChatMessage, ChatRoom, PaginationParams } from "./types";

export const createChatRoom = async (sellerId: number, buyerId: number) => {
  const response = await client.post<ApiResponse<void>>("/chat/rooms", {
    sellerId,
    buyerId,
  });
  return response.data;
};

export const getChatRooms = async (userId: number) => {
  const response = await client.get<{ rooms: ChatRoom[] }>(
    `/chat/rooms/user/${userId}`,
  );
  return response.data;
};

export const deleteChatRoom = async (roomId: number) => {
  const response = await client.delete<ApiResponse<void>>(
    `/chat/rooms/${roomId}`,
  );
  return response.data;
};

export const sendMessage = async (roomId: number, content: string) => {
  const response = await client.post<ApiResponse<void>>(
    `/chat/rooms/${roomId}`,
    { content },
  );
  return response.data;
};

export const getMessages = async (roomId: number, params: PaginationParams) => {
  const response = await client.get<{ messages: ChatMessage[] }>(
    `/chat/rooms/${roomId}`,
    { params },
  );
  return response.data;
};

export const searchMessages = async (
  roomId: number,
  message: string,
  params: PaginationParams,
) => {
  const response = await client.get<{ messages: ChatMessage[] }>(
    `/chat/rooms/${roomId}`,
    {
      params: { ...params, message },
    },
  );
  return response.data;
};
