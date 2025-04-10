"use client";

import Filter from "@/components/post/Filter";
import {
  PostDataProvider,
  usePostData,
} from "@/components/post/PostDataProvider";
import Preview from "@/components/post/Preview";
import { useCallback, useState } from "react";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { H2, H3, SmallText, Text } from "@/components/ui/typography";

import { Plus } from "lucide-react";

const ITEMS_PER_PAGE = 20;

function MainPageContent() {
  const [currentPage] = useState(1);
  const { isLogin } = useGlobalLoginMember();
  const { filteredPosts, isLoading } = usePostData();

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback(() => {
    // 임시로 비활성화된 함수
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // useCallback으로 메모이제이션하여 무한 렌더링 방지
  const handleFilterChange = useCallback(() => {
    // 임시로 비활성화된 함수
    // 필터 변경시 첫 페이지로 이동
  }, []);

  // 로딩 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <H2 className="mb-6 border-b-0">Bid & Buy 거래 플랫폼</H2>

      {isLogin && (
        <div className="flex justify-end mb-6">
          <Button asChild variant="daangn">
            <Link href="/post/create" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              상품 등록
            </Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* 사이드바 필터 */}
        <div className="md:w-64 flex-shrink-0">
          <H3 className="mb-4">필터</H3>
          <Filter
            onFilterChange={handleFilterChange}
            className="sticky top-6"
          />
        </div>

        {/* 상품 목록 */}
        <div className="flex-1">
          {currentItems.length > 0 ? (
            <>
              <H3 className="mb-4">상품 목록</H3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentItems.map((post) => (
                  <Preview key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="text-gray-500 mb-4">검색 결과가 없습니다</Text>
              <Button variant="outline" onClick={() => handleFilterChange()}>
                필터 초기화
              </Button>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange()}
                    className="px-3"
                  >
                    이전
                  </Button>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // 현재 페이지가 중앙에 오도록 페이지 번호 계산
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange()}
                      className="px-3"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange()}
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

      <SmallText className="text-center mt-8 text-muted-foreground">
        Bid & Buy에서 안전하게 중고 거래를 시작하세요.
      </SmallText>
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
