// pages/billing.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface SubscriptionData {
  id: string;
  status: string;
  plan: string;
  //credits: number;
  currentPeriodEnd: string;
  amount: number;
  interval: string;
  intervalCount: number;
  cancelAtPeriodEnd: boolean;
  cancelAt: string | null;
  canceledAt: string | null;
}

const BillingPage: NextPage = () => {
  const { t } = useTranslation('billing');
  const router = useRouter();
  const { data: session } = useSession();
  const { locale, defaultLocale, pathname } = router;
  const canonicalUrl = `https://ai-hug.org${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchSubscriptionData();
    }
  }, [session]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      } else {
        throw new Error('Failed to fetch subscription data');
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setErrorMessage(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });

      if (response.ok) {
        await fetchSubscriptionData();
        setSuccessMessage(t('cancelSuccess'));
        // Clear the success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setErrorMessage(t('cancelError'));
      // Clear the error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">{t('loading')}</div>;
  }

  return (
    <div className='flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name='description' content={t('meta.description')} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Header />

      <main className='w-full flex flex-col items-center justify-center text-center px-4 mt-10 lg:mt-20'>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-full max-w-md" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-md" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <h2 className="text-3xl font-bold md:text-5xl mb-4">{t('title')}</h2>
          <p className="mt-4 text-sm text-gray-500 sm:text-base">{t('description')}</p>
        </div>

        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-gray-100 rounded-md p-10 w-full max-w-md mb-6">
              <h3 className="text-2xl font-bold mb-4">{subscription.plan}</h3>
              <p className="text-xl mb-2">
                ${subscription.amount / 100} / {subscription.intervalCount} {subscription.interval}{subscription.intervalCount > 1 ? 's' : ''}
              </p>
              {/* <p className="mb-2">
                {t('credits')}: <span className="font-bold">{subscription.credits}</span>
              </p> */}
              <p className="mb-2">
                {t('status')}: <span className="font-bold">{t(`subscriptionStatus.${subscription.status}`)}</span>
              </p>
              {subscription.cancelAtPeriodEnd ? (
                <p className="mb-4">
                  {t('cancelAtPeriodEnd', { date: new Date(subscription.currentPeriodEnd).toLocaleDateString() })}
                </p>
              ) : subscription.cancelAt ? (
                <p className="mb-4">
                  {t('cancelAt', { date: new Date(subscription.cancelAt).toLocaleDateString() })}
                </p>
              ) : (
                <p className="mb-4">
                  {t('renewalDate', { date: new Date(subscription.currentPeriodEnd).toLocaleDateString() })}
                </p>
              )}
              {subscription.canceledAt && (
                <p className="mb-4">
                  {t('canceledAt', { date: new Date(subscription.canceledAt).toLocaleDateString() })}
                </p>
              )}
              {!subscription.cancelAtPeriodEnd && subscription.status === 'active' && (
                <button
                  onClick={() => handleCancelSubscription(subscription.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  {t('cancelSubscription')}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="bg-gray-100 rounded-md p-10 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{t('noPlan')}</h3>
            <p className="mb-4">{t('noPlanDescription')}</p>
            <button
              onClick={() => router.push('/pricing')}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {t('viewPlans')}
            </button>
          </div>
        )}

        <div className="mt-12 w-full max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">{t('billingHistory')}</h3>
          {/* Implement billing history table here */}
          <p className="text-gray-500">{t('billingHistoryComingSoon')}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'billing'])),
    },
  };
};

export default BillingPage;