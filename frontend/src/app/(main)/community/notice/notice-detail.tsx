import { Notice } from '@/apis/hooks/use-boards';
import { NoticeCategoryBadge } from '@/components/badges/notice-category-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

interface NoticeDetailProps {
  notice: Notice;
  onBack: () => void;
}

export const NoticeDetail = ({ notice, onBack }: NoticeDetailProps) => {
  return (
    <div>
      <Button size={'sm'} variant={'ghost'} onClick={onBack}>
        <ArrowLeftIcon className='size-4' /> 뒤로가기
      </Button>
      <div className='flex flex-col gap-2 py-2'>
        <div>
          <NoticeCategoryBadge category={notice.category} />
        </div>
        <h1 className='text-2xl font-bold'>{notice.title}</h1>
        <p className='text-xs text-muted-foreground'>
          {new Date(notice.createdAt).toLocaleDateString()}
        </p>

        <div className='minimal-tiptap-editor py-10'>
          <div
            className='tiptap ProseMirror ProseMirror-hideselection focus:outline-none'
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>
      </div>
    </div>
  );
};
