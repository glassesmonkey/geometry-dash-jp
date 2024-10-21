import React from 'react';
import Link from 'next/link';
import { Post } from '../types/post';
import { CTA } from '../types/postdetail';
import BlogPostList from './BlogPostList';

interface RelatedPostsAndCTAProps {
  relatedPosts: Post[];
  cta: CTA | null;
}

const RelatedPostsAndCTA: React.FC<RelatedPostsAndCTAProps> = ({ relatedPosts, cta }) => {
  return (
    <div className="mt-12">
      {relatedPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <BlogPostList posts={relatedPosts} />
        </section>
      )}

      {cta && (
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{cta.title}</h2>
          <p className="mb-4">{cta.description}</p>
          <Link href={`/cta/${cta.slug}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Learn More
          </Link>
        </section>
      )}
    </div>
  );
};

export default RelatedPostsAndCTA;