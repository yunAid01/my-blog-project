// src/app/users/[id]/page.tsx
import PostCard from "@/components/PostCard";
import type { Post } from "@/types";

// User 타입을 확장해서 posts를 포함시킵니다.
type UserWithPosts = {
  id: number;
  email: string;
  posts: Post[];
}

// userParamsProps
interface UserParamsProps {
    params: {
        id: string;
    }
}

async function getUserWithPosts(id: string) {
  const response = await fetch(`http://localhost:3000/user/${id}`, { cache: 'no-store' });
  if (!response.ok) { 
    throw new Error('Failed to fetch user data');
 }
  return response.json();
}

export default async function UserProfilePage({ params }: UserParamsProps) {
  const user: UserWithPosts = await getUserWithPosts(params.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{user.email}님의 프로필</h1>
        <p className="text-gray-400 mb-8">
          총 {user.posts.length}개의 게시글을 작성했습니다.
        </p>

        <div className="flex flex-col gap-4">
          {user.posts.length > 0 ? (
            user.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p>작성한 게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}