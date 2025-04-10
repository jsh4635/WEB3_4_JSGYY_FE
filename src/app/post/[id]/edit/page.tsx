import { api } from "@/api";

import { cookies } from "next/headers";

import type { components } from "@/lib/backend/apiV1/schema";

import ClientPage from "./ClientPage";

type PostWithContentDto = components["schemas"]["PostWithContentDto"];

// MOCK_DATA 사용 여부 (true: 오류 발생 시 mockData 사용, false: 오류 그대로 반환)
const USE_MOCK_DATA = true;

// Mock 데이터
const mockPost: PostWithContentDto = {
  id: 1,
  createDate: new Date().toISOString(),
  modifyDate: new Date().toISOString(),
  authorId: 1,
  authorName: "사용자",
  authorProfileImgUrl: "https://via.placeholder.com/40",
  title: "아이폰 14 Pro 팝니다",
  content:
    "아이폰 14 Pro 그레이 256GB 입니다. 구매 후 1년 사용했고 상태 좋습니다.",
  published: true,
  listed: true,
  thumbnailImgUrl: "https://via.placeholder.com/400",
  actorCanModify: true,
  actorCanDelete: true,
};

async function getPost(id: string) {
  try {
    const res = await api.getPost(
      { postId: parseInt(id) },
      {
        headers: {
          cookie: (await cookies()).toString(),
        },
      },
    );

    return {
      status: 200,
      data: {
        data: res.data as PostWithContentDto,
      },
    };
  } catch (error) {
    console.error("포스트 조회 중 오류 발생:", error);

    // 오류 발생 시 mockData를 반환할지 여부 결정
    if (USE_MOCK_DATA) {
      console.log("Mock 데이터를 사용합니다.");
      return {
        status: 200,
        data: {
          data: { ...mockPost, id: parseInt(id) },
        },
      };
    }

    return {
      status: 500,
      data: {
        msg: "서버 오류가 발생했습니다.",
      },
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postResponse = await getPost(id);

  if (postResponse.status !== 200) {
    return (
      <div className="flex-1 flex items-center justify-center">
        {postResponse.data.msg}
      </div>
    );
  }

  const post = postResponse.data.data;

  if (post && post.actorCanModify === false) {
    return (
      <div className="flex-1 flex items-center justify-center">
        수정 권한이 없습니다.
      </div>
    );
  }

  return <ClientPage post={post} />;
}
