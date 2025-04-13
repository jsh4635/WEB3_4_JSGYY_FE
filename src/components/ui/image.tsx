"use client";

import { useMemo, useState } from "react";

import Image, { ImageProps } from "next/image";

// 랜덤 이미지 URL 목록
const FALLBACK_IMAGES = [
  "https://picsum.photos/id/10/300/300",
  "https://picsum.photos/id/20/300/300",
  "https://picsum.photos/id/30/300/300",
  "https://picsum.photos/id/40/300/300",
  "https://picsum.photos/id/50/300/300",
  "https://picsum.photos/id/60/300/300",
  "https://picsum.photos/id/70/300/300",
  "https://picsum.photos/id/80/300/300",
  "https://picsum.photos/id/90/300/300",
  "https://picsum.photos/id/100/300/300",
  "https://picsum.photos/id/110/300/300",
  "https://picsum.photos/id/120/300/300",
  "https://picsum.photos/id/130/300/300",
  "https://picsum.photos/id/140/300/300",
  "https://picsum.photos/id/160/300/300",
  "https://picsum.photos/id/170/300/300",
  "https://picsum.photos/id/180/300/300",
  "https://picsum.photos/id/190/300/300",
  "https://picsum.photos/id/200/300/300",
];

type FallbackImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
  useRandomFallback?: boolean;
};

export function FallbackImage({
  src,
  fallbackSrc = "/noimage.png",
  useRandomFallback = true,
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // 컴포넌트가 마운트될 때 한 번만 랜덤 이미지 선택
  const randomFallbackSrc = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[randomIndex];
  }, []);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(useRandomFallback ? randomFallbackSrc : fallbackSrc);
      }}
    />
  );
}
