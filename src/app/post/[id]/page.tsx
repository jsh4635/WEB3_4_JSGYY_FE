import { notFound } from "next/navigation";

import ClientPage from "./ClientPage";

interface PageProps {
  params: {
    id: string;
  };
}

// 페이지 컴포넌트를 async로 변경
export default async function Page({ params }: PageProps) {
  // params 객체를 await 후 id 추출
  const resolvedParams = await Promise.resolve(params);

  // URL 파라미터에서 ID 추출
  const postId = parseInt(resolvedParams.id, 10);

  // 유효한 숫자가 아니면 404 페이지로 이동
  if (isNaN(postId) || postId <= 0) {
    notFound();
  }

  return <ClientPage postId={postId} />;
}
