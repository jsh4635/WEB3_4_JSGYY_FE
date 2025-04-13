import ClientPage from "./ClientPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  return <ClientPage id={resolvedParams.id} />;
}
