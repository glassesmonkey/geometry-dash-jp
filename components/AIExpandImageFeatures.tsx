import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface FeatureSectionProps {
  titleKey: string;
  descriptionKey: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ titleKey, descriptionKey, imageSrc, imageAlt, reverse = false }) => {
  const { t } = useTranslation('common');
  return (
    <div className={`flex flex-col items-start gap-8 sm:gap-20 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:items-center`}>
      <div className="lg:w-1/2">
        <h2 className="mb-4 max-w-3xl text-3xl font-bold md:text-5xl">
          {t(titleKey)}
        </h2>
        <p className="mb-6 max-w-lg text-sm text-gray-500 sm:text-base md:mb-10 lg:mb-12">
          {t(descriptionKey)}
        </p>
        <a
          href="/waitlist"
          className="inline-block bg-black px-6 py-3 font-semibold text-white"
        >
          {t('aiExpandImageFeatures.tryNow')}
        </a>
      </div>
      <div className="lg:w-1/2">
        <Image
          src={imageSrc}
          alt={t(imageAlt)}
          width={428}
          height={285}
          layout="responsive"
        />
      </div>
    </div>
  );
};

const AIExpandImageFeatures: React.FC = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <FeatureSection
          titleKey="aiExpandImageFeatures.versatileAspectRatios.title"
          descriptionKey="aiExpandImageFeatures.versatileAspectRatios.description"
          imageSrc="/icons/aspect-ratio-presets.webp"
          imageAlt="aiExpandImageFeatures.versatileAspectRatios.imageAlt"
        />
        
        <FeatureSection
          titleKey="aiExpandImageFeatures.contextAwareAI.title"
          descriptionKey="aiExpandImageFeatures.contextAwareAI.description"
          imageSrc="/icons/context-aware-ai.webp"
          imageAlt="aiExpandImageFeatures.contextAwareAI.imageAlt"
          reverse={true}
        />
        
        <FeatureSection
          titleKey="aiExpandImageFeatures.flexibleEditing.title"
          descriptionKey="aiExpandImageFeatures.flexibleEditing.description"
          imageSrc="/icons/flexible-editing.webp"
          imageAlt="aiExpandImageFeatures.flexibleEditing.imageAlt"
        />
        
        <FeatureSection
          titleKey="aiExpandImageFeatures.diverseApplications.title"
          descriptionKey="aiExpandImageFeatures.diverseApplications.description"
          imageSrc="/icons/diverse-applications.webp"
          imageAlt="aiExpandImageFeatures.diverseApplications.imageAlt"
          reverse={true}
        />
      </div>
    </section>
  );
};

export default AIExpandImageFeatures;