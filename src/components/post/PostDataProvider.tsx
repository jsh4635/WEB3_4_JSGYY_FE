import { api } from "@/api";
// API에서 제공하는 DTO 타입
import React, { createContext, useContext, useEffect, useState } from "react";

// 검색용 DTO 타입 직접 정의
interface SearchRequestDTO {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  saleStatus?: boolean;
  keyword?: string;
  place?: string;
}

interface Post {
  id: number;
  title: string;
  place: string;
  price: number;
  saleStatus: boolean;
  auctionStatus: boolean;
  thumbnail: string | null;
  createdAt: string;
  likes?: number;
  liked?: boolean;
  chatCount?: number;
}

interface PageInfo {
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface PostDataContextType {
  posts: Post[];
  filteredPosts: Post[];
  isLoading: boolean;
  pageInfo: PageInfo;
  applyFilters: (filters: any) => void;
  refreshPosts: () => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
  currentPage: number;
}

const initialPageInfo: PageInfo = {
  totalPages: 0,
  totalElements: 0,
  last: true,
  size: 0,
  number: 0,
  first: true,
  numberOfElements: 0,
  empty: true,
};

const PostDataContext = createContext<PostDataContextType>({
  posts: [],
  filteredPosts: [],
  isLoading: true,
  pageInfo: initialPageInfo,
  applyFilters: () => {},
  refreshPosts: async () => {},
  fetchPage: async () => {},
  currentPage: 0,
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
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPageWithFilters = async (
    page: number,
    filterOptions: any = null,
  ) => {
    try {
      setIsLoading(true);

      const searchRequest: SearchRequestDTO = {
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        saleStatus: true,
        keyword: "",
        place: "",
      };

      // 필터가 있을 경우 적용
      if (filterOptions) {
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
      }

      const response = await api.getPosts({
        page: page,
        size: 8,
        sort: "createdAt,desc",
        searchRequest: searchRequest as any,
      });

      const responseData = response.data as any;
      if (responseData && responseData.content) {
        // API 응답에서 받은 게시글 데이터에 likes와 liked 필드가 없으면 기본값 추가
        const processedPosts = responseData.content.map((post: any) => ({
          ...post,
          likes: post.likes !== undefined ? post.likes : 0,
          liked: post.liked !== undefined ? post.liked : false,
          chatCount: post.chatCount || 0,
        }));

        setFilteredPosts(processedPosts);
        setPageInfo({
          totalPages: responseData.totalPages,
          totalElements: responseData.totalElements,
          last: responseData.last,
          size: responseData.size,
          number: responseData.number,
          first: responseData.first,
          numberOfElements: responseData.numberOfElements,
          empty: responseData.empty,
        });
        setCurrentPage(responseData.number);
      }
    } catch (error) {
      console.error("게시글 목록을 불러오는데 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    await fetchPageWithFilters(0);
  };

  useEffect(() => {
    // 실제 API 호출
    fetchPosts();
  }, []);

  const fetchPage = async (page: number) => {
    await fetchPageWithFilters(page, filters);
  };

  const refreshPosts = async () => {
    if (filters) {
      await fetchPageWithFilters(0, filters);
    } else {
      await fetchPosts();
    }
  };

  const applyFilters = async (filterOptions: any) => {
    setFilters(filterOptions);
    await fetchPageWithFilters(0, filterOptions);
  };

  return (
    <PostDataContext.Provider
      value={{
        posts,
        filteredPosts,
        isLoading,
        pageInfo,
        applyFilters,
        refreshPosts,
        fetchPage,
        currentPage,
      }}
    >
      {children}
    </PostDataContext.Provider>
  );
}
