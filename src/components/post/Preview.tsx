"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getDateHr } from "@/lib/business/utils";

import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/image";
import { H4, SmallText, Text } from "@/components/ui/typography";

// 업데이트된 Post 인터페이스
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

interface PreviewProps {
  post: Post;
}

export default function Preview({ post }: PreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [postState, setPostState] = useState(post);

  // props로 받은 post가 변경될 때 상태 업데이트
  useEffect(() => {
    setPostState(post);
  }, [post]);

  return (
    <Link href={`/post/${postState.id}`}>
      <Card
        className="h-full overflow-hidden cursor-pointer daangn-product-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          {postState.thumbnail ? (
            <FallbackImage
              src={postState.thumbnail}
              alt={postState.title}
              width={300}
              height={300}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <SmallText className="text-gray-400">이미지 없음</SmallText>
            </div>
          )}
        </div>

        <div className="p-3">
          <H4 className="text-base line-clamp-2 mb-1">{postState.title}</H4>
          <div className="flex items-center mb-1 whitespace-nowrap overflow-hidden">
            <SmallText className="truncate text-gray-500">
              {postState.place}
            </SmallText>
            <span className="mx-1 flex-shrink-0 text-gray-500">•</span>
            <SmallText className="flex-shrink-0 text-gray-500">
              {getDateHr(postState.createdAt)}
            </SmallText>
          </div>
          <Text className="font-semibold text-lg text-primary">
            {postState.price.toLocaleString()}원
          </Text>
        </div>
      </Card>
    </Link>
  );
}
