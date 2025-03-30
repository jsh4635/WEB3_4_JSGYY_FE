"use client";

import { PostDetail } from "@/types/post";
import { use } from "react";

import Link from "next/link";

import { getDateHr } from "@/lib/business/utils";

import { LoginMemberContext } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/image";

import { Bell, Clock, Heart, MapPin } from "lucide-react";

export default function ClientPage({ post }: { post: PostDetail }) {
  const { isAdmin, loginMember } = use(LoginMemberContext);
  const isAuthor = post.authorId === loginMember.id;

  return (
    <main className="container mt-8 mx-auto px-4 max-w-[1200px]">
      <div className="flex flex-row gap-8">
        {/* 왼쪽 컬럼 - 이미지 및 판매자 정보 */}
        <div className="flex flex-col flex-1 gap-6">
          {/* 상품 이미지 섹션 */}
          <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
            {post.images.length > 0 && (
              <div>
                <FallbackImage
                  src={post.images[0]}
                  alt={post.images[0]}
                  width={400}
                  height={600}
                  className="w-full rounded-lg h-[600px] object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>

          {/* 판매자 정보 */}
          <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <FallbackImage
                src={loginMember.profileImgUrl || "/user.svg"}
                alt={loginMember.nickname}
                width={24}
                height={24}
                className="w-14 h-14 rounded-full border-2 border-indigo-100 object-cover shadow-sm"
                fallbackSrc="/user.svg"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {loginMember.nickname}
                </span>
                <span className="text-sm text-gray-500">
                  {loginMember.nickname}
                </span>
              </div>
              <Button
                variant="outline"
                className="ml-auto rounded-full bg-white hover:bg-indigo-50 border border-indigo-200 px-6 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                팔로우
              </Button>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 상품 정보 */}
        <div className="flex flex-col flex-1 gap-6 h-[730px]">
          <div className="flex flex-row items-start justify-between">
            {/* 가격 정보 */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {post.title}
              </h1>
              <p className="text-2xl font-semibold text-indigo-600">
                {post.price.toLocaleString()}원
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4" />
                <span>{getDateHr(post.createdAt)}</span>
                <span className="mx-1">•</span>
                <MapPin className="w-4 h-4" />
                <span>{post.place}</span>
              </div>
            </div>

            {/* 채팅 버튼 */}
            <Button
              className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              variant="outline"
              asChild
            >
              <Link href="/chat">채팅</Link>
            </Button>
          </div>
          <hr className="border-gray-200" />

          {/* 상호작용 버튼들 */}
          <div className="flex items-center gap-6 mt-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full px-4"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">{post.likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full px-4 ml-auto"
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium">신고하기</span>
            </Button>
          </div>

          {/* 관리자/작성자 기능 */}
          {(isAdmin || isAuthor) && (
            <div className="flex justify-end gap-3 mt-4">
              {isAuthor && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Link href={`/product/${post.id}/edit`}>수정하기</Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Link href={`/product/${post.id}/delete`}>삭제하기</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* 상품 정보 */}
      <div className=" flex-1 rounded-xl bg-white p-6 ">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">상품 정보</h2>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {post.content}
        </div>
      </div>
      <hr className="border-gray-200" />
    </main>
  );
}
