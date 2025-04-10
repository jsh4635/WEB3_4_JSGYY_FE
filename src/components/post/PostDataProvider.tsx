import { api } from "@/api";
import { PostSearchRequest } from "@/api/generated/models";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  createdAt: string;
  modifiedAt: string;
  images: string[];
  content: string;
  authorId: number;
  place: string;
  likeCount: number;
  chatCount?: number;
}

interface PostDataContextType {
  posts: Post[];
  filteredPosts: Post[];
  isLoading: boolean;
  applyFilters: (filters: any) => void;
}

const PostDataContext = createContext<PostDataContextType>({
  posts: [],
  filteredPosts: [],
  isLoading: true,
  applyFilters: () => {},
});

export const usePostData = () => useContext(PostDataContext);

interface PostDataProviderProps {
  children: React.ReactNode;
}

export function PostDataProvider({ children }: PostDataProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getPosts({
          pageable: {
            page: 0,
            size: 50,
            sort: [],
          },
          searchRequest: {},
        });

        // API 응답 구조에 맞게 데이터 처리
        const responseData = response.data as any;
        if (responseData && responseData.content) {
          setPosts(responseData.content);
          setFilteredPosts(responseData.content);
        }
      } catch (error) {
        console.error("게시글 목록을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const applyFilters = async (filters: any) => {
    if (!filters) {
      // 필터가 없으면 모든 게시글 표시
      try {
        setIsLoading(true);
        const response = await api.getPosts({
          pageable: {
            page: 0,
            size: 50,
            sort: [],
          },
          searchRequest: {},
        });

        const responseData = response.data as any;
        if (responseData && responseData.content) {
          setFilteredPosts(responseData.content);
        }
      } catch (error) {
        console.error("게시글 목록을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 필터링된 검색 요청
    try {
      setIsLoading(true);
      const searchRequest: PostSearchRequest = {};

      // 검색어 적용
      if (filters.query) {
        searchRequest.keyword = filters.query;
      }

      // 카테고리 적용
      if (
        filters.categories &&
        filters.categories.length > 0 &&
        !filters.categories.includes("all")
      ) {
        searchRequest.category = filters.categories[0];
      }

      // 가격 필터 적용
      if (filters.minPrice !== undefined) {
        searchRequest.minPrice = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        searchRequest.maxPrice = filters.maxPrice;
      }

      // 판매 상태 필터링
      if (filters.onlyAvailable) {
        searchRequest.saleStatus = true;
      }

      // 지역 필터링
      if (filters.place) {
        searchRequest.place = filters.place;
      }

      const response = await api.getPosts({
        pageable: {
          page: 0,
          size: 50,
          sort: [],
        },
        searchRequest,
      });

      const responseData = response.data as any;
      if (responseData && responseData.content) {
        setFilteredPosts(responseData.content);
      }
    } catch (error) {
      console.error("게시글 검색에 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostDataContext.Provider
      value={{
        posts,
        filteredPosts,
        isLoading,
        applyFilters,
      }}
    >
      {children}
    </PostDataContext.Provider>
  );
}
