import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MediaCoverage: NextPage = () => {
  const coverageLinks = [
    { title: "Product Hunt", url: "https://www.producthunt.com/posts/flux1-one" },
    { title: "sitelike", url: "https://www.sitelike.org/similar/flux1.one/" },
    { title: "dev.to", url: "https://dev.to/alex_e54ceb5959bc9684e0ea/how-to-create-better-prompts-for-high-quality-images-with-flux-11-pro-41a" },
    { title: "v2ex", url: "https://www.v2ex.com/t/1078840" },
    { title: "issuu", url: "https://issuu.com/flux11" },
    { title: "Telegra.ph", url: "https://telegra.ph/How-to-Create-Better-Prompts-for-High-Quality-Images-with-Flux-11-PRO-10-11" },
    { title: "91wink", url: "https://www.91wink.com/?p=7421" },
    { title: "foundr", url: "https://foundr.ai/product/flux-1-1-pro-generator" },
  ];

  

  

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Media Coverage - geometry dash</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">Media Coverage About geometry dash</h1>
        
        <p className="text-xl mb-12 max-w-2xl">
          Discover what the media is saying about geometry dash and our innovative technology.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
          {coverageLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">{link.title}</h2>
              <p className="text-blue-500 hover:underline">Read Article</p>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MediaCoverage;