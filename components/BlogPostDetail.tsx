import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PostDetail } from '../types/postdetail';

interface BlogPostDetailProps {
  post: PostDetail;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600">
          {post.author.image && (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
          )}
          <span>{post.author.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                   prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                   prose-p:text-gray-800 prose-p:leading-relaxed
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:font-semibold prose-strong:text-gray-900
                   prose-ul:list-disc prose-ul:pl-5
                   prose-ol:list-decimal prose-ol:pl-5
                   prose-li:my-2
                   prose-img:rounded-lg prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 text-center">
        <Link href="https://geometrydashjp.com" className="inline-block text-white font-semibold py-3 px-6 rounded-lg transition duration-300 gradient-button">
          Expand your Image Now!
        </Link>
      </div>

      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .gradient-button {
          background: linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #6a5acd);
          background-size: 300% 300%;
          animation: gradientAnimation 10s ease infinite;
        }
        .gradient-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </article>
  );
};

export default BlogPostDetail;