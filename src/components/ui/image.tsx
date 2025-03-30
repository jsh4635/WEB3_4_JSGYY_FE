"use client";

import { useState } from "react";

import Image, { ImageProps } from "next/image";

type FallbackImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export function FallbackImage({
  src,
  fallbackSrc = "/noimage.png",
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
