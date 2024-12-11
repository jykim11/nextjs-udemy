"use client";

import * as actions from "@/actions";
import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const search = searchParams.get("term");

  return (
    <form action={actions.search}>
      <Input name="term" placeholder="Search" defaultValue={search || ""} />
    </form>
  );
}
