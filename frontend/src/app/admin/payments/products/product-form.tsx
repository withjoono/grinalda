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
import { useFieldArray, useForm } from 'react-hook-form';
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
import {
  AdminProduct,
  useCreateProduct,
  useUpdateProduct,
} from '@/apis/hooks/admin/use-admin-products';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const formSchema = z.object({
  name: z.string().min(2, {
    message: '상품 이름은 2글자 이상이어야 합니다.',
  }),
  description: z.string(),
  subText: z.string(),
  subTextAccent: z.boolean(),
  price: z.coerce.number(),
  term: z.coerce.date(),
  categoryCode: z.string(),
  serviceCode: z.string(),
  externalUrl: z.string(),
  features: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  popular: z.boolean(),
  active: z.boolean(),
});

export default function UniversityForm({
  initialData,
}: {
  initialData?: AdminProduct;
}) {
  const router = useRouter();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const [serviceCode, setServiceCode] = useState<string>(
    initialData?.serviceCode || ''
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      subText: initialData?.subText || '',
      subTextAccent: initialData?.subTextAccent || false,
      price: initialData?.price || 0,
      term: initialData?.term || new Date(),
      categoryCode: initialData?.categoryCode || '',
      serviceCode: initialData?.serviceCode || '',
      externalUrl: initialData?.externalUrl || '',
      features:
        initialData?.features.map((feature) => ({
          value: feature,
        })) || [],
      popular: initialData?.popular || false,
      active: initialData?.active || true,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'features',
    control: form.control,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        await updateProduct({
          id: initialData.id,
          name: data.name,
          description: data.description,
          subText: data.subText,
          subTextAccent: data.subTextAccent,
          price: data.price,
          term: data.term,
          categoryCode: data.categoryCode,
          serviceCode: data.serviceCode,
          externalUrl: data.serviceCode === 'C' ? data.externalUrl : '',
          features: data.features?.map((feature) => feature.value) || [],
          popular: data.popular,
          active: data.active,
        });
      } else {
        await createProduct({
          name: data.name,
          description: data.description,
          subText: data.subText,
          subTextAccent: data.subTextAccent,
          price: data.price,
          term: data.term,
          categoryCode: data.categoryCode,
          serviceCode: data.serviceCode,
          externalUrl: data.serviceCode === 'C' ? data.externalUrl : '',
          features: data.features?.map((feature) => feature.value) || [],
          popular: data.popular,
          active: data.active,
        });
      }
      toast.success('상품 추가/수정에 성공했습니다.');
      router.replace(PageRoutes.ADMIN_PRODUCTS);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('상품 추가/수정에 실패했습니다.');
      }
    }
  }

  const categories = [
    { code: 'S', name: '수시' },
    { code: 'C', name: '컨설팅' },
  ];

  const services = [
    { code: 'S', name: '수시' },
    { code: 'C', name: '컨설팅' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {initialData ? '상품 수정' : '상품 추가'}
          </h1>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                router.push(PageRoutes.ADMIN_PRODUCTS);
              }}
            >
              취소
            </Button>
            <Button type='submit'>
              {initialData ? '수정하기' : '추가하기'}
            </Button>
          </div>
        </div>
        <div className='grid gap-4 lg:grid-cols-6'>
          <div className='space-y-4 lg:col-span-4'>
            <Card>
              <CardHeader>
                <CardTitle>상품 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid gap-4 lg:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상품 이름</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='2026년 수시 예측 서비스'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상품 가격(원)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='10000' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상품 설명</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='수시 예측 유료 서비스'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='subText'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>추가 설명</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='2025년 9월 15일까지 사용 가능 or 미대 모든 계열 가능 등'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid gap-4 lg:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='categoryCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>카테고리</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              defaultValue={initialData?.categoryCode}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='카테고리 선택' />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.code}
                                    value={category.code}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            상점탭 분류 카테고리
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='serviceCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>서비스 코드</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              defaultValue={initialData?.serviceCode}
                              onValueChange={(value) => {
                                field.onChange(value);
                                setServiceCode(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='서비스 코드 선택' />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem
                                    key={service.code}
                                    value={service.code}
                                  >
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>S: 수시 유료 서비스</FormDescription>
                          <FormDescription>
                            C: 컨설팅 (컨설팅은 외부 네이버 예약으로 사용)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {serviceCode === 'C' && (
                    <FormField
                      control={form.control}
                      name='externalUrl'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>외부 링크</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='네이버 예약 구매 링크 (https://booking.naver.com/.../)'
                            />
                          </FormControl>
                          <FormDescription>
                            컨설팅 결제는 네이버 예약에서 관리합니다. 컨설팅
                            서비스에서 제공하는 이용권은 쿠폰 발급을 통해
                            유저에게 제공합니다.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='space-y-4 lg:col-span-2'>
            <FormField
              control={form.control}
              name='active'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>활성 여부</FormLabel>
                    <FormDescription>
                      상품 활성 여부 (상점 표시)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subTextAccent'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>추가설명 강조 여부</FormLabel>
                    <FormDescription>빨간색 강조 표시</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='popular'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>인기 상품 여부</FormLabel>
                    <FormDescription>
                      인기 상품 여부 (상품 강조 표시)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='term'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>상품 만료 기간</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy.MM.dd')
                          ) : (
                            <span>날짜 선택</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        locale={ko}
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    해당 날짜 이후(+1) 서비스 이용불가
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`features.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && 'sr-only')}>
                        특징
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && 'sr-only')}>
                        상품 카드에 표시되는 특징
                      </FormDescription>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <Input {...field} />
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => remove(index)}
                          >
                            삭제
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => append({ value: '' })}
              >
                특징 추가
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
