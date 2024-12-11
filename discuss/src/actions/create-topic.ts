"use server";

import { auth } from "@/auth";
import db from "@/db";
import paths from "@/paths";
import type { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicState,
  formData: FormData
): Promise<CreateTopicState> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ["You must be logged in to create a topic"] } };
  }

  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error: unknown) {
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

  // revalidate the homepage
  // has to be before redirect because redirect throws an error.
  revalidatePath(paths.home());

  redirect(paths.topicShow(topic.slug));
}
