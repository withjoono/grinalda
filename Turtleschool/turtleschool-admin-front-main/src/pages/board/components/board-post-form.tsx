import * as z from 'zod';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { boardEndpoints } from '@/api/endpoints/board-endpoints';
import ReactQuill from 'react-quill';

const formSchema = z.object({
  title: z.string().min(3, { message: 'BoardPost Name must be at least 3 characters' }),
  is_emphasized: z.boolean(),
  boardId: z.string().min(1, { message: 'Please select a boardId' }),
});

type BoardPostFormValues = z.infer<typeof formSchema>;

interface BoardPostFormProps {
  initialData: {
    title: string;
    content: string;
    boardId: string;
    is_emphasized: boolean;
  } | null;
}

export const BoardPostForm = ({ initialData }: BoardPostFormProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const title = initialData ? '게시글 수정' : '게시글 작성';
  const description = initialData ? '게시글을 수정합니다.' : '게시글을 작성합니다.';
  const action = initialData ? '저장하기' : '작성하기';

  const [content, setContent] = useState(initialData?.content || '');

  const defaultValues = initialData
    ? initialData
    : {
        title: '',
        boardId: '1',
        is_emphasized: false,
      };

  const form = useForm<BoardPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: BoardPostFormValues) => {
    try {
      setLoading(true);
      if (initialData && params.postId) {
        const res = await boardEndpoints.editPost({
          boardId: data.boardId,
          postId: params.postId,
          title: data.title,
          content: content,
          is_emphasized: data.is_emphasized,
        });

        if (res.success) {
          toast.success('게시글을 작성했습니다.');
          navigate('/board');
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await boardEndpoints.createPost({
          boardId: data.boardId,
          title: data.title,
          content: content,
          is_emphasized: data.is_emphasized,
        });

        if (res.success) {
          toast.success('게시글을 작성했습니다.');
          navigate('/board');
        } else {
          toast.error(res.error);
        }
      }
    } catch (error: any) {
      toast.error('Uh oh! Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            {
              color: [
                '#000000',
                '#e60000',
                '#ff9900',
                '#ffff00',
                '#008a00',
                '#0066cc',
                '#9933ff',
                '#ffffff',
                '#facccc',
                '#ffebcc',
                '#ffffcc',
                '#cce8cc',
                '#cce0f5',
                '#ebd6ff',
                '#bbbbbb',
                '#f06666',
                '#ffc266',
                '#ffff66',
                '#66b966',
                '#66a3e0',
                '#c285ff',
                '#888888',
                '#a10000',
                '#b26b00',
                '#b2b200',
                '#006100',
                '#0047b2',
                '#6b24b2',
                '#444444',
                '#5c0000',
                '#663d00',
                '#666600',
                '#003700',
                '#002966',
                '#3d1466',
                'custom-color',
              ],
            },
          ],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );
  const formats = [
    'font',
    'size',
    'color',
    'bold',
    'italic',
    'underline',
    'blockquote',
    'list',
    'bullet',
    'align',
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-screen-xl space-y-8"
        >
          <div className="gap-4 md:grid md:grid-cols-1">
            <FormField
              control={form.control}
              name="is_emphasized"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>게시글을 상단에 고정합니다.</FormLabel>
                    <FormDescription>
                      공지사항의 경우 메인 페이지에 게시되며 작성일(수정일 아님)을 기준 최신 작성글
                      6개까지 표시됩니다.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="게시판 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={'1'}>공지사항</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={loading} placeholder="제목을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ReactQuill
              onChange={(html) => setContent(html)}
              modules={modules}
              formats={formats}
              value={content}
              placeholder={'내용을 입력하세요..'}
              theme="snow"
              className="ql-editor h-[600px] pb-10"
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
