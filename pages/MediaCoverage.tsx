import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MediaCoverage: NextPage = () => {
  const coverageLinks = [

 { title: "someone like me", url: "http://jevc.sakura.ne.jp/bbs/nXmv8E5.cgi?no=21049&reno=no&oya=21049&mode=msgview&page=0" },
 { title: "osu", url: "https://u.osu.edu/meutilab/2024/01/29/new-paper-2/#comment-70" },
 { title: "substack", url: "https://on.substack.com/p/what-to-read-justin-davis/comments" },
 { title: "scalar", url: "https://scalar.usc.edu/works/eng-283e-our-premodern-epics/a-game" },
 { title: "wikimedia", url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/El_ingenioso_hidalgo_don_quijote_del_mancha_pg_12.jpg" },
 { title: "oregon state", url: "https://blogs.oregonstate.edu/motorpool/2014/03/06/first-friday-marc-7-2014/#comment-144559" },
 { title: "ludoking", url: "https://forum.ludoking.com/index.php?topic=5027.msg586903#msg586903" },
 { title: "prnewswire", url: "https://mediablogstage.prnewswire.com/2020/08/05/8-tools-every-journalism-student-needs-for-back-to-school-season/#comment-435873" },
 { title: "siemens", url: "https://ca.webinar.siemens.com/3re41-sirius-motor-starter-packages-1" },
 { title: "doctissimo", url: "https://forum.doctissimo.fr/sante/dents/extraction-sujet_171729_1.htm#bas" },
 { title: "v2ex", url: "https://www.v2ex.com/t/1082364" },
 { title: "github", url: "https://github.com/glassesmonkey/geometry-dash-jp" },
 { title: "mavil", url: "http://www.mavil.epsjv.fiocruz.br/?q=node/77" },
 { title: "blog.goo", url: "https://blog.goo.ne.jp/maple_syrup_with_my_angel/e/151a60d9fed19a325bafee1acd2ec61c?st=0#comment-form" },
 { title: "invenglobal", url: "https://www.invenglobal.com/forum/lostark/141-guides-tips/9414-lost-ark-sol-grande-boss-guide-how-to-beat-location-and-rewards#IGCCS_ID_16095" },
 { title: "invenglobal", url: "https://www.invenglobal.com/forum/lostark/141-guides-tips/9403-lost-ark-how-to-get-and-use-requiem-of-twilight" },
 { title: "valofe", url: "https://forums.valofe.com/forum/black-squad-tw/%E6%96%B0%E5%85%AC%E5%91%8A-aa/%E9%96%8B%E7%99%BC%E6%97%A5%E8%AA%8C-aa/73927-how-to-find-a-wps-pin-on-hp-deskjet-2600/page12#post111483" },
{ title: "iroiro400", url: "https://iroiro400.sakura.ne.jp/400BBS/pwebboard.php/nfJfdqijiKo" },
{ title: "sitelike", url: "https://www.sitelike.org/similar/geometrydashjp.com/" },
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