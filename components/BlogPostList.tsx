import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../types/post';

interface BlogPostListProps {
  posts: Post[];
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts }) => {
  return (
    <div className="mx-auto grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.id} className="flex flex-col items-start gap-4 pb-6 text-black sm:items-start">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-sm md:aspect-[16/8]">
            <Image
              src={post.image || "https://via.placeholder.com/800x400"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="absolute inline-block h-full w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-start gap-5 pt-4 md:gap-0 md:pt-0">
            {post.tags && post.tags.length > 0 && (
              <div className="rounded-md mb-1 bg-blue-50 px-2 py-1.5 text-sm font-medium uppercase text-blue-600">
                <p>{post.tags[0].name}</p>
              </div>
            )}
            <p className="mb-3 text-xl font-bold md:text-2xl">
              {post.title}
            </p>
            <div className="flex w-full flex-col justify-between gap-3 text-gray-500 sm:w-auto md:flex-row lg:items-center">
              {/* <p className="text-sm">By {post.author.name}</p> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 6 6"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                className="hidden h-1.5 w-1.5 items-center justify-center text-gray-500 lg:block"
              >
                <circle cx="3" cy="3" r="3" fill="currentColor"></circle>
              </svg>
              <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogPostList;