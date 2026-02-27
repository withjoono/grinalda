'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { useUpdatePassword } from '@/apis/hooks/use-users';

const passwordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      })
      .max(100, {
        message: '비밀번호가 너무 깁니다.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function ChangePasswordForm() {
  const { data: session } = useSession();
  const { mutateAsync: updatePassword } = useUpdatePassword();
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      if (!session) {
        toast.error('로그인이 필요합니다.');
        return;
      }

      await updatePassword({
        newPassword: data.newPassword,
      });

      toast.success('비밀번호가 변경되었습니다.');
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '비밀번호 변경에 실패했습니다.');
      } else {
        toast.error('비밀번호 변경에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormDescription>
                최소 8자 이상의 새로운 비밀번호를 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormDescription>
                새 비밀번호를 한 번 더 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' className='w-full lg:w-auto'>
            비밀번호 변경
          </Button>
        </div>
      </form>
    </Form>
  );
}
