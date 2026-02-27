'use client';

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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { toast } from 'sonner';
import { Notice, NoticeCategory } from '@/apis/hooks/use-boards';
import {
  useCreateNotice,
  useUpdateNotice,
} from '@/apis/hooks/admin/use-admin-notice';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

const formSchema = z.object({
  title: z.string().min(2, {
    message: '제목은 2글자 이상이어야 합니다.',
  }),
  content: z.string(),
  categoryId: z.string(),
});

export default function NoticeForm({
  noticeCategories,
  initialData,
}: {
  noticeCategories: NoticeCategory[];
  initialData?: Notice;
}) {
  const router = useRouter();
  const { mutateAsync: createNotice } = useCreateNotice();
  const { mutateAsync: updateNotice } = useUpdateNotice();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      categoryId: initialData?.category.id.toString() || '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        await updateNotice({
          id: initialData.id,
          title: data.title,
          content: data.content,
          categoryId: Number(data.categoryId),
        });
      } else {
        await createNotice({
          title: data.title,
          content: data.content,
          categoryId: Number(data.categoryId),
        });
      }
      toast.success('게시글 추가/수정에 성공했습니다.');
      router.replace(PageRoutes.ADMIN_COMMUNITY_NOTICE);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('게시글 추가/수정에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {initialData ? '게시글 수정' : '게시글 추가'}
          </h1>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                router.push(PageRoutes.ADMIN_COMMUNITY_NOTICE);
              }}
            >
              취소
            </Button>
            <Button type='submit'>
              {initialData ? '수정하기' : '추가하기'}
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-6 gap-4'>
          <div className='col-span-6 space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>게시글 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>내용</FormLabel>
                        <FormControl>
                          <MinimalTiptapEditor
                            value={field.value}
                            onChange={field.onChange}
                            className='w-full'
                            editorContentClassName='p-5'
                            output='html'
                            placeholder='Type your description here...'
                            autofocus={true}
                            editable={true}
                            editorClassName='focus:outline-none'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            defaultValue={initialData?.category.id.toString()}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='카테고리 선택' />
                            </SelectTrigger>
                            <SelectContent>
                              {noticeCategories.map((category) => (
                                <SelectItem
                                  key={category.id.toString()}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          게시글의 카테고리를 선택해주세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
