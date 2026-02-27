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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { toast } from 'sonner';
import {
  AccountForAdmin,
  useUpdateAccount,
} from '@/apis/hooks/admin/use-admin-accounts';
import { roles } from './data-table/toolbar-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddMediaFromUrl } from '@/components/dialogs/add-media-from-url';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfileAvatar } from '@/components/ui/profile-avatar';

const FormSchema = z.object({
  role: z.string().refine(
    (value) => {
      return ['ROLE_USER', 'ROLE_TEACHER', 'ROLE_ADMIN'].includes(value);
    },
    {
      message: '유효하지 않은 권한입니다.',
    }
  ),
  name: z.string().min(1, {
    message: '이름은 필수 입력 항목입니다.',
  }),
  grade: z.string().min(1, {
    message: '학년은 필수 입력 항목입니다.',
  }),
});

interface UserFormProps {
  initialData: AccountForAdmin;
}

export default function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const { mutateAsync: updateAccount } = useUpdateAccount();
  const [imageUrl, setImageUrl] = useState(
    initialData?.user.profileImage || ''
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: initialData?.role || '',
      name: initialData?.user.name || '',
      grade: initialData?.user.grade.toString() || '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData = {
        role: data.role,
        name: data.name,
        grade: data.grade,
        profileImage: imageUrl,
      };

      await updateAccount({
        id: initialData.id,
        ...formData,
        grade: Number(data.grade),
      });

      toast.success('유저 수정에 성공했습니다.');
      router.replace(PageRoutes.ADMIN_USERS);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('유저 수정에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>유저 수정</h1>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                router.push(PageRoutes.ADMIN_USERS);
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
          <div className='col-span-6 space-y-4 lg:col-span-4'>
            <div className='w-full'>
              <Card>
                <CardHeader>
                  <CardTitle>계정 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <FormLabel>이메일</FormLabel>
                      <Input value={initialData.email} disabled />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <FormLabel>가입일</FormLabel>
                        <Input
                          value={new Date(
                            initialData.createdAt
                          ).toLocaleString()}
                          disabled
                        />
                      </div>
                      <div className='space-y-2'>
                        <FormLabel>수정일</FormLabel>
                        <Input
                          value={new Date(
                            initialData.updatedAt
                          ).toLocaleString()}
                          disabled
                        />
                      </div>
                    </div>

                    <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <Checkbox
                        checked={initialData.termsAgreement.marketingConsent}
                        disabled
                      />
                      <div className='space-y-1 leading-none opacity-50'>
                        <FormLabel>SMS 수신 동의</FormLabel>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='w-full'>
              <Card>
                <CardHeader>
                  <CardTitle>유저 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid gap-4 lg:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='grade'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>학년 정보</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={initialData?.user.grade.toString()}
                            >
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
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>권한</FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                defaultValue={initialData?.role}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='권한 선택' />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value}
                                    >
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              유저의 권한을 선택해주세요.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='col-span-6 space-y-4 lg:col-span-2'>
            {/* -- 대학 로고 이미지 -- */}
            <Card>
              <CardHeader className='flex flex-col'>
                <div className='flex items-center justify-between'>
                  <CardTitle>프로필 이미지</CardTitle>
                  <AddMediaFromUrl setImageUrl={setImageUrl}>
                    <Button variant='link' size='sm' className='!mt-0'>
                      이미지 추가
                    </Button>
                  </AddMediaFromUrl>
                </div>
                <CardDescription>
                  선생님 혹은 어드민 계정일 경우 프로필 이미지가 노출됩니다.
                  (포스팅, 선생님 프로필 등)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileAvatar
                  profileImage={imageUrl}
                  name={initialData?.user.name}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
