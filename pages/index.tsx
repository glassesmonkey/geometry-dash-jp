import { NextPage, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
// import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';
import AIExpandImageFeatures from '../components/AIExpandImageFeatures';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FAQSection from '../components/FAQSection';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AIImageExpanderTips from '../components/AIImageExpanderTips';
import AIExpandImageGuide from '../components/AIExpandImageGuide';

const Home: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, locales, defaultLocale, pathname } = router;
  const canonicalUrl = `https://flux1.one${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;

  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>

        <title>{t('meta.title')}</title>
        <link rel="canonical" href={canonicalUrl} />
        {/* <link rel="dns-prefetch" href="https://nos.flux1.one"></link> */}

        {/* hreflang 标记 */}
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://flux1.one${l === defaultLocale ? '' : `/${l}`}${pathname}`}
          />
        ))}

        {/* x-default hreflang */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://flux1.one${pathname}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Image Generator powered by Flux 1.1 PRO",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Any",
            "description": "Our web application utilizes the advanced Flux 1.1 PRO AI to generate high-quality images from text descriptions. Experience unprecedented speed and accuracy in AI image creation.",

            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "529"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "This AI image generator is incredible! The speed and quality of image generation are unmatched. It's 6 times faster than other tools I've used!"
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Michael Chen"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "4.8"
                },
                "reviewBody": "As a content creator, this tool is a game-changer. The diverse range of styles and the accuracy in following prompts are incredible. It's like having a professional artist at my fingertips."
              }
            ],
            "featureList": [
              "AI-powered image generation using Flux 1.1 PRO",
              "6 times faster than conventional AI image generators",
              "Image output up to 2K resolution",
              "Improved prompt understanding for accurate results",
              "Diverse artistic styles available"
            ],
            // "screenshot": "https://nos.flux1.one/front.webp",
            "url": "https://flux1.one",
            "provider": {
              "@type": "Organization",
              "name": "Flux1.one",
              "url": "https://flux1.one"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t('faq.question1'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer1')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question2'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer2')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question3'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer3')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question4'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer4')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question5'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer5')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question6'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer6')
                }
              },
              {
                "@type": "Question",
                "name": t('faq.question7'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('faq.answer7')
                }
              }
            ]
          })}
        </script>

      </Head>
      <Header />
      <div className='flex flex-col lg:flex-row w-full items-center justify-between px-4 mt-10 lg:mt-20'>
        {/* Image section */}
        <div className='w-full lg:w-1/2 mb-10 lg:mb-0 order-1'>
          <div className='flex flex-col space-y-10'>
            <div className='flex justify-center'>
              <div className='relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]'>
                <Image
                  alt='flux1.1 pro demo'
                  src='/index_image/flux1.1pro_cake_demo.webp'
                  layout='fill'
                  objectFit='contain'
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content section */}
        <main className='w-full lg:w-1/2 flex flex-col items-center justify-center text-center lg:text-left order-2'>

          <h1 className='mx-auto lg:mx-0 max-w-4xl font-display text-4xl lg:text-5xl font-bold tracking-normal text-slate-900 sm:text-6xl lg:text-7xl'>
            {t('home.title')}
          </h1>

          <p className='mx-auto lg:mx-0 mt-6 lg:mt-12 max-w-xl text-lg text-slate-700 leading-7'>
            {t('home.description')}
          </p>
          <div className='flex justify-center lg:justify-start mt-8 lg:mt-10'>
            <Link
              className='bg-orange-500 rounded-xl text-white font-medium px-4 py-3 hover:bg-orange-400 border-2 border-orange-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg'
              href='/waitlist'
            >
              {t('home.cta')}
            </Link>
          </div>
        </main>
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      {/* <AIExpandImageFeatures /> */}
      <AIImageExpanderTips />
      <FAQSection />
      <Testimonials />
      <AIExpandImageGuide />
      <Footer />
    </div>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  if (!locale) {
    throw new Error('Locale is not defined');
  }
  const translations = await serverSideTranslations(locale, ['common']);
  console.log('Loaded translations:', translations);
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
export default Home;
