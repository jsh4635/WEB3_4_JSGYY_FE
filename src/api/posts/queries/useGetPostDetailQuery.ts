import { mockPostDetail } from "@/mocks/post_detail";
import { PostDetail } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "./queryKey";

// 실제 API 호출 함수
const getPostDetail = async (postId: number): Promise<PostDetail> => {
  // 실제 환경에서는 API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPostDetail.find((item) => item.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }
      resolve(post);
    }, 500);
  });
};

export const useGetPostDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: QUERY_KEY.POSTS.DETAIL(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
  });
};
