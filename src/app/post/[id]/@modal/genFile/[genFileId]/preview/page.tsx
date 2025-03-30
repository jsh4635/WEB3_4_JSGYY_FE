import client from "@/lib/backend/client";

import ClientPage from "./ClientPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; genFileId: string }>;
}) {
  const { id, genFileId } = await params;

  const genFileResponse = await client.get(
    "/api/v1/posts/{postId}/genFiles/{id}",
    {
      params: {
        path: {
          postId: Number(id),
          id: Number(genFileId),
        },
      },
    },
  );

  if (genFileResponse.status !== 200) {
    return (
      <div className="flex-1 flex items-center justify-center">
        {genFileResponse.data.msg}
      </div>
    );
  }

  return <ClientPage id={id} genFile={genFileResponse.data} />;
}
