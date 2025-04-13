import { api } from "@/api";

export interface MyPostsParams {
  page: number;
  size: number;
  sort?: string;
}

export interface MyPost {
  id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  auctionStatus: boolean;
  place: string;
  createdAt: string;
  thumbnail: string | null;
}

export interface MyPostsPageInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  numberOfElements: number;
}

export interface MyPostsResponse {
  posts: MyPost[];
  pageInfo: MyPostsPageInfo;
}

export const getMyPosts = async (
  params: MyPostsParams,
): Promise<MyPostsResponse> => {
  try {
    const response = await api.getMyPosts({
      page: params.page,
      size: params.size,
      sort: params.sort || "id,desc",
    });

    // API 응답 구조에 맞게 데이터 가공
    const responseData = response?.data as
      | {
          content: Array<{
            id: number;
            title: string;
            price: number;
            saleStatus: boolean;
            auctionStatus: boolean;
            place: string;
            createdAt: string;
            thumbnail: string | null;
          }>;
          pageable: {
            pageNumber: number;
            pageSize: number;
          };
          totalElements: number;
          totalPages: number;
          last: boolean;
          first: boolean;
          empty: boolean;
          numberOfElements: number;
        }
      | undefined;

    if (!responseData) {
      throw new Error("API 응답 데이터가 없습니다.");
    }

    const posts = responseData.content.map((post) => ({
      id: post.id,
      title: post.title,
      price: post.price,
      saleStatus: post.saleStatus,
      auctionStatus: post.auctionStatus,
      place: post.place,
      createdAt: post.createdAt,
      thumbnail: post.thumbnail,
    }));

    const pageInfo: MyPostsPageInfo = {
      pageNumber: responseData.pageable.pageNumber,
      pageSize: responseData.pageable.pageSize,
      totalElements: responseData.totalElements,
      totalPages: responseData.totalPages,
      last: responseData.last,
      first: responseData.first,
      empty: responseData.empty,
      numberOfElements: responseData.numberOfElements,
    };

    return {
      posts,
      pageInfo,
    };
  } catch (error) {
    console.error("내 판매글을 가져오는 중 오류 발생:", error);
    throw error;
  }
};
