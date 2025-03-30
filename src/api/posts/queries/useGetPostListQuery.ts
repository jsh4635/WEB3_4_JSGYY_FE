import { getPosts } from "@/api/posts";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "./queryKey";

export const useGetPostListQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY.POSTS.LIST,
    queryFn: () =>
      getPosts({
        pageNum: 1,
        size: 10,
        keyword: "바지",
        place: "서울_관악구",
        sortBy: "createAt",
        order: "desc",
        category: "의류",
      }),
    select: (data) => data.content,
  });
};
