import db from "@/db";
import type { Post } from "@prisma/client";

export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

// Another way to get the type of the first element of an array
// Awaited is a type utility that allows you to get the value of a Promise
// ReturnType is a type utility that allows you to get the return type of a function
// [number] is a type utility that allows you to get the first element of an array
export type PostWithData2 = Awaited<
  ReturnType<typeof fetchPostsByTopicSlug>
>[number];

export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: {
      topic: { slug },
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

export function fetchTopPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
    take: 5,
  });
}
