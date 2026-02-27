'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInquiryReply } from '@/apis/hooks/admin/use-admin-inquiry';
import { Inquiry } from '@/apis/hooks/use-boards';
import { PageRoutes } from '@/constants/routes';

const formSchema = z.object({
  content: z.string(),
});

export default function CreateInquiryReplyForm({
  inquiry,
}: {
  inquiry: Inquiry;
}) {
  const router = useRouter();
  const { mutateAsync: createInquiryReply } = useCreateInquiryReply();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createInquiryReply({
        inquiryId: inquiry.id,
        content: data.content,
      });
      toast.success('답변이 추가되었습니다.');
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('답변 추가에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => {
              router.push(PageRoutes.ADMIN_COMMUNITY_INQUIRY);
            }}
          >
            취소
          </Button>
          <Button type='submit'>답변 추가</Button>
        </div>
      </form>
    </Form>
  );
}
