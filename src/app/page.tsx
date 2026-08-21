import { IMessageApp } from "@/components/IMessageApp";
import { getPublicMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const previewValue = params.preview;
  const preview =
    previewValue === "1" ||
    previewValue === "true" ||
    (Array.isArray(previewValue) && previewValue.includes("1"));
  const messages = await getPublicMessages();
  return <IMessageApp initialMessages={messages} preview={preview} />;
}
