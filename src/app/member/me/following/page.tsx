"use client";

import { api } from "@/api";
import { FollowingItem, getFollowing } from "@/api/wrappers/getFollowing";
import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";

import { useToast } from "@/hooks/use-toast";

import { UserMinus } from "lucide-react";

export default function FollowingPage() {
  const [followings, setFollowings] = useState<FollowingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [unfollowLoading, setUnfollowLoading] = useState<
    Record<number, boolean>
  >({});
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
    empty: true,
    numberOfElements: 0,
  });

  const { toast } = useToast();

  const fetchFollowings = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getFollowing({
        page,
        size: 10,
      });

      setFollowings(response.followings);
      setPageInfo(response.pageInfo);
      setCurrentPage(page);
    } catch (err) {
      console.error("팔로잉 목록을 가져오는 중 오류 발생:", err);
      setError(err instanceof Error ? err : new Error("알 수 없는 오류"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowings(0);
  }, [fetchFollowings]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchFollowings(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchFollowings],
  );

  const handleUnfollow = useCallback(
    async (followingId: number) => {
      try {
        setUnfollowLoading((prev) => ({ ...prev, [followingId]: true }));

        // 언팔로우 API 호출
        const followRequestDto = { followingId };
        await api.unFollow({ followRequestDto });

        // 목록에서 제거
        setFollowings((prev) =>
          prev.filter((item) => item.followingId !== followingId),
        );

        // 페이지 정보 업데이트 (총 항목 수 감소)
        if (pageInfo.totalElements > 0) {
          setPageInfo((prev) => ({
            ...prev,
            totalElements: prev.totalElements - 1,
          }));
        }

        // 알림 표시
        toast({
          title: "언팔로우 완료",
          description: "더 이상 해당 사용자를 팔로우하지 않습니다.",
          variant: "default",
        });
      } catch (error) {
        console.error("언팔로우 처리에 실패했습니다.", error);
        toast({
          title: "언팔로우 실패",
          description: "처리 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      } finally {
        setUnfollowLoading((prev) => ({ ...prev, [followingId]: false }));
      }
    },
    [pageInfo.totalElements, toast],
  );

  // 로딩 중 UI
  if (isLoading && followings.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">팔로잉 목록</h1>
          <Button variant="outline" asChild>
            <Link href="/member/me">돌아가기</Link>
          </Button>
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
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">팔로잉 목록</h1>
          <Button variant="outline" asChild>
            <Link href="/member/me">돌아가기</Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Text className="text-red-500 mb-4">
            팔로잉 목록을 불러오는 중 오류가 발생했습니다.
          </Text>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">팔로잉 목록</h1>
        <Button variant="outline" asChild>
          <Link href="/member/me">돌아가기</Link>
        </Button>
      </div>

      {/* 팔로잉 목록 */}
      {followings.length > 0 ? (
        <>
          <Card className="mb-8">
            <CardContent className="divide-y">
              {followings.map((following) => (
                <div
                  key={following.followingId}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src="/user.svg" alt={following.nickname} />
                    <div>
                      <Text className="font-medium">{following.nickname}</Text>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    onClick={() => handleUnfollow(following.followingId)}
                    disabled={unfollowLoading[following.followingId]}
                  >
                    {unfollowLoading[following.followingId] ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></span>
                        처리 중
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserMinus className="mr-2 h-4 w-4" />
                        언팔로우
                      </span>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

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
          <Text className="text-gray-500 mb-4">
            팔로우한 사용자가 없습니다.
          </Text>
          <Button asChild>
            <Link href="/">메인으로 가기</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
