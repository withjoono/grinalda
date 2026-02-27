import { BlogPostData } from '@/constants/blog-data';
import { PageRoutes } from '@/constants/routes';
import Link from 'next/link';
import { BlogPostItem } from './blog-post-item';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';

const BlogSection = () => {
  const posts = BlogPostData;
  return (
    <div className=''>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-8 md:mb-10 lg:mb-8'>
          <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
              <h1 className='w-full text-2xl font-bold lg:text-3xl'>
                미대입시 최신정보
              </h1>
              <Link
                href={PageRoutes.COMMUNITY_NOTICE}
                className='shrink-0 text-gray-500 hover:text-gray-700'
              >
                더보기 +
              </Link>
            </div>
          </div>
        </div>
        <div className='grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-6 lg:gap-y-6 2xl:grid-cols-4'>
          {posts.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              href={`${PageRoutes.COMMUNITY_NOTICE}/${post.id}`}
            >
              <BlogPostItem post={post} />
            </Link>
          ))}
        </div>
        {/* <div className='mt-8 border-t border-border py-2 md:mt-10 lg:mt-12'>
          <Pagination>
            <PaginationContent className='w-full justify-between'>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <div className='hidden items-center gap-1 md:flex'>
                <PaginationItem>
                  <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>3</PaginationLink>
                </PaginationItem>
              </div>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div> */}
      </div>
    </div>
  );
};

export default BlogSection;
