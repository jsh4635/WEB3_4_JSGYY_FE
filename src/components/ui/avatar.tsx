import Image from "next/image";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function Avatar({ src, alt = "", size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        sizeMap[size],
        "bg-gray-200 rounded-full overflow-hidden",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "lg" ? 128 : size === "md" ? 96 : 64}
          height={size === "lg" ? 128 : size === "md" ? 96 : 64}
          className="w-full h-full object-cover"
        />
      ) : null}
    </div>
  );
}
