import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface HowItWorksItemProps {
  number: string;
  titleKey: string;
  descriptionKey: string;
}

const HowItWorksItem: React.FC<HowItWorksItemProps> = ({ number, titleKey, descriptionKey }) => {
  const { t } = useTranslation('common');
  return (
    <a className="mb-8 flex max-w-lg justify-center gap-4 rounded-xl border-b border-solid border-gray-300 px-6 py-5 text-black">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-100">
        <p className="text-sm font-bold sm:text-base">{number}</p>
      </div>
      <div className="ml-4 flex flex-col gap-2">
        <h5 className="text-xl font-bold">{t(titleKey)}</h5>
        <p className="text-sm text-gray-500">{t(descriptionKey)}</p>
      </div>
    </a>
  );
};

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <h2 className="text-center text-3xl font-bold md:text-5xl">
          {t('howItWorks.title')}
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-3xl text-center text-sm text-gray-500 sm:text-base md:mb-12 lg:mb-16">
          {t('howItWorks.description')}
        </p>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex h-full flex-col [grid-area:2/1/3/2] lg:[grid-area:1/2/2/3]">
            <HowItWorksItem 
              number="1"
              titleKey="howItWorks.step1.title"
              descriptionKey="howItWorks.step1.description"
            />
            <HowItWorksItem 
              number="2"
              titleKey="howItWorks.step2.title"
              descriptionKey="howItWorks.step2.description"
            />
            <HowItWorksItem 
              number="3"
              titleKey="howItWorks.step3.title"
              descriptionKey="howItWorks.step3.description"
            />
            <HowItWorksItem 
              number="4"
              titleKey="howItWorks.step4.title"
              descriptionKey="howItWorks.step4.description"
            />
          </div>
          <Image
            src="/index_image/flux-1-1-pro-how-it-works.png"
            alt={t('howItWorks.imageAlt')}
            width={444}
            height={845}
            className="block h-full w-full overflow-hidden [grid-area:1/1/2/2] lg:[grid-area:1/1/2/2]"
          />
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">{t('howItWorks.whySpecial.title')}</h3>
          <p className="text-gray-500 mb-8">{t('howItWorks.whySpecial.description')}</p>
          <h3 className="text-2xl font-bold mb-4">{t('howItWorks.readyToTry.title')}</h3>
          <p className="text-gray-500">{t('howItWorks.readyToTry.description')}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;