import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPostList from '../components/BlogPostList';
import { Post } from '../types/post';
import { getWispClient } from '../lib/wisp';

interface BlogListPageProps {
  posts: Post[];
}

const BlogListPage: NextPage<BlogListPageProps> = ({ posts }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  const canonicalUrl = `https://ai-hug.org${locale === defaultLocale ? '' : `/${locale}`}/blog-post-list`;

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Blog Post List - AI Expand Image</title>
        <meta name='description' content="Discover how to extend image with our comprehensive guide. Learn step-by-step techniques, explore user-friendly tools, and master the art of AI-powered image creation. Elevate your content with AI expand image's innovative image production tutorials." />
        <link rel="canonical" href={canonicalUrl} />
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://flux1.one${l === defaultLocale ? '' : `/${l}`}/blog-post-list`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://flux1.one/blog-post-list" />
      </Head>

      <Header />

      <main className='flex-grow'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">AI Expand Image Blog Post List</h1>
          <p className="text-xl text-center text-gray-600 mb-12">All you need know about AIExpandImage</p>
          <BlogPostList posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<BlogListPageProps> = async ({ locale }) => {
  const wisp = await getWispClient();

  try {
    const postsResult = await wisp.getPosts({ limit: 20 }); // Adjust the limit as needed

    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
        posts: postsResult.posts,
      },
    };
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return { notFound: true };
  }
};

export default BlogListPage;