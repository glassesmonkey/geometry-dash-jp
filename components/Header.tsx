import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ChevronDown, Globe, LogOut, User, Menu, X, CreditCard } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  shortName: string;
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const router = useRouter();
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const fetchCredits = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/credits');
          if (response.ok) {
            const data = await response.json();
            setUserCredits(data.credits);
          } else {
            console.error('Failed to fetch user credits');
          }
        } catch (error) {
          console.error('Error fetching user credits:', error);
        }
      }
    };

    fetchCredits();
  }, [session]);

  const languages: Language[] = [
    { code: 'en', name: 'English', shortName: 'EN' },
    { code: 'es', name: 'Español', shortName: 'ES' },
    { code: 'ar', name: 'العربية', shortName: 'AR' },
    { code: 'fr', name: 'Français', shortName: 'FR' },
    { code: 'pt-BR', name: 'Português', shortName: 'PT' },
    { code: 'zh-Hant', name: '繁體中文', shortName: 'ZH' },
    { code: 'de', name: 'Deutsch', shortName: 'DE' }, 
{ code: 'ja', name: '日本語', shortName: 'JA' },  // japan）
{ code: 'ko', name: '한국어', shortName: 'KO' },  //kran
{ code: 'it', name: 'Italiano', shortName: 'IT' },  //italiy
  ];
  const handleLanguageChange = (langCode: string) => {
    router.push(router.pathname, router.asPath, { locale: langCode });
    setIsMobileMenuOpen(false);
  };
  // console.log('Current language:', i18n.language);
  // console.log('Translation of header.aiExpandImage:', t('header.aiExpandImage'));
  return (
    <header className='flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2'>
      <Link href='/' className='flex space-x-2'>
        <Image
          alt='AI Expand Image logo'
          src='/icons/logo.webp'
          className='sm:w-10 sm:h-10 w-7 h-7'
          width={20}
          height={20}
        />
        <h2 className='sm:text-3xl text-xl font-bold ml-2 tracking-tight'>
          {t('header.headerh2')}
        </h2>
      </Link>
      <div className='flex items-center'>
        {/* Desktop Language Switcher */}
        <div className="relative inline-block mr-4 sm:block hidden">
          <div className="flex items-center border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 py-2 pl-2 pr-8">
            <Globe className="w-5 h-5 text-gray-500" />
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => router.push(router.pathname, router.asPath, { locale: e.target.value })}
              value={router.locale}
              className="appearance-none bg-white pl-2 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Login Module */}
         {status === 'loading' ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        ) : !session ? (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold transition duration-200
                       sm:py-2 sm:px-4 sm:rounded sm:text-base
                       py-1 px-2 rounded-full text-sm"
          >
            {typeof window !== 'undefined' && window.innerWidth < 640 ? "Sign in" : "Sign in with Google"}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
              )}
              <ChevronDown className="w-4 h-4 sm:inline hidden" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="block px-4 py-2 text-sm text-gray-700">
                  <CreditCard className="inline-block w-4 h-4 mr-2" />
                  Credits: {userCredits !== null ? userCredits : 'Loading...'}
                </div>
                <button
                  onClick={() => router.push('/billing')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CreditCard className="inline-block w-4 h-4 mr-2" />
                  Billing
                </button>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="inline-block w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="ml-4 sm:hidden text-gray-500 hover:text-gray-600"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className='hidden sm:flex space-x-6 items-center ml-4'>
          <Link href='/' className='border-r border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition'>
            <span className='font-medium text-base'>{t('header.home')}</span>
          </Link>
          <Link href='/blog-post-list' className='border-r border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition'>
            <span className='font-medium text-base'>Blog</span>
          </Link>
          {/* <Link href='/pricing' className='border-r border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition'>
            <span className='font-medium text-base'>Pricing</span>
          </Link> */}
          {/* <Link href='/waitlist' className='border-r border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition'>
            <span className='font-medium text-base'>Free Trial</span>
          </Link> */}
          {/* <Link href='/ai-expand-image' className='space-x-2 hover:text-blue-400 transition'>
            <span className='font-medium text-base'>AI Expand image</span>
          </Link> */}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-20">
          <nav className="flex flex-col space-y-4 p-4">
            <Link href='/' className='hover:text-blue-400 transition' onClick={toggleMobileMenu}>
              <span className='font-medium text-base'>{t('header.home')}</span>
            </Link>
            <Link href='/blog-post-list' className='hover:text-blue-400 transition' onClick={toggleMobileMenu}>
              <span className='font-medium text-base'>Blog</span>
            </Link>
            {/* <Link href='/pricing' className='hover:text-blue-400 transition' onClick={toggleMobileMenu}>
              <span className='font-medium text-base'>Pricing</span>
            </Link>
            <Link href='/waitlist' className='hover:text-blue-400 transition' onClick={toggleMobileMenu}>
              <span className='font-medium text-base'>Free Trial</span>
            </Link>
            <Link href='/ai-hug-gen' className='hover:text-blue-400 transition' onClick={toggleMobileMenu}>
              <span className='font-medium text-base'>AI Hug Generator</span>
            </Link> */}

            {/* Language Selector in Mobile Menu */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Select Language</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                                ${router.locale === lang.code
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
