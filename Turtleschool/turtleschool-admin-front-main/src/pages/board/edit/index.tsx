import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import { BoardPostForm } from '../components/board-post-form';
import { useEffect, useState } from 'react';
import { boardEndpoints } from '@/api/endpoints/board-endpoints';
import { useParams } from 'react-router-dom';
import { IBoardPostData } from '@/api/types/board-types';
import { toast } from 'sonner';
import NotFoundError from '@/pages/errors/not-found-error';

export default function EditPostPage() {
  const params = useParams<{ boardId: string; postId: string }>();
  const [post, setPost] = useState<IBoardPostData | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await boardEndpoints.getPostById(params.boardId || '', params.postId || '');
      if (result.success) {
        setPost(result.data);
      } else {
        toast.error(result.error);
      }
    };
    fetch();
  }, []);
  return (
    <Layout>
      <LayoutHeader>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== 메인 ===== */}
      <LayoutBody className="space-y-4">
        {post ? (
          <BoardPostForm
            initialData={{
              title: post.title,
              content: post.content,
              is_emphasized: post.is_emphasized,
              boardId: post.board.id + '',
            }}
          />
        ) : (
          <NotFoundError />
        )}
      </LayoutBody>
    </Layout>
  );
}
