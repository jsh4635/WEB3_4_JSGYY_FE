export const QUERY_KEY = {
  POSTS: {
    LIST: ["posts", "list"],
    DETAIL: (id: number) => ["posts", "detail", id],
  },
} as const;
