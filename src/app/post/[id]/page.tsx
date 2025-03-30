import { mockPostDetail } from "@/mocks/post_detail";
import { PostDetail } from "@/types/post";
import type { Metadata } from "next";

import ClientPage from "./ClientPage";

async function getPost(_id: string): Promise<PostDetail> {
  // 서버가 동작하지 않는 동안은 mock 데이터를 반환
  return mockPostDetail[parseInt(_id) - 1];

  // 서버 동작시 아래 코드 사용
  // const res = await client.GET("/api/v1/posts/{id}", {
  //   params: { id: _id },
  // });
  // return res.data;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: post.title,
    description: post.content,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return <ClientPage post={post} />;
}
