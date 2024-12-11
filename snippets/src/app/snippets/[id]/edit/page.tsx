import SnippetEditForm from "@/components/snippetEditForm";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface SnippetEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SnippetEditPage(props: SnippetEditPageProps) {
  const { id } = await props.params;

  const snippetId = parseInt(id);

  const snippet = await db.snippet.findFirst({
    where: {
      id: snippetId,
    },
  });

  if (!snippet) {
    notFound();
  }

  return <SnippetEditForm snippet={snippet} />;
}
