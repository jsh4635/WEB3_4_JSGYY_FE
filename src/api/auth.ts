import { client } from "./client";
import { ApiResponse } from "./types";

interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  password2: string;
  nickname: string;
  email: string;
  phone_num: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface UserProfile {
  name: string;
  nickname: string;
  email: string;
  phone_num: string;
  created_at: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await client.post<ApiResponse<void>>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await client.post<ApiResponse<void>>("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await client.get<ApiResponse<void>>("/auth/logout");
  return response.data;
};

export const getMyProfile = async () => {
  const response =
    await client.get<ApiResponse<UserProfile>>("/member/mydetails");
  return response.data;
};

export const withdrawAccount = async () => {
  const response = await client.delete<ApiResponse<void>>("/member/withdrawal");
  return response.data;
};
