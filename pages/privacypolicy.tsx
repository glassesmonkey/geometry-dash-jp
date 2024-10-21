import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy: NextPage = () => {
  const { t } = useTranslation('privacy');

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t('meta.title')}</title>
        <link rel="canonical" href="https://geometrydashjp.com/privacypolicy" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Header />
      
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-left">
        <h1 className="text-4xl font-bold mt-10 mb-6">{t('title')}</h1>
        
        <div className="w-full max-w-4xl">
          <p className="mb-4">{t('intro')}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('contact.title')}</h2>
          <p>{t('contact.email')}: llc.evergreen.systems@gmail.com</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('info.title')}</h2>
          <p>{t('info.services')}:</p>
          <ul className="list-disc list-inside mb-4">
            <li>{t('info.payment')}</li>
            <li>{t('info.photos')}</li>
            <li>{t('info.email')}</li>
          </ul>
          <p>{t('info.accounts')}:</p>
          <ul className="list-disc list-inside mb-4">
            <li>{t('info.payment')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('lawful.title')}</h2>
          <p>{t('lawful.intro')}</p>
          <p>{t('lawful.rights')}</p>
          <ul className="list-disc list-inside mb-4">
            <li>{t('lawful.access')}</li>
            <li>{t('lawful.rectification')}</li>
            <li>{t('lawful.erasure')}</li>
            <li>{t('lawful.restriction')}</li>
            <li>{t('lawful.object')}</li>
            <li>{t('lawful.portability')}</li>
            <li>{t('lawful.withdraw')}</li>
          </ul>
          <p>{t('lawful.response')}</p>
          <p>{t('lawful.request')}</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('lawful.bases.title')}</h3>
          <p>{t('lawful.bases.services')}</p>
          <ul className="list-disc list-inside mb-4">
            <li>{t('lawful.bases.consent')}</li>
          </ul>
          <p>{t('lawful.bases.accounts')}</p>
          <ul className="list-disc list-inside mb-4">
            <li>{t('lawful.bases.consent')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('source.title')}</h2>
          <ul className="list-disc list-inside mb-4">
            <li>{t('source.direct')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('retention.title')}</h2>
          <p>{t('retention.intro')}</p>
          <ol className="list-decimal list-inside mb-4 space-y-2">
            <li>
              {t('retention.email.title')}:
              <ul className="list-disc list-inside ml-6">
                <li>{t('retention.email.period')}</li>
                <li>{t('retention.email.reason')}</li>
              </ul>
            </li>
            <li>
              {t('retention.avatar.title')}:
              <ul className="list-disc list-inside ml-6">
                <li>{t('retention.avatar.period')}</li>
                <li>{t('retention.avatar.reason')}</li>
              </ul>
            </li>
            <li>
              {t('retention.original.title')}:
              <ul className="list-disc list-inside ml-6">
                <li>{t('retention.original.period')}</li>
                <li>{t('retention.original.reason')}</li>
              </ul>
            </li>
            <li>
              {t('retention.processed.title')}:
              <ul className="list-disc list-inside ml-6">
                <li>{t('retention.processed.period')}</li>
                <li>{t('retention.processed.reason')}</li>
              </ul>
            </li>
            <li>
              {t('retention.payment.title')}:
              <ul className="list-disc list-inside ml-6">
                <li>{t('retention.payment.period')}</li>
                <li>{t('retention.payment.reason')}</li>
              </ul>
            </li>
          </ol>
          <p>{t('retention.deletion')}</p>
          <p>{t('retention.backups')}</p>
          <p>{t('retention.review')}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('sharing.title')}</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('sharing.processors')}</h3>
          <p>{t('sharing.list')}: cloudflare, replicate, neon, supabase, picsart, stripe</p>
          <p>{t('sharing.activities')}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('complaint.title')}</h2>
          <p>{t('complaint.intro')}</p>
          <p>{t('complaint.ico')}</p>
          <address className="mt-2">
            {t('complaint.address')}
          </address>
          <p className="mt-2">{t('complaint.helpline')}: 0303 123 1113</p>
          <p>{t('complaint.website')}: <a href="https://www.ico.org.uk/make-a-complaint" className="text-blue-600 hover:underline">https://www.ico.org.uk/make-a-complaint</a></p>
          
          <p className="mt-6">{t('lastUpdated')}: 14 September 2024</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'privacy'])),
  },
})

export default PrivacyPolicy;