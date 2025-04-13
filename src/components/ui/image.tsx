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

  // alt 문자열을 숫자로 변환하여 일관된 인덱스 생성
  const randomFallbackSrc = useMemo(() => {
    // alt 문자열에서 숫자 값 추출 (각 문자의 코드 합산)
    let altSum = 0;
    if (alt) {
      for (let i = 0; i < alt.length; i++) {
        altSum += alt.charCodeAt(i);
      }
    }
    // alt 값을 이용해 이미지 배열 길이로 나눈 나머지를 인덱스로 사용
    const index = altSum % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[index];
  }, [alt]);

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
