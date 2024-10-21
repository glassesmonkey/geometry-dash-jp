import Image from 'next/image';
import { useTranslation } from 'next-i18next';

export function Testimonials() {
  const { t } = useTranslation('common');

  const testimonials = [
    [
      {
        content: t('testimonials.sarah.content'),
        link: '#',
        author: {
          name: t('testimonials.sarah.name'),
          role: t('testimonials.sarah.role'),
          image: '/index_image/Sarah.webp',
        },
      },
      {
        content: t('testimonials.michael.content'),
        link: '#',
        author: {
          name: t('testimonials.michael.name'),
          role: t('testimonials.michael.role'),
          image: '/index_image/Michael.webp',
        },
      },
    ],
    [
      {
        content: t('testimonials.emily.content'),
        link: '#',
        author: {
          name: t('testimonials.emily.name'),
          role: t('testimonials.emily.role'),
          image: '/index_image/Emily.webp',
        },
      },
      {
        content: t('testimonials.david.content'),
        link: '#',
        author: {
          name: t('testimonials.david.name'),
          role: t('testimonials.david.role'),
          image: '/index_image/David.webp',
        },
      },
    ],
    [
      {
        content: t('testimonials.samantha.content'),
        link: '#',
        author: {
          name: t('testimonials.samantha.name'),
          role: t('testimonials.samantha.role'),
          image: '/index_image/Samantha.webp',
        },
      },
      {
        content: t('testimonials.alex.content'),
        link: '#',
        author: {
          name: t('testimonials.alex.name'),
          role: t('testimonials.alex.role'),
          image: '/index_image/Alex.webp',
        },
      },
    ],
  ];

  return (
    <section
      id='testimonials'
      aria-label={t('testimonials.ariaLabel')}
      className='py-10'
    >
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto md:text-center'>
          <h2 className='mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl'>
            {t('testimonials.title')}
          </h2>
          <p className='mx-auto mt-6 max-w-xl text-lg text-slate-700 leading-7'>
            {t('testimonials.subtitle')}
          </p>
        </div>
        <ul
          role='list'
          className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-16 lg:max-w-none lg:grid-cols-3'
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role='list' className='flex flex-col gap-y-6 sm:gap-y-8'>
                {column.map((testimonial, testimonialIndex) => (
                  <li
                    key={testimonialIndex}
                    className='hover:scale-105 transition duration-300 ease-in-out'
                  >
                    <a href={testimonial.link} target='_blank' rel='noreferrer'>
                      <figure className='relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10'>
                        <blockquote className='relative'>
                          <p className='text-lg tracking-tight text-slate-900'>
                            "{testimonial.content}"
                          </p>
                        </blockquote>
                        <figcaption className='relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6'>
                          <div>
                            <div className='font-display text-base text-slate-900'>
                              {testimonial.author.name}
                            </div>
                            <div className='mt-1 text-sm text-slate-500'>
                              {testimonial.author.role}
                            </div>
                          </div>
                          <div className='overflow-hidden rounded-full bg-slate-50'>
                            <Image
                              className='h-14 w-14 object-cover'
                              src={testimonial.author.image}
                              alt={t('testimonials.authorImageAlt')}
                              width={56}
                              height={56}
                            />
                          </div>
                        </figcaption>
                      </figure>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}