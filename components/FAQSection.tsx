import React from 'react';
import { useTranslation } from 'next-i18next';

const FAQSection = () => {
  const { t } = useTranslation('common');

  const faqs = [
    'question1',
    'question2',
    'question3',
    'question4',
    'question5',
    'question6'
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          {t('faq.mainTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 md:text-xl">
          {t('faq.description')}
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        {faqs.map((faq) => (
          <div key={faq} className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="mb-4 text-xl font-bold">{t(`faq.${faq}`)}</h3>
            <p className="text-base text-gray-600">{t(`faq.answer${faq.slice(-1)}`)}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-gray-500">
        {t('faq.cannotFindAnswer')}
      </p>
    </section>
  );
};

export default FAQSection;
