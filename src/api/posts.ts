import { Post, PostDetail } from "@/types/post";

import { client } from "./client";
import {
  ApiResponse,
  CreatePostRequest,
  PageableResponse,
  PostSearchParams,
  ReportRequest,
  UpdatePostRequest,
} from "./types";

export const getPosts = async (params: PostSearchParams) => {
  const response = await client.get<PageableResponse<Post>>("/posts", {
    params,
  });
  return response.data;
};

export const getPostDetail = async (postId: number) => {
  const response = await client.get<PostDetail>(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (data: CreatePostRequest) => {
  const response = await client.post<ApiResponse<void>>("/posts", data);
  return response.data;
};

export const updatePost = async (postId: number, data: UpdatePostRequest) => {
  const response = await client.put<ApiResponse<void>>(
    `/posts/${postId}`,
    data,
  );
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await client.delete<ApiResponse<void>>(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId: number) => {
  const response = await client.get<ApiResponse<void>>(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId: number) => {
  const response = await client.get<ApiResponse<void>>(
    `/posts/${postId}/unlike`,
  );
  return response.data;
};

export const reportPost = async (postId: number, data: ReportRequest) => {
  const response = await client.post<ApiResponse<void>>(
    `/posts/${postId}/reports`,
    data,
  );
  return response.data;
};
