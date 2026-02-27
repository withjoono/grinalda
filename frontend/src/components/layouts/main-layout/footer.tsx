import { PrivacyPolicyDialog } from '@/components/dialogs/privacy-policy-dialog';
import { TermsOfServiceDialog } from '@/components/dialogs/terms-of-service-dialog';
import { Button } from '@/components/ui/button';
import { PageRoutes } from '@/constants/routes';

const sections = [
  {
    title: '페이지',
    links: [
      { name: '메인', href: PageRoutes.HOME },
      { name: '이용안내', href: PageRoutes.ABOUT },
      { name: '온라인 수시예측', href: PageRoutes.APP_MAIN },
      { name: '이용권 구매', href: PageRoutes.PURCHASE },
    ],
  },
];

const Footer = () => {
  return (
    <section className='pb-32'>
      <div className='container mx-auto max-w-7xl px-4'>
        <footer>
          <div className='flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left'>
            <div className='flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start'>
              <div>
                <span className='flex items-center justify-center gap-4 lg:justify-start'>
                  <img
                    src='/images/logo.305ece90.svg'
                    alt='logo'
                    className='h-11'
                  />
                  <p className='text-lg text-muted-foreground'>
                    미대입시 전문 정보센터
                  </p>
                </span>
                <div className='mt-6 space-y-1 text-xs text-muted-foreground'>
                  <p>
                    상호명 : 그리날다 | 대표자 : 최승남 | 개인정보책임자 :
                    최승남
                  </p>
                  <p>
                    사업자등록번호 : 511-35-00628 | 통신판매신고 : 제
                    2020-서울동작-1017호
                  </p>
                  <p>
                    제휴 및 광고 문의 : grinalda@naver.com | 연락처 : 02 538
                    3757
                  </p>
                  <p>
                    사업자 소재지 : 서울시 강남구 선릉로 76길 5-13 (보광빌딩)
                    1층
                  </p>
                </div>
              </div>
              <ul className='flex items-center space-x-4 text-muted-foreground'>
                <li className='font-medium'>
                  <a
                    href='https://cafe.naver.com/grinalda'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      variant={'outline'}
                      className='size-8 rounded-sm border-gray-300 p-2'
                    >
                      <img
                        src={'/icons/coffie.svg'}
                        alt='네이버 카페'
                        className='size-6'
                      />
                    </Button>
                  </a>
                </li>
                <li className='font-medium'>
                  <a
                    href='https://blog.naver.com/grinalda'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      variant={'outline'}
                      className='size-8 rounded-sm border-gray-300 p-2'
                    >
                      <img
                        src={'/icons/b.svg'}
                        alt='네이버 블로그'
                        className='size-6'
                      />
                    </Button>
                  </a>
                </li>
                <li className='font-medium'>
                  <a
                    href='https://www.facebook.com/grinalda.midaeipsi/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      variant={'outline'}
                      className='size-8 rounded-sm border-gray-300 p-2'
                    >
                      <img
                        src={'/icons/facebook.svg'}
                        alt='페이스북'
                        className='size-6'
                      />
                    </Button>
                  </a>
                </li>
                <li className='font-medium'>
                  <a
                    href='https://www.instagram.com/grinalda_midaeipsi'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      variant={'outline'}
                      className='size-8 rounded-sm border-gray-300 p-2'
                    >
                      <img
                        src={'/icons/instagram.svg'}
                        alt='인스타그램'
                        className='size-6'
                      />
                    </Button>
                  </a>
                </li>
              </ul>
            </div>
            <div className='grid grid-cols-1 gap-6 lg:gap-20'>
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className='mb-6 font-bold'>{section.title}</h3>
                  <ul className='space-y-4 text-sm text-muted-foreground'>
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className='font-medium hover:text-primary'
                      >
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left'>
            <p>© 2024 그리날다 All rights reserved.</p>
            <ul className='flex justify-center gap-4 lg:justify-start'>
              <TermsOfServiceDialog>
                <p className='cursor-pointer hover:text-primary'>이용약관</p>
              </TermsOfServiceDialog>
              <PrivacyPolicyDialog>
                <p className='cursor-pointer hover:text-primary'>
                  개인정보보호방침
                </p>
              </PrivacyPolicyDialog>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
