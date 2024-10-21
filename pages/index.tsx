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
import GameTips from '../components/GameTips';
import FAQSection from '../components/FAQSection';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AIImageExpanderTips from '../components/AIImageExpanderTips';
import AIExpandImageGuide from '../components/AIExpandImageGuide';
import { useState, useRef } from 'react';
import GameGuide from '../components/GameGuide';

const Home: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, locales, defaultLocale, pathname } = router;
  const canonicalUrl = `https://flux1.one${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const [showGame, setShowGame] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);


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

      {/* 游戏加载框 */}
      <div className='w-full flex justify-center mt-10'>
        <div 
          className='relative w-full max-w-[768px] h-[320px] md:h-[573px] border border-gray-300 rounded-lg shadow-lg'
          onClick={() => setShowGame(true)}
        >
          {!showGame ? (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 cursor-pointer'>
              <img
                src="https://cdn.geometrydashjp.com/geometrydashlite-game-image.webp"
                alt="Game Cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                className='bg-blue-500 text-white font-medium px-6 py-3 rounded hover:bg-blue-400 transition duration-300 ease-in-out z-10'
              >
                Start Game
              </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src="https://cdn.geometrydashjp.com/geometrydashippause.html"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="HTML Game"
              onLoad={() => setIframeLoaded(true)}
              className={iframeLoaded ? '' : 'hidden'}
            ></iframe>
          )}
        </div>
      </div>

      <FeaturesSection />
      <HowItWorksSection />
      <GameTips />
      <FAQSection />
      <Testimonials />
      <GameGuide />
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
