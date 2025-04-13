"use client";

import { api } from "@/api";
import { PostDetail } from "@/types/post";
import axios from "axios";
import { use, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { getDateHr } from "@/lib/business/utils";

import { LoginMemberContext } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/image";

import { useToast } from "@/hooks/use-toast";

import {
  AlertTriangle,
  Bell,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";

interface ApiResponse {
  data: PostDetail;
}

// API를 사용하여 게시글 상세 조회
const getPostDetail = async (id: number): Promise<PostDetail> => {
  try {
    // API 타입을 명시적으로 지정
    const response = (await api.getPost({
      postId: id,
    })) as unknown as ApiResponse;

    // API 응답이 없는 경우 에러 처리
    if (!response || !response.data) {
      throw new Error("API 응답이 없습니다");
    }

    return response.data;
  } catch (error) {
    console.error("게시글을 불러오는데 실패했습니다.", error);
    throw error;
  }
};

// 좋아요 토글 API 함수
const toggleLike = async (postId: number, isLiked: boolean): Promise<void> => {
  try {
    if (isLiked) {
      // 좋아요 취소
      await api.unlikePost({ postId });
    } else {
      // 좋아요 추가
      await api.likePost({ postId });
    }
  } catch (error) {
    console.error("좋아요 처리에 실패했습니다.", error);
    throw error;
  }
};

// 게시글 삭제 API 함수
const deletePost = async (postId: number): Promise<void> => {
  try {
    await api.deletePost({ postId });
  } catch (error) {
    console.error("게시글 삭제에 실패했습니다.", error);
    throw error;
  }
};

// 팔로우 상태 확인 API 함수
const checkFollowStatus = async (authorUsername: string): Promise<boolean> => {
  try {
    // getFollows API를 사용하여 현재 유저의 팔로우 목록을 가져옴
    const response = await api.getFollows({ page: 0, size: 100 });

    // 응답에 대한 타입 정의
    interface FollowItem {
      followingId: number;
      nickname: string;
    }

    interface FollowingData {
      content: FollowItem[];
    }

    interface FollowResponse {
      following: FollowingData;
    }

    // 응답 데이터가 있고 following.content 배열이 있는 경우
    const responseData = response?.data as unknown as FollowResponse;

    if (
      responseData?.following?.content &&
      Array.isArray(responseData.following.content)
    ) {
      // 팔로잉 목록에서 작성자와 일치하는 항목이 있는지 확인
      return responseData.following.content.some(
        (follow) =>
          follow.nickname === authorUsername ||
          follow.followingId.toString() === authorUsername,
      );
    }

    return false;
  } catch (error) {
    // 404 에러는 팔로우가 없는 경우이므로 무시
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // 404는 팔로우가 없음을 의미
    } else {
      console.error("팔로우 상태 확인에 실패했습니다.", error);
    }
    return false;
  }
};

// 팔로우/언팔로우 API 함수
const toggleFollow = async (
  targetId: number,
  isFollowing: boolean,
): Promise<void> => {
  try {
    const followRequestDto = { followingId: targetId };

    if (isFollowing) {
      // 이미 팔로우 중이면 언팔로우
      await api.unFollow({ followRequestDto });
    } else {
      // 팔로우하지 않았으면 팔로우
      await api.createFollow({ followRequestDto });
    }
  } catch (error) {
    console.error("팔로우 처리에 실패했습니다.", error);
    throw error;
  }
};

export default function ClientPage({ postId }: { postId: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const router = useRouter();
  const { loginMember } = use(LoginMemberContext);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPostDetail(postId);
        setPost(data);

        // 게시글 작성자가 아닌 경우에만 팔로우 상태 확인
        if (data.authorId !== loginMember.id) {
          // authorId로 팔로우 상태 확인
          const followStatus = await checkFollowStatus(
            data.authorId.toString(),
          );
          setIsFollowing(followStatus);
        }
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, loginMember.id]);

  // 좋아요 클릭 핸들러
  const handleLikeClick = async () => {
    if (!post || likeLoading) return;

    try {
      setLikeLoading(true);

      // API 호출
      await toggleLike(post.id, post.liked || false);

      // UI 상태 업데이트 (단순 +1/-1)
      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          liked: !prev.liked,
          likes: prev.liked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
        };
      });

      // 토스트 알림 표시
      toast({
        title: post.liked ? "찜 취소" : "찜 완료",
        description: post.liked
          ? "찜 목록에서 제거되었습니다."
          : "찜 목록에 추가되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("좋아요 처리에 실패했습니다.", error);
      toast({
        title: "오류 발생",
        description: "처리 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLikeLoading(false);
    }
  };

  // 게시글 삭제 핸들러
  const handleDeleteConfirm = async () => {
    if (!post || deleteLoading) return;

    try {
      setDeleteLoading(true);
      // API 호출하여 게시글 삭제
      await deletePost(post.id);

      // 토스트 알림 표시
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
        variant: "default",
      });

      // 다이얼로그 닫기
      setDeleteDialogOpen(false);

      // 삭제 성공 후 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("게시글 삭제에 실패했습니다.", error);
      toast({
        title: "삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 팔로우/언팔로우 클릭 핸들러
  const handleFollowClick = async () => {
    if (!post || followLoading) return;

    try {
      setFollowLoading(true);

      // post.authorId 사용
      const authorId = post.authorId;

      // API 호출
      await toggleFollow(authorId, isFollowing);

      // UI 상태 업데이트
      setIsFollowing((prev) => !prev);

      // 토스트 알림 표시
      toast({
        title: isFollowing ? "언팔로우 완료" : "팔로우 완료",
        description: isFollowing
          ? "더 이상 해당 사용자를 팔로우하지 않습니다."
          : "해당 사용자를 팔로우합니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("팔로우 처리에 실패했습니다.", error);
      toast({
        title: "오류 발생",
        description: "처리 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading || !post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAuthor = post.authorId === loginMember.id;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 상품 이미지 섹션 */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
              {post.images.length > 0 ? (
                <>
                  <FallbackImage
                    src={post.images[currentImageIndex]}
                    alt={post.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                        {post.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-white/70"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}
            </div>

            {/* 이미지 썸네일 (여러 장일 경우) */}
            {post.images.length > 1 && (
              <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
                {post.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`block w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${index === currentImageIndex ? "border-primary" : "border-transparent"}`}
                  >
                    <FallbackImage
                      src={image}
                      alt={`썸네일 ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 상품 정보 섹션 */}
          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {post.title}
            </h1>

            <p className="text-2xl font-semibold text-primary mb-4">
              {post.price.toLocaleString()}원
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Clock className="w-4 h-4" />
              <span>{getDateHr(post.createdAt)}</span>
              <span className="mx-1">•</span>
              <MapPin className="w-4 h-4" />
              <span>{post.place}</span>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <div className="whitespace-pre-line text-gray-700">
                {post.content}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${post.liked ? "text-red-500" : "text-gray-700"}`}
                onClick={handleLikeClick}
                disabled={likeLoading || isAuthor}
                title={
                  isAuthor ? "자신의 게시글은 찜할 수 없습니다" : undefined
                }
              >
                <Heart
                  className={`w-5 h-5 ${post.liked ? "fill-red-500" : ""}`}
                />
                <span>찜 {post.likes}</span>
              </Button>

              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700"
              >
                <Share2 className="w-5 h-5" />
                <span>공유</span>
              </Button>

              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 ml-auto"
              >
                <Bell className="w-5 h-5" />
                <span>신고</span>
              </Button>
            </div>

            {/* 판매자 정보 */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FallbackImage
                    src={"/user.svg"}
                    alt={loginMember.nickname}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    fallbackSrc="/user.svg"
                  />
                  <div>
                    <p className="font-medium">{loginMember.nickname}</p>
                    <p className="text-sm text-gray-500">{post.place}</p>
                  </div>
                </div>

                {/* 작성자가 아닌 경우에만 팔로우/언팔로우 버튼 표시 */}
                {!isAuthor && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollowClick}
                    disabled={followLoading}
                    className={
                      isFollowing
                        ? "text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                        : ""
                    }
                  >
                    {followLoading ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                        처리 중...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {isFollowing ? (
                          <>
                            <UserMinus className="mr-2 h-4 w-4" />
                            언팔로우
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            팔로우
                          </>
                        )}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* 작성자인 경우 수정/삭제 버튼, 아닌 경우 찜하기/채팅하기 버튼 */}
            {isAuthor ? (
              <div className="flex justify-end gap-3 mt-auto">
                <Button variant="outline" asChild>
                  <Link href={`/post/${post.id}/edit`}>수정하기</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleteLoading}
                >
                  <span className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제하기
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="daangnOutline"
                  className={`flex-1 ${post.liked ? "bg-red-50 text-red-600 border-red-200" : ""}`}
                  onClick={handleLikeClick}
                  disabled={likeLoading}
                  title="찜하기"
                >
                  {likeLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                      처리 중...
                    </span>
                  ) : (
                    <>
                      <Heart
                        className={`w-5 h-5 mr-2 ${post.liked ? "fill-red-500" : ""}`}
                      />
                      {post.liked ? "찜 취소" : "찜하기"}
                    </>
                  )}
                </Button>

                <Button variant="daangn" className="flex-1" asChild>
                  <Link
                    href="/chat"
                    className="flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    채팅하기
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              게시글 삭제
            </DialogTitle>
            <DialogDescription className="pt-3">
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="gap-2"
            >
              {deleteLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  삭제하기
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
