import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogPostItemProps {
  post: {
    id: string;
    href: string;
    image: string;
    title: string;
    summary: string;
    label: string;
    author: string;
    published: string;
  };
}

export const BlogPostItem = ({ post }: BlogPostItemProps) => {
  return (
    <div className='group flex flex-col'>
      <div className='mb-4 flex text-clip rounded-xl md:mb-5'>
        <div className='size-full transition duration-300 group-hover:scale-105'>
          <img
            src={post.image}
            alt={post.title}
            className='aspect-[3/2] size-full rounded-md object-cover object-center'
          />
        </div>
      </div>

      <div>
        <Badge>{post.label}</Badge>
      </div>
      <div className='mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-xl'>
        {post.title}
      </div>
      <div className='mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5'>
        {post.summary}
      </div>
      <div className='flex items-center gap-2'>
        <Avatar className='size-8'>
          <AvatarImage src='/images/favicon.ico' />
          <AvatarFallback>GN</AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-px'>
          <span className='text-xs font-medium'>{post.author}</span>
          <span className='text-xs text-muted-foreground'>
            {post.published}
          </span>
        </div>
      </div>
    </div>
  );
};
