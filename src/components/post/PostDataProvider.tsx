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
  refreshPosts: () => Promise<void>;
}

const PostDataContext = createContext<PostDataContextType>({
  posts: [],
  filteredPosts: [],
  isLoading: true,
  applyFilters: () => {},
  refreshPosts: async () => {},
});

export const usePostData = () => useContext(PostDataContext);

interface PostDataProviderProps {
  children: React.ReactNode;
}

export function PostDataProvider({ children }: PostDataProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>(null);

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

  useEffect(() => {
    // 실제 API 호출
    fetchPosts();
  }, []);

  const refreshPosts = async () => {
    if (filters) {
      await applyFilters(filters);
    } else {
      await fetchPosts();
    }
  };

  const applyFilters = async (filterOptions: any) => {
    setFilters(filterOptions);

    if (!filterOptions) {
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
      if (filterOptions.query) {
        searchRequest.keyword = filterOptions.query;
      }

      // 카테고리 적용
      if (
        filterOptions.categories &&
        filterOptions.categories.length > 0 &&
        !filterOptions.categories.includes("all")
      ) {
        searchRequest.category = filterOptions.categories[0];
      }

      // 가격 필터 적용
      if (filterOptions.minPrice !== undefined) {
        searchRequest.minPrice = filterOptions.minPrice;
      }
      if (filterOptions.maxPrice !== undefined) {
        searchRequest.maxPrice = filterOptions.maxPrice;
      }

      // 판매 상태 필터링
      if (filterOptions.onlyAvailable) {
        searchRequest.saleStatus = true;
      }

      // 지역 필터링
      if (filterOptions.place) {
        searchRequest.place = filterOptions.place;
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
        refreshPosts,
      }}
    >
      {children}
    </PostDataContext.Provider>
  );
}
