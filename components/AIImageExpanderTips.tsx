import { useTranslation } from 'next-i18next';

const AIImageExpanderTips = () => {
  const { t } = useTranslation('common');

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <h2 className="text-center text-3xl font-bold md:text-5xl">
          {t('fluxTips.title')}
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-lg text-center text-sm text-gray-500 sm:text-base md:mb-12 lg:mb-16">
          {t('fluxTips.description')}
        </p>
        <div className="mx-auto grid max-w-xl gap-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center justify-center rounded-sm bg-gray-100 px-6 py-4">
              <div className="mr-6 flex h-14 w-14 flex-none items-center justify-center rounded-sm bg-white">
                <p className="text-sm font-bold sm:text-xl">{num}</p>
              </div>
              <p className="text-sm sm:text-base">
                {t(`fluxTips.tip${num}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIImageExpanderTips;