"use client";

import { Post } from "@/types/post";
import { formatDate } from "@/utils/date";
import { formatPrice } from "@/utils/price";

import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

interface PreviewProps {
  post: Post;
}

const Preview = ({ post }: PreviewProps) => {
  const { id, title, price, thumbnail, saleStatus, createdAt, likes, content } =
    post;

  return (
    <Link href={`/post/${id}`}>
      <div className="w-full cursor-pointer rounded-lg border border-gray-200 p-4 hover:shadow-md transition-box-shadow duration-200">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-end justify-between">
            <h3 className="text-sm font-medium text-gray-700 truncate overflow-hidden whitespace-nowrap">
              {title}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">{likes}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-mg font-bold text-gray-900 leading-none">
              {formatPrice(price)}원
            </p>
            <span className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Preview;
