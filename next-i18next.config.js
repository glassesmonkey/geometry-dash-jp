module.exports = {
  i18n: {
    defaultLocale: 'ja',
    locales: [
      // 'en',       // English (Global)
      // 'zh-Hant',  // Traditional Chinese
      // 'es',       // Spanish
      // // 'hi',       // Hindi (India)
      // // 'ur',       // Urdu (Pakistan)
      // 'ar',       // Arabic
      // 'fr',       // French
      // 'pt-BR',    // Portuguese (Brazil)
      // // 'id'        // Indonesian
      // 'ko',       // Korean
      'ja',       // Japanese
      // 'it',       // Italian
      // 'de',       // German
    ],
  },
  defaultNS: 'common',
  localePath: typeof window === 'undefined' 
    ? require('path').resolve('./public/locales') 
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}