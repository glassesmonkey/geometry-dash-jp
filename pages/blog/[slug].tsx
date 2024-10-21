import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogPostDetail from '../../components/BlogPostDetail';
import RelatedPostsAndCTA from '../../components/RelatedPostsAndCTA';
import { PostDetailPageData } from '../../types/postdetail';
import { getWispClient } from '../../lib/wisp';

const BlogPostPage: NextPage<PostDetailPageData> = ({ post, relatedPosts, cta }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  const canonicalUrl = `https://ai-hug.org${locale === defaultLocale ? '' : `/${locale}`}/blog/${post.slug}`;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{post.title} - AI Hug</title>
        <meta name='description' content={post.description} />
        <link rel="canonical" href={canonicalUrl} />
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://ai-hug.org${l === defaultLocale ? '' : `/${l}`}/blog/${post.slug}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`https://ai-hug.org/blog/${post.slug}`} />
      </Head>

      <Header />

      <main className='flex-grow'>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogPostDetail post={post} />
          <RelatedPostsAndCTA relatedPosts={relatedPosts} cta={cta} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PostDetailPageData> = async ({ params, locale }) => {
  if (!params?.slug || typeof params.slug !== 'string') {
    return { notFound: true };
  }

  const wisp = await getWispClient();

  try {
    const postResult = await wisp.getPost(params.slug);
    const relatedPostsResult = await wisp.getPosts({ limit: 2 });
    const ctaResult = await wisp.getCtas({ slug: params.slug, limit: 1 });

    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
        post: postResult.post,
        relatedPosts: relatedPostsResult.posts,
        cta: ctaResult.ctas[0] || null,
      },
    };
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return { notFound: true };
  }
};

export default BlogPostPage;