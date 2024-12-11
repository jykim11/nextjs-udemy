"use server";

import { auth } from "@/auth";
import db from "@/db";
import paths from "@/paths";
import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();

  if (!session || !session.user) {
    return { errors: { _form: ["You must be logged in to create a post"] } };
  }

  const topic = await db.topic.findFirst({
    where: { slug },
  });

  if (!topic) {
    return { errors: { _form: ["Topic not found"] } };
  }
  if (!session.user.id) {
    return { errors: { _form: ["User ID is required"] } };
  }

  let post: Post;

  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        topicId: topic.id,
        userId: session.user.id,
      },
    });
  } catch (error) {
    return {
      errors: {
        _form: [
          `Failed to create topic: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        ],
      },
    };
  }

  revalidatePath(paths.topicShow(topic.slug));
  redirect(paths.postShow(topic.slug, post.id));

  return { errors: {} };

  // TODO: revalidate the topic show page.
}
