// src/components/PostGridItem.tsx
import Link from 'next/link';

interface PostGridItemProps {
    post: any;
}

export default function PostGridItem({ post }: PostGridItemProps) {
    return (
        <Link href={`/posts/${post.id}`}>
            {/* group 클래스를 이용해 마우스를 올렸을 때 자식 요소의 스타일을 제어합니다. */}
            <div className="relative aspect-square bg-gray-200 group cursor-pointer">
                {/* TODO: 나중에 실제 이미지로 교체할 영역입니다. */}
                <div className="w-full h-full bg-gray-300"></div>

                {/* 마우스를 올리면 나타나는 반투명 오버레이 */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white flex items-center space-x-4">
                        {/* 좋아요 수 */}
                        <div className="flex items-center space-x-1">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                            <span>{post.likes.length}</span>
                        </div>
                        {/* 댓글 수 */}
                        <div className="flex items-center space-x-1">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.864 8.864 0 01-4.083-.98L2 17l1.03-3.09A8.952 8.952 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 10a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" clipRule="evenodd"></path></svg>
                            <span>{post.comments.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}