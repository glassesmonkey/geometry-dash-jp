import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../types/post';
import { useTranslation } from 'next-i18next';

interface BlogPostListSectionProps {
  posts: Post[];
}

const BlogPostListSection: React.FC<BlogPostListSectionProps> = ({ posts }) => {
  const { t } = useTranslation('common');

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <h2 className="text-3xl font-bold md:text-5xl">
          {t('blogPostList.title')}
        </h2>
        <p className="mb-8 mt-4 text-sm text-gray-500 sm:text-base md:mb-12 lg:mb-16">
          {t('blogPostList.description')}
        </p>
        <div className="mb-8 grid gap-0 sm:justify-items-stretch md:mb-12 md:grid-cols-2 md:gap-4 lg:mb-16 lg:gap-8">
          {posts.slice(0, 4).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="flex items-center gap-4 rounded-md p-4">
              <Image
                src={post.image || "https://via.placeholder.com/144x144"}
                alt={post.title}
                width={144}
                height={144}
                className="inline-block h-36 w-36 max-w-none flex-none object-cover"
              />
              <div className="flex flex-col items-start py-4">
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4 rounded-md bg-gray-100 px-2 py-1.5">
                    <p className="text-sm font-semibold text-blue-600">
                      {post.tags[0].name}
                    </p>
                  </div>
                )}
                <p className="mb-4 text-xl font-bold">
                  {post.title}
                </p>
                <div className="flex flex-col items-start text-sm text-gray-500 lg:flex-row lg:items-center">
                  <p className="mx-2 hidden lg:block">-</p>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/blog-post-list"
          className="mx-auto flex w-32 rounded-md bg-black px-6 py-3 text-center font-semibold text-white"
        >
          {t('blogPostList.viewMore')}
        </Link>
      </div>
    </section>
  );
};

export default BlogPostListSection;
