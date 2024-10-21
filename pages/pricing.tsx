import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingPage: NextPage = () => {
  const { t } = useTranslation('pricing');
  const router = useRouter();
  const { data: session } = useSession();
  const { locale, defaultLocale, pathname } = router;
  const canonicalUrl = `https://ai-hug.org${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const [activePlanType, setActivePlanType] = useState("subscription");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const oneTimePurchase = {
    id: 'oneTime',
    name: 'One-Time',
    price: 5.9,
    credits: 5,
    pricePerCredit: 1.2,
  };

  const subscriptionPlans = [
    {
      id: 'base',
      name: 'Base',
      price: 9.99,
      credits: 100,
      pricePerCredit: 0.1,
      popular: false,
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 19.99,
      credits: 300,
      pricePerCredit: 0.06,
      popular: true,
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: 49.99,
      credits: 1000,
      pricePerCredit: 0.05,
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 249.99,
      credits: 6000,
      pricePerCredit: 0.04,
      popular: false,
    },
  ];

  const sellingPoints = [
    'fullAccessToModels',
    'savePrivateImages',
    'removeWatermark',
    'pricePerImage'
  ];

  const handlePurchase = async (plan: any, isSubscription: boolean) => {
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          isSubscription,
        }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlanCard = (plan: any, isSubscription: boolean) => (
    <div className="mx-auto w-full max-w-md">
      <div className={`rounded-md ${plan.popular ? 'bg-black text-white' : 'bg-gray-100'} p-10`}>
        <div className="mb-4 flex flex-row gap-4 flex-wrap">
          <div className={`w-fit rounded-md ${plan.popular ? 'bg-white text-black' : 'bg-black text-white'} px-4 py-1.5`}>
            <p className="text-sm font-bold">{t(`plans.${plan.name}.name`)}</p>
          </div>
          {plan.popular && (
            <div className="flex items-center gap-1.5 rounded-md bg-white px-4 py-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M0 12.116l2.053-1.897c2.401 1.162 3.924 2.045 6.622 3.969 5.073-5.757 8.426-8.678 14.657-12.555l.668 1.536c-5.139 4.484-8.902 9.479-14.321 19.198-3.343-3.936-5.574-6.446-9.679-10.251z" />
              </svg>
              <p className="text-sm font-bold text-black">{t('popular')}</p>
            </div>
          )}
        </div>
        <h2 className="mb-2 text-3xl font-bold md:text-5xl">
          ${plan.price}<span className="text-sm font-light">/{isSubscription ? t('perMonth') : t('oneTime')}</span>
        </h2>
        <p className={`text-sm mb-2 ${plan.popular ? 'text-white' : 'text-gray-500'}`}>
          {t('forCredits', { credits: plan.credits })}
        </p>
        <p className={`text-xs mb-5 ${plan.popular ? 'text-white' : 'text-gray-500'}`}>
          {t('pricePerCredit', { price: plan.pricePerCredit.toFixed(2) })}
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePurchase(plan, isSubscription);
          }}
          className={`inline-block w-full rounded-md ${plan.popular ? 'bg-white text-black' : 'bg-black text-white'} px-6 py-3 text-center font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? t('processing') : isSubscription ? t('subscribe') : t('buyNow')}
        </a>
      </div>
      <div className="mt-10 space-y-4">
        {sellingPoints.map((point, index) => (
          <div key={index} className="flex flex-row">
            <div className="mr-3 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-green-500"
              >
                <path d="M0 12.116l2.053-1.897c2.401 1.162 3.924 2.045 6.622 3.969 5.073-5.757 8.426-8.678 14.657-12.555l.668 1.536c-5.139 4.484-8.902 9.479-14.321 19.198-3.343-3.936-5.574-6.446-9.679-10.251z" />
              </svg>
            </div>
            <p className="text-gray-500">
              <span className="font-bold text-black">{t(`sellingPoints.${point}`)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const LoginModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Log in to continue
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please log in to your account to complete the purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => signIn('google')}
            >
              Log in with Google
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name='description' content={t('meta.description')} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Header />

      <main className='w-full flex flex-col items-center justify-center text-center px-4 mt-10 lg:mt-20'>
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <h2 className="text-3xl font-bold md:text-5xl mb-4">{t('title')}</h2>
          <p className="mt-4 text-sm text-gray-500 sm:text-base">{t('description')}</p>
        </div>

        <div className="relative mx-auto mb-8 flex w-fit cursor-pointer rounded-xl bg-gray-100 mt-12">
          <div
            className={`relative z-10 px-10 py-4 ${activePlanType === "oneTime" ? "text-white" : "text-gray-500"}`}
            onClick={() => setActivePlanType("oneTime")}
          >
            <p className="text-sm font-semibold sm:text-base">{t('oneTimePurchase')}</p>
          </div>
          <div
            className={`relative z-10 px-10 py-4 ${activePlanType === "subscription" ? "text-white" : "text-gray-500"}`}
            onClick={() => setActivePlanType("subscription")}
          >
            <p className="text-sm font-semibold sm:text-base">{t('subscription')}</p>
          </div>
          <div
            className={`absolute left-2 top-[6px] z-0 h-4/5 ${activePlanType === "oneTime" ? "w-[45%]" : "w-[45%] right-2 left-auto"} rounded-md bg-black transition-all duration-300`}
          ></div>
        </div>

        {activePlanType === "subscription" && (
          <div className="max-w-3xl mx-auto mb-12 text-center bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md">
            <p className="text-base text-blue-800 mb-2">{t('subscriptionRecommendation')}</p>
            <Link href="/billing" className="text-blue-600 hover:text-blue-800 underline">
              {t('viewBillingPage')}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 mt-12">
          {subscriptionPlans.map((plan, index) => renderPlanCard(plan, true))}
        </div>
      </main>

      <Footer />

      {showLoginModal && <LoginModal />}
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'pricing'])),
    },
  };
};

export default PricingPage;