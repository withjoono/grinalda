import Link from 'next/link';

interface SubBannerProps {
  id: number;
  imageUrl: string;
  link: string;
}

export default function SubBanner({ id, imageUrl, link }: SubBannerProps) {
  return (
    <div className='mx-auto'>
      <Link href={link}>
        <div className='relative w-full overflow-hidden'>
          <img
            src={imageUrl}
            alt={`sub-banner-${id}`}
            className='mx-auto rounded-md object-cover'
          />
        </div>
      </Link>
    </div>
  );
}
