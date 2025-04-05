"use client";

import { PostDetail, createMockPost } from "@/types/post";
import { use, useEffect, useState } from "react";

import Link from "next/link";

import { getDateHr } from "@/lib/business/utils";

import { LoginMemberContext } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/image";

import {
  Bell,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";

// 상세 페이지용 모의 데이터 생성 함수
const getMockPostDetail = (id: number): PostDetail => {
  return {
    ...createMockPost({
      id,
      title: `모의 상품 ${id}`,
      price: Math.floor(Math.random() * 100000) + 5000,
      content: `이것은 모의 상품 ${id}의 상세 설명입니다. 당근마켓에서 판매하는 상품입니다.\n\n상품 상태: 새 상품에 가깝습니다.\n거래 방법: 직거래 우선, 택배 가능합니다.\n\n관심 있으신 분은 채팅 주세요!`,
      images: [
        `/placeholder-${(id % 5) + 1}.jpg`,
        `/placeholder-${((id + 1) % 5) + 1}.jpg`,
        `/placeholder-${((id + 2) % 5) + 1}.jpg`,
      ],
    }),
  };
};

export default function ClientPage({ postId }: { postId: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin, loginMember } = use(LoginMemberContext);

  useEffect(() => {
    // 모의 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setPost(getMockPostDetail(postId));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [postId]);

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
              className="flex items-center gap-2 text-gray-700"
            >
              <Heart className="w-5 h-5" />
              <span>찜 {post.likeCount}</span>
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
            <div className="flex items-center gap-3">
              <FallbackImage
                src={loginMember.profileImgUrl || "/user.svg"}
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
          </div>

          {/* 행동 버튼 */}
          <div className="flex gap-2 mt-auto">
            <Button variant="daangnOutline" className="flex-1">
              <Heart className="w-5 h-5 mr-2" />
              찜하기
            </Button>

            <Button variant="daangn" className="flex-1" asChild>
              <Link href="/chat" className="flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                채팅하기
              </Link>
            </Button>
          </div>

          {/* 관리자/작성자 기능 */}
          {(isAdmin || isAuthor) && (
            <div className="flex justify-end gap-3 mt-4">
              {isAuthor && (
                <Button variant="outline" asChild>
                  <Link href={`/post/${post.id}/edit`}>수정하기</Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                asChild
              >
                <Link href={`/post/${post.id}/delete`}>삭제하기</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
