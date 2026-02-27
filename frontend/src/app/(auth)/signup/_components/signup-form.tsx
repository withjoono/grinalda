'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PageRoutes } from '@/constants/routes';
import { useState } from 'react';
import { PrivacyPolicyDialog } from '@/components/dialogs/privacy-policy-dialog';
import { TermsOfServiceDialog } from '@/components/dialogs/terms-of-service-dialog';
import { MarketingConsentDialog } from '@/components/dialogs/marketing-consent-dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignup } from '@/apis/hooks/use-auth';
import {
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from '@/components/ui/form';
import { AxiosError } from 'axios';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다'
    ),
  grade: z.string().min(1, '학년을 선택해주세요'),
});

export const SignupForm = () => {
  const router = useRouter();
  const { mutateAsync: signupMutation } = useSignup();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      grade: '',
    },
  });

  // 체크박스 상태 관리
  const [checkedItems, setCheckedItems] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
  });

  // 전체 체크박스 상태 계산
  const isAllChecked = Object.values(checkedItems).every(Boolean);

  // 전체 동의 처리
  const handleAllCheck = () => {
    const newValue = !isAllChecked;
    setCheckedItems({
      terms1: newValue,
      terms2: newValue,
      terms3: newValue,
    });
  };

  // 개별 체크박스 처리
  const handleSingleCheck = (key: keyof typeof checkedItems) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      if (!checkedItems.terms1 || !checkedItems.terms2) {
        toast.error('필수 약관에 동의해주세요');
        return;
      }

      const grade = Number(values.grade);

      if (isNaN(grade) || grade < 0 || 4 < grade) {
        toast.error('학년 정보가 올바르지 않습니다');
        return;
      }

      await signupMutation({
        name: values.name,
        email: values.email,
        password: values.password,
        termsOfService: checkedItems.terms1,
        privacyPolicy: checkedItems.terms2,
        marketingConsent: checkedItems.terms3,
        grade: grade,
      });

      // 회원가입 성공 후 자동 로그인
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error('자동 로그인 실패');
        router.push(PageRoutes.LOGIN);
        return;
      }

      toast.success('회원가입이 완료되었습니다');
      router.push(PageRoutes.HOME);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || '회원가입 중 오류가 발생했습니다'
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('회원가입 중 오류가 발생했습니다');
      }
      console.error('Signup error:', error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder='이름을 입력해주세요' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name='grade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>학년 정보</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='학년을 선택해주세요' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='1'>고1</SelectItem>
                          <SelectItem value='2'>고2</SelectItem>
                          <SelectItem value='3'>고3</SelectItem>
                          <SelectItem value='4'>N수</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='pt-2'>
              <div className='space-y-4 rounded-lg border p-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms-all'
                    checked={isAllChecked}
                    onCheckedChange={handleAllCheck}
                  />
                  <label
                    htmlFor='terms-all'
                    className='text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    회원가입 약관에 모두 동의합니다
                  </label>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='terms-1'
                        required
                        checked={checkedItems.terms1}
                        onCheckedChange={() => handleSingleCheck('terms1')}
                      />
                      <label
                        htmlFor='terms-1'
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        이용약관 (필수)
                      </label>
                    </div>
                    <TermsOfServiceDialog>
                      <p className='cursor-pointer text-sm text-primary underline'>
                        보기
                      </p>
                    </TermsOfServiceDialog>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='terms-2'
                        required
                        checked={checkedItems.terms2}
                        onCheckedChange={() => handleSingleCheck('terms2')}
                      />
                      <label
                        htmlFor='terms-2'
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        개인정보처리 및 이용 (필수)
                      </label>
                    </div>
                    <PrivacyPolicyDialog>
                      <p className='cursor-pointer text-sm text-primary underline'>
                        보기
                      </p>
                    </PrivacyPolicyDialog>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='terms-3'
                        checked={checkedItems.terms3}
                        onCheckedChange={() => handleSingleCheck('terms3')}
                      />
                      <label
                        htmlFor='terms-3'
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        개인정보의 마케팅 및 광고 활용 (선택)
                      </label>
                    </div>
                    <MarketingConsentDialog>
                      <p className='cursor-pointer text-sm text-primary underline'>
                        보기
                      </p>
                    </MarketingConsentDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button type='submit' className='w-full'>
            회원가입
          </Button>
        </form>
      </Form>

      <div className='mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground'>
        <p>이미 계정이 있으신가요?</p>
        <a href={PageRoutes.LOGIN} className='font-medium text-primary'>
          로그인
        </a>
      </div>
    </div>
  );
};
