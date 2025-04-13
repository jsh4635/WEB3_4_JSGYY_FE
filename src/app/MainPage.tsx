"use client";

import Filter from "@/components/post/Filter";
import {
  PostDataProvider,
  usePostData,
} from "@/components/post/PostDataProvider";
import Preview from "@/components/post/Preview";
import { useCallback } from "react";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

import { Plus } from "lucide-react";

function MainPageContent() {
  const { isLogin } = useGlobalLoginMember();
  const { filteredPosts, isLoading, pageInfo, fetchPage, currentPage } =
    usePostData();

  const handlePageChange = useCallback(
    (page: number) => {
      fetchPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPage],
  );

  const handleFilterChange = useCallback(() => {
    // 필터 변경 시 자동으로 첫 페이지로 돌아감 (PostDataProvider에서 처리)
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 flex-1">
      {isLogin && (
        <div className="flex justify-end mb-2">
          <Button asChild variant="daangn">
            <Link href="/post/create" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              상품 등록
            </Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <Filter
            onFilterChange={handleFilterChange}
            className="sticky top-6"
          />
        </div>

        <div className="flex-1">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPosts.map((post) => (
                <Preview key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 min-h-[486px]">
              <Text className="text-gray-500 mb-4">검색 결과가 없습니다</Text>
              <Button variant="outline" onClick={() => handleFilterChange()}>
                필터 초기화
              </Button>
            </div>
          )}

          {pageInfo.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                {currentPage > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3"
                  >
                    이전
                  </Button>
                )}

                {Array.from(
                  { length: Math.min(5, pageInfo.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pageInfo.totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage >= pageInfo.totalPages - 3) {
                      pageNum = pageInfo.totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="px-3"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  },
                )}

                {!pageInfo.last && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3"
                  >
                    다음
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  return (
    <PostDataProvider>
      <MainPageContent />
    </PostDataProvider>
  );
}
