import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { appWithTranslation, useTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', 'G-XLBGHXEDT9', {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <SessionProvider session={session}>
      <PlausibleProvider domain={t('meta.siteName')}>
        <Head>
          <meta property='og:site_name' content={t('meta.siteName')} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='description' content={t('meta.description')} />
          <meta property='og:description' content={t('meta.ogDescription')} />
          <meta property='og:title' content={t('meta.ogTitle')} />
          <meta name='twitter:title' content={t('meta.twitterTitle')} />
          <meta name="_foundr" content="353201abecd90a09da511c8b98d698c6"></meta>
        </Head>
        <Component {...pageProps} />
      </PlausibleProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
