import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ClientPage from "./ClientPage";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const postId = parseInt(params.id, 10);

  // 실제 구현에서는 API를 호출하여 데이터를 가져옵니다.
  // 여기서는 모의 데이터를 위해 간단한 제목을 생성합니다.
  const title = `모의 상품 ${postId} | 당근마켓 스타일`;

  return {
    title,
    description: "당근마켓 스타일의 중고거래 상세 페이지입니다.",
  };
}

export default function Page({ params }: PageProps) {
  // URL 파라미터에서 ID 추출
  const postId = parseInt(params.id, 10);

  // 유효한 숫자가 아니면 404 페이지로 이동
  if (isNaN(postId) || postId <= 0) {
    notFound();
  }

  return <ClientPage postId={postId} />;
}
