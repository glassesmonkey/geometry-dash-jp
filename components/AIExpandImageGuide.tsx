import React from 'react';
import { useTranslation } from 'next-i18next';

const AIExpandImageGuide: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <article className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          {t('fluxGuide.title')}
        </h2>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('fluxGuide.introduction')}
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.basicTipsTitle')}
            </h3>
            <ul className="space-y-4">
              {['specific', 'simpleLanguage', 'details'].map((tip) => (
                <li key={tip} className="flex items-start">
                  <svg className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t(`fluxGuide.tip${tip}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.elementsTitle')}
            </h3>
            <ul className="space-y-4">
              {['subject', 'background', 'colors', 'style'].map((element) => (
                <li key={element} className="flex items-start">
                  <svg className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{t(`fluxGuide.element${element}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.examplesTitle')}
            </h3>
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t('fluxGuide.simpleExampleTitle')}
              </h4>
              <p>{t('fluxGuide.simpleExample')}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t('fluxGuide.detailedExampleTitle')}
              </h4>
              <p>{t('fluxGuide.detailedExample')}</p>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.mistakesTitle')}
            </h3>
            {['vague', 'complicated', 'noBackground'].map((mistake) => (
              <div key={mistake} className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(`fluxGuide.mistake${mistake}Title`)}
                </h4>
                <p>{t(`fluxGuide.mistake${mistake}Description`)}</p>
                <p className="mt-2"><strong>{t('fluxGuide.badExample')}:</strong> {t(`fluxGuide.mistake${mistake}Bad`)}</p>
                <p className="mt-2"><strong>{t('fluxGuide.betterExample')}:</strong> {t(`fluxGuide.mistake${mistake}Better`)}</p>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.practiceTitle')}
            </h3>
            <p>{t('fluxGuide.practiceDescription')}</p>
            <ul className="space-y-4 mt-4">
              {['different', 'learn'].map((practice) => (
                <li key={practice} className="flex items-start">
                  <svg className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{t(`fluxGuide.practice${practice}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fluxGuide.conclusionTitle')}
            </h3>
            <p>{t('fluxGuide.conclusionDescription')}</p>
            <ol className="list-decimal list-inside space-y-2 mt-4">
              {[1, 2, 3, 4, 5, 6].map((point) => (
                <li key={point}>{t(`fluxGuide.conclusionPoint${point}`)}</li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/waitlist"
            className="inline-block bg-orange-500 text-white font-semibold px-8 py-4 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            {t('fluxGuide.ctaButton')}
          </a>
        </div>
      </div>
    </article>
  );
};

export default AIExpandImageGuide;