import paths from "@/paths";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    term: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = await searchParams;

  if (!term) {
    redirect(paths.home());
  }
  return <div>{term}</div>;
}
