import React from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Circle, Rocket, Waves, Edit, HelpCircle } from 'lucide-react';

const GameGuide = () => {
  const { t } = useTranslation('common');

  const sections = [
    'basics',
    'gameModes',
    'levelTypes',
    'customization',
    'tips',
    'levelEditor',
    'faq'
  ];

  const icons = {
    basics: <Box />,
    gameModes: <Circle />,
    levelTypes: <Rocket />,
    customization: <Waves />,
    tips: <Edit />,
    levelEditor: <Edit />,
    faq: <HelpCircle />
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          {t('gameGuide.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 md:text-xl">
          {t('gameGuide.description')}
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        {sections.map((section) => (
          <div key={section} className="mb-8">
            <div className="flex items-center mb-4">
              {icons[section as keyof typeof icons]}
              <h3 className="ml-2 text-2xl font-bold">{t(`gameGuide.${section}.title`)}</h3>
            </div>
            <p className="mb-4 text-base text-gray-600">{t(`gameGuide.${section}.description`)}</p>
            <ul className="list-disc pl-5">
              {(() => {
                const items = t(`gameGuide.${section}.items`, { returnObjects: true });
                console.log('Items:', items); // 调试输出
                if (Array.isArray(items)) {
                  return items.map((item: string | object, index: number) => (
                    <li key={index} className="mb-2">
                      {typeof item === 'string' ? item : JSON.stringify(item)}
                    </li>
                  ));
                } else {
                  console.error('Expected an array but got:', items);
                  return null;
                }
              })()}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameGuide;
