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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddMediaFromUrl } from '@/components/dialogs/add-media-from-url';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { toast } from 'sonner';
import { University } from '@/apis/hooks/use-universities';
import { Region } from '@/apis/hooks/use-regions';
import {
  useCreateUniversity,
  useUpdateUniversity,
} from '@/apis/hooks/admin/use-admin-universities';

const formSchema = z.object({
  name: z.string().min(2, {
    message: '대학교 이름은 2글자 이상이어야 합니다.',
  }),
  address: z.string(),
  homepage: z.string(),
  regionId: z.string(),
  isVisible: z
    .string()
    .refine((value) => value === 'true' || value === 'false'),
});

export default function UniversityForm({
  regions,
  initialData,
}: {
  regions: Region[];
  initialData?: University;
}) {
  const router = useRouter();
  const { mutateAsync: createUniversity } = useCreateUniversity();
  const { mutateAsync: updateUniversity } = useUpdateUniversity();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      homepage: initialData?.homepage || '',
      regionId: initialData?.region.id.toString() || '',
      isVisible: 'true', // initialData?.isVisible ? 'true' : 'false',
    },
  });
  const [imageUrl, setImageUrl] = useState('');

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        await updateUniversity({
          id: initialData.id,
          name: data.name,
          address: data.address,
          homepage: data.homepage,
          regionId: Number(data.regionId),
        });
      } else {
        await createUniversity({
          name: data.name,
          address: data.address,
          homepage: data.homepage,
          regionId: Number(data.regionId),
        });
      }
      toast.success('대학교 추가/수정에 성공했습니다.');
      router.replace(PageRoutes.ADMIN_UNIVERSITIES);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('대학교 추가/수정에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {initialData ? '대학교 수정' : '대학교 추가'}
          </h1>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                router.push(PageRoutes.ADMIN_UNIVERSITIES);
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
          <div className='col-span-4 space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>대학교 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>대학교 이름</FormLabel>
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
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>주소</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='homepage'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>홈페이지</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='regionId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>지역</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            defaultValue={initialData?.region.id.toString()}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='지역 선택' />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem
                                  key={region.id.toString()}
                                  value={region.id.toString()}
                                >
                                  {region.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          대학교가 위치한 지역을 선택해주세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='col-span-2 space-y-4'>
            {/* -- 대학 로고 이미지 -- */}
            <Card>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>로고 이미지 (준비중)</CardTitle>
                <AddMediaFromUrl setImageUrl={setImageUrl}>
                  <Button variant='link' size='sm' className='!mt-0'>
                    이미지 추가
                  </Button>
                </AddMediaFromUrl>
              </CardHeader>
              <CardContent>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt='University Logo Image'
                    className='h-auto w-full'
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>노출 여부 (준비중)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  name='isVisible'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          defaultValue={
                            'true'
                            // initialData?.isVisible ? 'true' : 'false'
                          }
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='선택' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='false'>숨김</SelectItem>
                              <SelectItem value='true'>보임</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        숨김 상태라면 하위의 모든 전형이 숨겨집니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
