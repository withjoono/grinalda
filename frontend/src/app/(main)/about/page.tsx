export default function About() {
  return (
    <div className='min-h-screen space-y-4 px-4 py-12 md:py-20'>
      <ul className='mx-auto grid max-w-screen-lg grid-cols-1'>
        <li>
          <img
            src='/about/0.webp'
            alt='소개 1'
            className='w-full rounded-t-lg'
          />
        </li>
        <li>
          <img src='/about/1.webp' alt='소개 2' className='w-full' />
        </li>
        <li>
          <img src='/about/2.webp' alt='소개 3' className='w-full' />
        </li>
        <li>
          <img src='/about/3.webp' alt='소개 4' className='w-full' />
        </li>
        <li>
          <img src='/about/4.webp' alt='소개 5' className='w-full' />
        </li>
        <li>
          <img src='/about/6.webp' alt='소개 6' className='w-full' />
        </li>
        <li>
          <img
            src='/about/7.webp'
            alt='소개 7'
            className='w-full rounded-b-lg'
          />
        </li>
      </ul>
    </div>
  );
}
