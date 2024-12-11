"use server";

import paths from "@/paths";
import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const term = formData.get("term");

  if (!term || typeof term !== "string") {
    redirect(paths.home());
  }

  redirect(`/search?term=${term}`);
}
