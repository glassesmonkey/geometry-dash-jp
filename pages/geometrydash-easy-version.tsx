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
  const canonicalUrl = `https://geometrydashjp.com${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const [showGame, setShowGame] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);


  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>

        <title>{t('meta.title')}</title>
        <link rel="canonical" href={canonicalUrl} />
        {/* <link rel="dns-prefetch" href="https://nos.geometrydashjp.com"></link> */}

        {/* hreflang 标记 */}
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://geometrydashjp.com${l === defaultLocale ? '' : `/${l}`}${pathname}`}
          />
        ))}

        {/* x-default hreflang */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://geometrydashjp.com${pathname}`}
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
              "@value": "ジオメトリーダッシュオンラインは、無料で遊る音楽リズムアクションゲームです。音楽に合わせたスリリングなゲームプレイを体験し、自分だけのレベルを作成し、様々なゲームモードで自分に挑戦しましょう。"
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

     

      {/* easy version game */}
      <div className='w-full flex justify-center mt-10'>
        <div 
          className='relative w-full max-w-[768px] h-[320px] md:h-[573px] border border-gray-300 rounded-lg shadow-lg'
          onClick={() => setShowGame(true)}
        >
          {!showGame ? (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer'>
              <h2 className='text-3xl font-bold mb-4'>簡単バージョン</h2>
              <button
                className='bg-blue-500 text-white font-medium px-6 py-3 rounded hover:bg-blue-400 transition duration-300 ease-in-out z-10'
              >
                ゲームを始める
              </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src="https://cdn.geometrydashjp.com/dash-jp-easy.html"
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

      {/* ゲーム説明セクション */}
      <div className="mt-8 max-w-[768px] mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-center mb-4 text-indigo-700">ゲーム操作ガイド</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-lg text-indigo-600 mb-2">基本操作</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-medium">ジャンプ:</span> スペース、W、上矢印、Ctrlまたはマウスクリック</li>
              <li><span className="font-medium">一時停止:</span> Pキー</li>
              <li><span className="font-medium">特殊効果切替:</span> Lキー</li>
              <li><span className="font-medium">再起動:</span> 緑の旗をクリック</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-lg text-indigo-600 mb-2">ゲームのヒント</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>上位500のスコアのみが記録されます</li>
              <li>v1.6 更新: パフォーマンス向上のためScratchを自動無効化</li>
              <li>2016年5月3日 v1.5更新: ジャンプの仕組みを調整し、オリジナルゲームに近づけました</li>
              <li>トリプルスパイクのジャンプが簡単になりました</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center text-indigo-600 font-medium">楽しんでプレイしてください！</p>
      </div>

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



