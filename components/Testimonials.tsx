import React from 'react';
import { useTranslation } from 'next-i18next';
import { User } from 'lucide-react'; // 使用 lucide-react 中的 User 图标

const Testimonials = () => {
  const { t } = useTranslation('common');

  const testimonials = ['tanaka', 'sato', 'yamada', 'suzuki', 'takahashi'];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32" aria-labelledby="testimonials-title">
      <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
        <h2 id="testimonials-title" className="mb-4 text-3xl font-bold md:text-5xl">
          {t('testimonials.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 md:text-xl">
          {t('testimonials.description')}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial} className="flex flex-col items-center p-8 text-center">
            <User className="mb-4 inline-block h-16 w-16 text-gray-500" /> {/* 使用 User 图标 */}
            <p className="mb-4 text-sm italic text-gray-500">"{t(`testimonials.${testimonial}.content`)}"</p>
            <p className="text-base font-semibold">{t(`testimonials.${testimonial}.name`)}</p>
            <p className="text-sm text-gray-500">{t(`testimonials.${testimonial}.role`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
