import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageEditBlockProps {
  editor: Editor;
  close: () => void;
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
  editor,
  close,
}) => {
  const [link, setLink] = React.useState('');

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (link) {
        editor.commands.setImages([{ src: link }]);
        close();
      }
    },
    [editor, link, close]
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-1'>
        <Label htmlFor='image-link'>이미지 링크 추가</Label>
        <div className='flex'>
          <Input
            id='image-link'
            type='url'
            required
            placeholder='https://example.com'
            value={link}
            className='grow'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLink(e.target.value)
            }
          />
          <Button type='submit' className='ml-2'>
            추가
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ImageEditBlock;
