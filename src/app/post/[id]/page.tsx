import { getPostDetail } from "@/api/posts";
import type { Metadata } from "next";

import ClientPage from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostDetail(Number(id));

  return {
    title: post.title,
    description: post.content,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostDetail(Number(id));

  return <ClientPage post={post} />;
}
