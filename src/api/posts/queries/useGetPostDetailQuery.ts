import { getPostDetail } from "@/api/posts";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "./queryKey";

export const useGetPostDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: QUERY_KEY.POSTS.DETAIL(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
  });
};
