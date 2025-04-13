"use client";

import { MyPost, MyPostsPageInfo, getMyPosts } from "@/api/wrappers/getMyPosts";
import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SmallText, Text } from "@/components/ui/typography";

// 가격 형식화 함수
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 상태에 따른 배지 색상 및 텍스트
const STATUS_MAP: Record<string, { text: string; className: string }> = {
  true: { text: "판매중", className: "bg-green-100 text-green-800" },
  false: { text: "판매완료", className: "bg-gray-100 text-gray-800" },
};

function ProductCard({ post }: { post: MyPost }) {
  const [isHovered, setIsHovered] = useState(false);
  const status = STATUS_MAP[String(post.saleStatus)] || STATUS_MAP["true"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <Link href={`/post/${post.id}`}>
      <Card
        className="h-full overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          {post.thumbnail ? (
            <div className="w-full h-full bg-gray-200">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={300}
                height={300}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <SmallText className="text-gray-400">이미지 없음</SmallText>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${status.className}`}
            >
              {status.text}
            </span>
            {post.auctionStatus && (
              <span className="ml-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                경매
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <Text className="font-medium line-clamp-2">{post.title}</Text>
          <Text className="font-bold mt-1">{formatPrice(post.price)}원</Text>
          <SmallText className="text-gray-500 mt-1">
            {post.place} · {formatDate(post.createdAt)}
          </SmallText>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MyPostsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [pageInfo, setPageInfo] = useState<MyPostsPageInfo>({
    pageNumber: 0,
    pageSize: 8,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
    empty: true,
    numberOfElements: 0,
  });

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(0);

  // 서버에서 데이터 가져오기
  const fetchPage = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await getMyPosts({
        page: page,
        size: 8, // 페이지당 15개 항목
        sort: "id,desc", // 최신순 정렬
      });

      setPosts(data.posts);
      setPageInfo(data.pageInfo);
      setCurrentPage(page);
    } catch (err) {
      console.error("판매글을 불러오는 중 오류 발생:", err);
      setError(err instanceof Error ? err : new Error("알 수 없는 오류"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      fetchPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPage],
  );

  // 로딩 중 UI
  if (isLoading && posts.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">내 판매글</h1>
        </div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 에러 UI
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">내 판매글</h1>
        </div>
        <div className="text-center py-12">
          <Text className="text-red-500 mb-4">
            판매글을 불러오는 중 오류가 발생했습니다.
          </Text>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">내 판매글</h1>
        <Button asChild variant="daangn">
          <Link href="/post/create" className="flex items-center gap-2">
            상품 등록
          </Link>
        </Button>
      </div>

      {/* 상품 목록 */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>

          {/* 페이지네이션 */}
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 min-h-[486px]">
          <Text className="text-gray-500 mb-4">등록한 판매글이 없습니다.</Text>
          <Button asChild>
            <Link href="/post/create">판매글 작성하기</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
