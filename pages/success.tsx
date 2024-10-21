// pages/success.tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SuccessPage: NextPage = () => {
  const { t } = useTranslation('success');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady]);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className='flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name='description' content={t('meta.description')} />
      </Head>

      <Header />

      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-4xl font-bold mb-8'>{t('thankYou')}</h1>
        <p className='text-xl mb-8'>{t('paymentSuccessful')}</p>
        
        <button
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_URL}/ai-expand-image`)}
          className='bg-black text-white font-bold py-2 px-4 rounded mb-4'
        >
          {t('goToMainFeature')}
        </button>
      </main>

      <Footer />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'success'])),
    },
  };
};

export default SuccessPage;