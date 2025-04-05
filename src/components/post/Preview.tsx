"use client";

import { Post } from "@/types/post";
import { useState } from "react";

import Link from "next/link";

import { getDateHr } from "@/lib/business/utils";

import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/image";
import { H4, SmallText, Text } from "@/components/ui/typography";

import { Heart, MessageCircle } from "lucide-react";

interface PreviewProps {
  post: Post;
}

export default function Preview({ post }: PreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => !prev);
    // 여기에 실제 좋아요 API 호출 로직 추가
  };

  return (
    <Link href={`/post/${post.id}`}>
      <Card
        className="h-full overflow-hidden cursor-pointer daangn-product-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          {post.images.length > 0 && (
            <FallbackImage
              src={post.images[0]}
              alt={post.title}
              width={300}
              height={300}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />
          )}
          {post.images.length === 0 && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <SmallText className="text-gray-400">이미지 없음</SmallText>
            </div>
          )}
        </div>

        <div className="p-3">
          <H4 className="text-base line-clamp-2 mb-1">{post.title}</H4>
          <div className="flex items-center mb-1 whitespace-nowrap overflow-hidden">
            <SmallText className="truncate text-gray-500">
              {post.place}
            </SmallText>
            <span className="mx-1 flex-shrink-0 text-gray-500">•</span>
            <SmallText className="flex-shrink-0 text-gray-500">
              {getDateHr(post.createdAt)}
            </SmallText>
          </div>
          <Text className="font-semibold text-lg text-primary">
            {post.price.toLocaleString()}원
          </Text>

          <div className="flex items-center mt-2">
            <button
              className="flex items-center mr-2 hover:text-primary transition-colors"
              onClick={handleLikeClick}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${liked ? "fill-primary text-primary" : ""}`}
              />
              <SmallText className="text-gray-500">{post.likeCount}</SmallText>
            </button>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <SmallText className="text-gray-500">
                {post.chatCount || 0}
              </SmallText>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
