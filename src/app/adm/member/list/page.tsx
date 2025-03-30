import { cookies } from "next/headers";

import client from "@/lib/backend/client";

import ClientPage from "./ClientPage";

type SearchParamsType = {
  searchKeywordType?: "all" | "username" | "nickname";
  searchKeyword?: string;
  pageSize?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const {
    searchKeyword = "",
    searchKeywordType = "all",
    pageSize: pageSizeStr = "30",
    page: pageStr = "1",
  } = await searchParams;

  const pageSize = parseInt(pageSizeStr);
  const page = parseInt(pageStr);

  const response = await client.get("/api/v1/adm/members", {
    params: {
      query: {
        searchKeyword,
        searchKeywordType,
        pageSize,
        page,
      },
    },
    headers: {
      cookie: cookies().toString(),
    },
  });

  const itemPage = response.data!;

  return (
    <>
      <ClientPage
        searchKeyword={searchKeyword}
        searchKeywordType={searchKeywordType}
        page={page}
        pageSize={pageSize}
        itemPage={itemPage}
      />
    </>
  );
}
