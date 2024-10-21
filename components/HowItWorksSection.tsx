import React from 'react';
import { useTranslation } from 'next-i18next';
import { ArrowUp, Airplay, Target, Music } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useTranslation('common');
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          {t('howToPlay.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 md:text-xl">
          {t('howToPlay.description')}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-center p-8 text-center">
          <ArrowUp className="mb-4 inline-block h-14 w-14" />
          <p className="mb-4 text-xl font-bold">{t('howToPlay.basicControls.title')}</p>
          <p className="text-sm text-gray-500">{t('howToPlay.basicControls.description')}</p>
        </div>
        <div className="flex flex-col items-center p-8 text-center">
          <Target className="mb-4 inline-block h-14 w-14" />
          <p className="mb-4 text-xl font-bold">{t('howToPlay.gameObjective.title')}</p>
          <p className="text-sm text-gray-500">{t('howToPlay.gameObjective.description')}</p>
        </div>
        <div className="flex flex-col items-center p-8 text-center">
          <Airplay className="mb-4 inline-block h-14 w-14" />
          <p className="mb-4 text-xl font-bold">{t('howToPlay.difficultyLevels.title')}</p>
          <p className="text-sm text-gray-500">{t('howToPlay.difficultyLevels.description')}</p>
        </div>
        <div className="flex flex-col items-center p-8 text-center">
          <Target className="mb-4 inline-block h-14 w-14" />
          <p className="mb-4 text-xl font-bold">{t('howToPlay.gameModes.title')}</p>
          <p className="text-sm text-gray-500">{t('howToPlay.gameModes.description')}</p>
        </div>
        <div className="flex flex-col items-center p-8 text-center">
          <Music className="mb-4 inline-block h-14 w-14" />
          <p className="mb-4 text-xl font-bold">{t('howToPlay.tips.title')}</p>
          <p className="text-sm text-gray-500">{t('howToPlay.tips.description')}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
