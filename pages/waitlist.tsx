import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession, signIn } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

const WaitlistPage: NextPage = () => {
  const { t } = useTranslation('waitlist');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const { locale, defaultLocale, pathname } = router;
  const canonicalUrl = `https://ai-hug.org${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const { data: session, status: sessionStatus } = useSession();

  const handleJoinWaitlist = async () => {
    if (sessionStatus === 'unauthenticated') {
      await signIn('google');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 重要：包含凭证
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>{t('waitlist.meta.title')}</title>
        <meta name='description' content={t('waitlist.meta.description')} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Header />

      <div className='flex flex-col lg:flex-row w-full items-center justify-between px-4 mt-10 lg:mt-20'>
        <main className='w-full lg:w-1/2 flex flex-col items-center justify-center text-center lg:text-left order-2 lg:order-1'>
          <h1 className='mx-auto lg:mx-0 max-w-4xl font-display text-4xl lg:text-5xl font-bold tracking-normal text-slate-900 sm:text-6xl lg:text-7xl'>
            {t('waitlist.title')}
          </h1>

          <p className='mx-auto lg:mx-0 mt-6 lg:mt-12 max-w-xl text-lg text-slate-700 leading-7'>
            {t('waitlist.description')}
          </p>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-yellow-800">
            <p>{t('waitlist.bonusOffer')}</p>
          </div>
          <div className='w-full max-w-md mt-8 lg:mt-10'>
            <button
              onClick={handleJoinWaitlist}
              disabled={status === 'submitting' || sessionStatus === 'loading'}
              className="w-full bg-orange-500 rounded-xl text-white font-medium px-4 py-3 hover:bg-orange-400 border-2 border-orange-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {sessionStatus === 'authenticated' ? t('waitlist.joinButton') : t('waitlist.loginAndJoinButton')}
            </button>
            {status === 'success' && (
              <p className="mt-2 text-green-600">{t('waitlist.successMessage')}</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-red-600">{t('waitlist.errorMessage', { error: errorMessage })}</p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'waitlist'])),
    },
  };
};

export default WaitlistPage;