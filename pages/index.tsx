import { NextPage, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import Footer from '../components/Footer';
import Header from '../components/Header';
import  Testimonials  from '../components/Testimonials';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import GameTips from '../components/GameTips';
import FAQSection from '../components/FAQSection';
import GameGuide from '../components/GameGuide';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useRef } from 'react';


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
            "@type": "VideoGame",
            "name": {
              "@language": "ja",
              "@value": "ジオメトリーダッシュオンライン"
            },
            "applicationCategory": "Game",
            "operatingSystem": "Any",
            "description": {
              "@language": "ja",
              "@value": "ジオメトリーダッシュオンラインは、無料で遊べる音楽リズムアクションゲームです。音楽に合わせたスリリングなゲームプレイを体験し、自分だけのレベルを作成し、様々なゲームモードで自分に挑戦しましょう。"
            },
            "inLanguage": ["ja"],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "1024"
            },
            "review": [
              {
                "@type": "Review",
                "inLanguage": "ja",
                "author": {
                  "@type": "Person",
                  "name": "田中"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "ジオメトリーダッシュにハマって3ヶ月。最初は難しくて何度もくやしい思いをしたけど、クリアした時の達成感がたまらない！音楽もノリノリで、勉強の合間のストレス発散にぴったり。"
              }
            ],
            "gamePlatform": ["Web Browser", "Online"],
            "genre": ["Music Game", "Action Game", "Platform Game"],
            "url": "https://your-geometry-dash-website.com",
            "sameAs": [
              "https://your-geometry-dash-website.com/ja"
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": {
                  "@language": "ja",
                  "@value": "ジオメトリーダッシュは無料でプレイできますか？"
                },
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": {
                    "@language": "ja",
                    "@value": "初心者にも楽しめる易しいレベルから、上級者向けの難しいレベルまで幅広く用意されています。自分のペースで少しずつ挑戦していけば、誰でも楽しめるゲームです。"
                  }
                }
              },
              {
                "@type": "Question",
                "name": {
                  "@language": "ja",
                  "@value": "ジオメトリーダッシュは無料でプレイできますか？"
                },
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": {
                    "@language": "ja",
                    "@value": "基本プレイは無料ですが、全ての機能を楽しむには有料版の購入が必要です。無料版「ジオメトリーダッシュライト」で雰囲気を味わってみるのもおすすめです。"
                  }
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



