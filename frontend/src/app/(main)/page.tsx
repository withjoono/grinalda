import CardBanner from './_components/card-banner';
import Hero from './_components/hero';
import KakaoBanner from './_components/kakao-banner';
import NoticeSection from './_components/notice-section';
import SubBanner from './_components/sub-banner';

export default function Home() {
  const subBannerData = {
    id: 1,
    imageUrl: '/banners/banner3.png',
    link: '/app',
  };
  const cardBannerData1 = [
    {
      id: 1,
      imageUrl: '/banners/banner4.png',
      link: '/app',
    },
    {
      id: 2,
      imageUrl: '/banners/banner3.png',
      link: '/app',
    },
  ];

  const cardBannerData2 = [
    {
      id: 1,
      imageUrl: '/banners/banner3.png',
      link: '/app',
    },
    {
      id: 2,
      imageUrl: '/banners/banner4.png',
      link: '/app',
    },
  ];

  return (
    <div className='container mx-auto flex max-w-screen-xl flex-col items-center space-y-20 px-4 py-20'>
      <section className='mx-auto w-full max-w-6xl py-12'>
        <Hero />
      </section>
      <section className='mx-auto w-full max-w-6xl space-y-4'>
        <SubBanner {...subBannerData} />
        <div className='flex flex-col justify-center gap-2 md:flex-row'>
          <CardBanner banners={cardBannerData1} />
          <CardBanner banners={cardBannerData2} />
        </div>
      </section>

      {/* 공지사항 */}
      <section className='mx-auto w-full max-w-6xl'>
        <NoticeSection />
      </section>

      {/* 카카오톡 친구맺기 배너 */}
      <section className='mx-auto w-full max-w-6xl'>
        <KakaoBanner link='https://pf.kakao.com/_bcHxaC' />
      </section>
    </div>
  );
}
