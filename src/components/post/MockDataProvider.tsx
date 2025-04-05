import { Post, createMockPosts } from "@/types/post";
import React, { createContext, useContext, useEffect, useState } from "react";

interface MockDataContextType {
  posts: Post[];
  filteredPosts: Post[];
  isLoading: boolean;
  applyFilters: (filters: any) => void;
}

const MockDataContext = createContext<MockDataContextType>({
  posts: [],
  filteredPosts: [],
  isLoading: true,
  applyFilters: () => {},
});

export const useMockData = () => useContext(MockDataContext);

interface MockDataProviderProps {
  children: React.ReactNode;
  initialPostCount?: number;
}

export function MockDataProvider({
  children,
  initialPostCount = 20,
}: MockDataProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 모의 데이터 생성을 시뮬레이션하기 위한 지연
    const timer = setTimeout(() => {
      const mockPosts = createMockPosts(initialPostCount);
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [initialPostCount]);

  const applyFilters = (filters: any) => {
    if (!filters) {
      setFilteredPosts(posts);
      return;
    }

    let results = [...posts];

    // 검색어 필터링
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.place.toLowerCase().includes(query),
      );
    }

    // 카테고리 필터링 (실제 구현에서는 카테고리 필드를 Post에 추가해야 함)
    if (
      filters.categories &&
      filters.categories.length > 0 &&
      !filters.categories.includes("all")
    ) {
      // 샘플 구현에서는 생략 (카테고리 필드가 없으므로)
    }

    // 가격 필터링
    if (filters.minPrice !== undefined) {
      results = results.filter((post) => post.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((post) => post.price <= filters.maxPrice);
    }

    // 판매 상태 필터링
    if (filters.onlyAvailable) {
      results = results.filter((post) => post.saleStatus);
    }

    setFilteredPosts(results);
  };

  return (
    <MockDataContext.Provider
      value={{
        posts,
        filteredPosts,
        isLoading,
        applyFilters,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}
