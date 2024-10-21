import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation('common');
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 md:px-10 md:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
        <div className="py-20">
          <h2 className="mb-6 text-3xl font-bold md:mb-10 md:text-5xl lg:mb-12">
            {t('features.title')}
          </h2>
          <ul className="grid max-w-2xl grid-cols-2 sm:gap-5 lg:max-w-none">
            <li className="flex flex-col p-5">
              <Image
                src="/index_image/speed.svg"
                alt={t('features.lightningFast.imageAlt')}
                width={40}
                height={40}
                className="mb-4 object-cover inline-block rounded-full"
              />
              <p className="mb-4 font-semibold">{t('features.lightningFast.title')}</p>
              <p className="text-sm text-gray-500">
                {t('features.lightningFast.description')}
              </p>
            </li>
            <li className="flex flex-col p-5">
              <Image
                src="/index_image/quality.svg"
                alt={t('features.topQuality.imageAlt')}
                width={40}
                height={40}
                className="mb-4 object-cover inline-block rounded-full"
              />
              <p className="mb-4 font-semibold">{t('features.topQuality.title')}</p>
              <p className="text-sm text-gray-500">
                {t('features.topQuality.description')}
              </p>
            </li>
            <li className="flex flex-col p-5">
              <Image
                src="/index_image/user-friendly.svg"
                alt={t('features.userFriendly.imageAlt')}
                width={40}
                height={40}
                className="mb-4 object-cover inline-block rounded-full"
              />
              <p className="mb-4 font-semibold">{t('features.userFriendly.title')}</p>
              <p className="text-sm text-gray-500">
                {t('features.userFriendly.description')}
              </p>
            </li>
            <li className="flex flex-col p-5">
              <Image
                src="/index_image/versatile.svg"
                alt={t('features.versatile.imageAlt')}
                width={40}
                height={40}
                className="mb-4 object-cover inline-block rounded-full"
              />
              <p className="mb-4 font-semibold">{t('features.versatile.title')}</p>
              <p className="text-sm text-gray-500">
                {t('features.versatile.description')}
              </p>
            </li>
          </ul>
        </div>
        <div className="h-full w-full">
          <Image
            src="/index_image/feature_demo.webp"
            alt={t('features.mainImage.alt')}
            width={428}
            height={756}
            className="mx-auto inline-block h-full w-full max-w-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;