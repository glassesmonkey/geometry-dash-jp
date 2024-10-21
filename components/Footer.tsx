import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();
  const isIndexPage = pathname === '/'; // Assuming you have a way to determine if it's the index page

  return (
    <footer className="bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold">Geometry dash</Link>
            <p className="text-sm text-gray-600">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation links */}
          <nav className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">{t('footer.product')}</h3>
              <ul className="space-y-2">
                <li><Link href="/waitlist" className="text-sm text-gray-600 hover:text-black">{t('footer.features')}</Link></li>
                <li><Link href="/MediaCoverage" className="text-sm text-gray-600 hover:text-black">Media Coverage-geometry dash jp</Link></li>

                {/* <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-black">Pricing</Link></li> */}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('footer.partner')}</h3>
              <ul className="space-y-2">
                {/* <li><Link href="/about" className="text-sm text-gray-600 hover:text-black">About</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-black">Contact</Link></li> */}
                {isIndexPage && (
                  <>
                    
                    
                    <a href="https://ai-hug.org/" title="AI HUG" className="partner-link" rel="noopener noreferrer" target="_blank">AI HUG</a>
                   
                  </>
                )}
              </ul>
            </div>
          </nav>

          {/* Social links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com/alexfefun1" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-black">{t('footer.terms')}</Link>
            <Link href="/privacypolicy" className="text-sm text-gray-600 hover:text-black">{t('footer.privacy')}</Link>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center text-sm text-gray-600 py-4">
          Powered by{' '}
          <a href="https://replicate.com/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-black">
            Replicate
          </a>
          {' '}and{' '}
          <a href="https://cloudflare.com/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-black">
            Cloudflare
          </a>
          . Created by{' '}
          <a href="https://x.com/alexfefun1" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-black">
            Alex
          </a>
        </div>
      </div>
      <style jsx>{`
        .partner-link {
          display: inline-block;
          word-break: break-word;
          max-width: 100%;
          font-size: 0.875rem;
          color: #4b5563;
          text-decoration: none;
        }
        .partner-link:hover {
          color: #000;
        }
      `}</style>
    </footer>
  );
};

export default Footer;