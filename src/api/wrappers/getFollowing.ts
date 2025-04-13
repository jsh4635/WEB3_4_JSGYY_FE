import { api } from "@/api";
import axios from "axios";

export interface FollowingParams {
  page: number;
  size: number;
  sort?: string;
}

export interface FollowingItem {
  followingId: number;
  nickname: string;
}

export interface FollowingPageInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  numberOfElements: number;
}

export interface FollowingResponse {
  following: {
    content: FollowingItem[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

export interface GetFollowingResult {
  followings: FollowingItem[];
  pageInfo: FollowingPageInfo;
}

export const getFollowing = async (
  params: FollowingParams,
): Promise<GetFollowingResult> => {
  try {
    const response = await api.getFollows({
      page: params.page,
      size: params.size,
      sort: params.sort || "id,desc",
    });

    // API 응답 형식에 맞춰 데이터 처리
    const responseData = response?.data as unknown as FollowingResponse;

    if (
      !responseData ||
      !responseData.following ||
      !responseData.following.content
    ) {
      return {
        followings: [],
        pageInfo: {
          pageNumber: params.page,
          pageSize: params.size,
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true,
          empty: true,
          numberOfElements: 0,
        },
      };
    }

    return {
      followings: responseData.following.content,
      pageInfo: {
        pageNumber: responseData.following.pageable.pageNumber,
        pageSize: responseData.following.pageable.pageSize,
        totalElements: responseData.following.totalElements,
        totalPages: responseData.following.totalPages,
        last: responseData.following.last,
        first: responseData.following.first,
        empty: responseData.following.empty,
        numberOfElements: responseData.following.numberOfElements,
      },
    };
  } catch (error) {
    // 404 에러는 팔로우가 없는 경우이므로 빈 결과 반환
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        followings: [],
        pageInfo: {
          pageNumber: params.page,
          pageSize: params.size,
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true,
          empty: true,
          numberOfElements: 0,
        },
      };
    }

    console.error("팔로잉 목록을 가져오는 중 오류 발생:", error);
    throw error;
  }
};
