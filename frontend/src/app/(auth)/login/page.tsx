import Image from 'next/image';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { LoginForm } from './_components/login-form';

const LoginPage = () => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='grid lg:grid-cols-2'>
          <div className='relative overflow-hidden py-10'>
            <div className='m-auto flex size-full max-w-md flex-col justify-center gap-4 p-6'>
              <div className='mb-6 flex flex-col items-center text-center'>
                <Link href={PageRoutes.HOME}>
                  <Image
                    src='/images/logo.305ece90.svg'
                    alt='logo'
                    className='mb-7 h-10 w-auto'
                    width={100}
                    height={100}
                  />
                </Link>
                <p className='mb-2 text-2xl font-bold'>환영합니다</p>
                <p className='text-muted-foreground'>
                  최고의 미대입시 도우미 그리날다 입니다.
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
          <Image
            src='/images/login-page-img.jpg'
            alt='placeholder'
            className='hidden h-full max-h-screen rounded-2xl object-cover lg:block'
            width={1200}
            height={800}
          />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
