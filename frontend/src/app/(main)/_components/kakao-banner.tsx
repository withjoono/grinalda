interface KakaoBannerProps {
  link: string;
}

export default function KakaoBanner({ link }: KakaoBannerProps) {
  return (
    <div className='mx-auto flex items-center justify-center'>
      <a href={link} target='_blank' rel='noopener noreferrer'>
        <img
          src='https://grinalda.co.kr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome_kakao_desk.8baaeee5.png&w=3840&q=75'
          alt='카카오톡 친구맺기 배너. 데스크탑 크기'
          className='hidden rounded-md md:block'
        />
        <img
          src='https://grinalda.co.kr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome_kakao_mobile.6c581788.png&w=640&q=75'
          alt='카카오톡 친구맺기 배너. 모바일 크기'
          className='block rounded-md md:hidden'
        />
      </a>
    </div>
  );
}
