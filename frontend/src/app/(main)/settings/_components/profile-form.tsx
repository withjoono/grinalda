'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  UserProfile,
  UserTermsAgreement,
  useUpdateMarketingConsent,
  useUpdateMyProfile,
} from '@/apis/hooks/use-users';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: '이름은 최소 2자 이상이어야 합니다.',
    })
    .max(30, {
      message: '이름은 30자를 초과할 수 없습니다.',
    }),
  email: z.string(),
  grade: z.string(),
  marketingConsent: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile: UserProfile;
  termsAgreement: UserTermsAgreement;
}

export function ProfileForm({ profile, termsAgreement }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const { mutateAsync: updateProfile } = useUpdateMyProfile();
  const { mutateAsync: updateMarketingConsent } = useUpdateMarketingConsent();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      grade: String(profile.grade),
      marketingConsent: termsAgreement.marketingConsent,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      if (!session) {
        toast.error('로그인이 필요합니다.');
        return;
      }

      const grade = Number(data.grade);

      if (grade < 1 || grade > 4) {
        toast.error('학년 정보가 올바르지 않습니다.');
        return;
      }
      await updateProfile({
        name: data.name,
        grade,
      });

      if (data.marketingConsent !== termsAgreement.marketingConsent) {
        await updateMarketingConsent({
          marketingConsent: data.marketingConsent,
        });
      }
      await update({
        user: {
          ...session.user,
          name: data.name,
        },
      });

      toast.success('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('프로필 업데이트에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder='홍길동' {...field} />
              </FormControl>
              <FormDescription>
                공개적으로 표시되는 이름입니다. 실명 또는 닉네임을 사용할 수
                있습니다.
              </FormDescription>
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
                <Input disabled placeholder='example@email.com' {...field} />
              </FormControl>
              <FormDescription>
                계정과 연결된 이메일 주소입니다.
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='학년을 선택해주세요' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='1'>고1</SelectItem>
                  <SelectItem value='2'>고2</SelectItem>
                  <SelectItem value='3'>고3</SelectItem>
                  <SelectItem value='4'>N수</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                계산식에 영향을 미치는 학년 정보입니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='marketingConsent'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>SMS 수신 동의</FormLabel>
                <FormDescription>
                  그리날다의 모의지원, 데이터 업데이트 등 중요 일정을
                  전송해드립니다!
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='profileImage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>프로필 이미지</FormLabel>
              <FormControl>
                <Input placeholder='이미지 URL을 입력하세요' {...field} />
              </FormControl>
              <FormDescription>
                프로필에 표시될 이미지의 URL을 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className='flex justify-end'>
          <Button type='submit' className='w-full lg:w-auto'>
            프로필 업데이트
          </Button>
        </div>
      </form>
    </Form>
  );
}
