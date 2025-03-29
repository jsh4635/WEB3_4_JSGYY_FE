import { mockProductDetail } from "@/mocks/product_detail";
import { ProductDetail } from "@/types/product";
import type { Metadata } from "next";

import ClientPage from "./ClientPage";

async function getPost(_id: string): Promise<ProductDetail> {
  // 서버가 동작하지 않는 동안은 mock 데이터를 반환
  return mockProductDetail[parseInt(_id) - 1];

  // 서버 동작시 아래 코드 사용
  // const res = await client.GET("/api/v1/products/{id}", {
  //   params: {
  //     path: {
  //       id: parseInt(id),
  //     },
  //   },
  //   headers: {
  //     cookie: (await cookies()).toString(),
  //   },
  // });

  // return res;
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
  const { id } = await params;
  const post = await getPost(id);

  return <ClientPage post={post} />;
}
