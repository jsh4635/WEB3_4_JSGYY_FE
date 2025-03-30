import { PostDetail } from "@/types/post";

import { IMAGES } from "./images";
import { POST_LIST } from "./post_list";

export const mockPostDetail: PostDetail[] = POST_LIST.map((post) => {
  const images = IMAGES[post.id];
  return {
    id: post.id,
    title: post.title,
    content: `${post.title}입니다. 상태 좋습니다.`,
    images: images.map((img) => img.url),
    price: post.price,
    saleStatus: post.saleStatus,
    viewCount: Math.floor(Math.random() * 100),
    likeCount: Math.floor(Math.random() * 50),
    commentCount: Math.floor(Math.random() * 20),
    createdAt: post.createdAt,
    modifiedAt: post.createdAt,
    userId: post.userId,
  };
});
