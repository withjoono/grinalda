'use client';

import { Button } from '@/components/ui/button';
import { PageRoutes } from '@/constants/routes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다'
    ),
});

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      // 로그인 에러는 next-auth에서 처리됨
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('로그인이 완료되었습니다');
      router.push(PageRoutes.HOME);
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // 입력값 검증 실패
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder='example@gmail.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full'>
            로그인
          </Button>
        </form>
      </Form>
      <div className='mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground'>
        <p>계정이 없으신가요?</p>
        <a href={PageRoutes.SIGNUP} className='font-medium text-primary'>
          회원가입
        </a>
      </div>
    </div>
  );
};
