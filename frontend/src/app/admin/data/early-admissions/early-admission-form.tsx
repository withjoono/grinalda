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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandInput,
  CommandList,
  CommandGroup,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCreateEarlyAdmission,
  useUpdateEarlyAdmission,
} from '@/apis/hooks/admin/use-admin-early-admissions';
import { University } from '@/apis/hooks/use-universities';
import { SearchTag } from '@/apis/hooks/use-search-tags';
import { AdmissionType } from '@/apis/hooks/use-admission-types';
import { EarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';

const FormSchema = z.object({
  year: z.string(),
  admissionName: z.string().min(2, {
    message: '학교별 전형명은 2글자 이상이어야 합니다.',
  }),
  departmentName: z.string().min(2, {
    message: '학과명은 2글자 이상이어야 합니다.',
  }),
  universityId: z.string(),
  admissionTypeId: z.string(),
  searchTagIds: z.array(z.string()),

  quota: z.string(), // 모집인원
  totalApplicants: z.string(), // 지원인원
  competitionRate: z.string(), // 경쟁률
  lastYearQuota: z.string(), // 전년도 모집인원
  lastYearApplicants: z.string(), // 전년도 지원인원
  lastYearCompetitionRate: z.string(), // 전년도 경쟁률
  elementReflectionRatioInfo: z.string(), // 전형요소 반영비율 (학생부교과100, 서류100 등)
  practicalSubjectInfo: z.string(), // 실기과목정보 (비실기, 기초디자인 4절/4시간 등)

  studentRecordRatio: z.string(), // 학생부비율(ex. 150/500)
  convertCut: z.string(), // 예상점수_환산점
  gradeCut: z.string(), // 예상점수_등급

  // 전년도 대학발표 통계자료
  passStatistics: z.string(), // 전년도 대학발표 합격자 통계
  convertedTotalScore: z.string(), // 교과환산 총점
  convertedScore50: z.string(), // 교과환산 50컷
  convertedScore70: z.string(), // 교과환산 70컷
  gradeScore50: z.string(), // 교과등급 50컷
  gradeScore70: z.string(), // 교과등급 70컷
  changesFromPrevYear: z.string(), // 전년도 대비 변경내용 및 포인트
  waitlistRateInfo: z.string(), // 전년도 예비합격 순위 및 충원율

  // 스케줄 정보
  applicationPeriod: z.string().optional(),
  examLocationAnnouncement: z.string().optional(),
  examDate: z.string().optional(),
  resultAnnouncement: z.string().optional(),
  documentSubmissionPeriod: z.string().optional(),
  otherInfo: z.string().optional(),

  // 추가 정보
  eligibilityCriteria: z.string().optional(),
  minimumAcademicRequirement: z.string().optional(),
  gedAllowed: z.boolean().optional(),

  // 학생부 반영 방법
  firstGradeRatio: z.string().optional(),
  secondGradeRatio: z.string().optional(),
  thirdGradeRatio: z.string().optional(),
  subjectRatio: z.string().optional(),
  attendanceRatio: z.string().optional(),
  volunteerRatio: z.string().optional(),
  reflectedSubjects: z.string().optional(),
  gradeIndicator: z.string().optional(),

  // 등급별 점수
  grade1Score: z.string().optional(),
  grade2Score: z.string().optional(),
  grade3Score: z.string().optional(),
  grade4Score: z.string().optional(),
  grade5Score: z.string().optional(),
  grade6Score: z.string().optional(),
  grade7Score: z.string().optional(),
  grade8Score: z.string().optional(),
  grade9Score: z.string().optional(),
});

interface EarlyAdmissionFormProps {
  universities: University[];
  searchTags: SearchTag[];
  admissionTypes: AdmissionType[];
  initialData?: EarlyAdmissionDetail;
}

export default function EarlyAdmissionForm({
  universities,
  searchTags,
  admissionTypes,
  initialData,
}: EarlyAdmissionFormProps) {
  const router = useRouter();
  const { mutateAsync: createEarlyAdmission } = useCreateEarlyAdmission();
  const { mutateAsync: updateEarlyAdmission } = useUpdateEarlyAdmission();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      year:
        initialData?.year?.toString() ||
        (new Date().getFullYear() + 1).toString(),
      admissionName: initialData?.admissionName || '',
      departmentName: initialData?.departmentName || '',
      universityId: initialData?.university?.id?.toString() || '',
      admissionTypeId: initialData?.admissionType?.id?.toString() || '',
      searchTagIds:
        initialData?.searchTags?.map((tag: SearchTag) => tag.id.toString()) ||
        [],
      quota: initialData?.quota || '',
      totalApplicants: initialData?.totalApplicants || '',
      competitionRate: initialData?.competitionRate || '',
      lastYearQuota: initialData?.lastYearQuota || '',
      lastYearApplicants: initialData?.lastYearApplicants || '',
      lastYearCompetitionRate: initialData?.lastYearCompetitionRate || '',
      elementReflectionRatioInfo: initialData?.elementReflectionRatioInfo || '',
      practicalSubjectInfo: initialData?.practicalSubjectInfo || '',
      studentRecordRatio: initialData?.studentRecordRatio || '',
      convertCut: initialData?.convertCut || '',
      gradeCut: initialData?.gradeCut || '',

      // 전년도 대학발표 통계자료
      passStatistics:
        initialData?.earlyAdmissionPrevResult.passStatistics || '',
      convertedTotalScore:
        initialData?.earlyAdmissionPrevResult.convertedTotalScore || '',
      convertedScore50:
        initialData?.earlyAdmissionPrevResult.convertedScore50 || '',
      convertedScore70:
        initialData?.earlyAdmissionPrevResult.convertedScore70 || '',
      gradeScore50: initialData?.earlyAdmissionPrevResult.gradeScore50 || '',
      gradeScore70: initialData?.earlyAdmissionPrevResult.gradeScore70 || '',
      changesFromPrevYear:
        initialData?.earlyAdmissionPrevResult.changesFromPrevYear ||
        '◆ 변화 없음',
      waitlistRateInfo:
        initialData?.earlyAdmissionPrevResult.waitlistRateInfo || '',

      // 스케줄 정보
      applicationPeriod:
        initialData?.earlyAdmissionSchedule?.applicationPeriod || '',
      examLocationAnnouncement:
        initialData?.earlyAdmissionSchedule?.examLocationAnnouncement || '',
      examDate: initialData?.earlyAdmissionSchedule?.examDate || '',
      resultAnnouncement:
        initialData?.earlyAdmissionSchedule?.resultAnnouncement || '',
      documentSubmissionPeriod:
        initialData?.earlyAdmissionSchedule?.documentSubmissionPeriod || '',
      otherInfo: initialData?.earlyAdmissionSchedule?.otherInfo || '',

      // 추가 정보
      eligibilityCriteria:
        initialData?.earlyAdmissionAdditionalInfo?.eligibilityCriteria || '',
      minimumAcademicRequirement:
        initialData?.earlyAdmissionAdditionalInfo?.minimumAcademicRequirement ||
        '',
      gedAllowed:
        initialData?.earlyAdmissionAdditionalInfo?.gedAllowed === '가'
          ? true
          : false,

      // 학생부 반영 방법
      firstGradeRatio:
        initialData?.schoolRecordReflectionMethod?.firstGradeRatio?.toString() ||
        '',
      secondGradeRatio:
        initialData?.schoolRecordReflectionMethod?.secondGradeRatio?.toString() ||
        '',
      thirdGradeRatio:
        initialData?.schoolRecordReflectionMethod?.thirdGradeRatio?.toString() ||
        '',
      subjectRatio:
        initialData?.schoolRecordReflectionMethod?.subjectRatio?.toString() ||
        '',
      attendanceRatio:
        initialData?.schoolRecordReflectionMethod?.attendanceRatio?.toString() ||
        '',
      volunteerRatio:
        initialData?.schoolRecordReflectionMethod?.volunteerRatio?.toString() ||
        '',
      reflectedSubjects:
        initialData?.schoolRecordReflectionMethod?.reflectedSubjects || '',
      gradeIndicator:
        initialData?.schoolRecordReflectionMethod?.gradeIndicator || '',

      // 등급별 점수
      grade1Score:
        initialData?.schoolRecordReflectionMethod?.grade1Score?.toString() ||
        '',
      grade2Score:
        initialData?.schoolRecordReflectionMethod?.grade2Score?.toString() ||
        '',
      grade3Score:
        initialData?.schoolRecordReflectionMethod?.grade3Score?.toString() ||
        '',
      grade4Score:
        initialData?.schoolRecordReflectionMethod?.grade4Score?.toString() ||
        '',
      grade5Score:
        initialData?.schoolRecordReflectionMethod?.grade5Score?.toString() ||
        '',
      grade6Score:
        initialData?.schoolRecordReflectionMethod?.grade6Score?.toString() ||
        '',
      grade7Score:
        initialData?.schoolRecordReflectionMethod?.grade7Score?.toString() ||
        '',
      grade8Score:
        initialData?.schoolRecordReflectionMethod?.grade8Score?.toString() ||
        '',
      grade9Score:
        initialData?.schoolRecordReflectionMethod?.grade9Score?.toString() ||
        '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData = {
        year: Number(data.year),
        admissionName: data.admissionName,
        departmentName: data.departmentName,
        universityId: Number(data.universityId),
        admissionTypeId: Number(data.admissionTypeId),
        searchTagIds: data.searchTagIds.map(Number),
        quota: data.quota,
        totalApplicants: data.totalApplicants,
        competitionRate: data.competitionRate,
        lastYearQuota: data.lastYearQuota,
        lastYearApplicants: data.lastYearApplicants,
        lastYearCompetitionRate: data.lastYearCompetitionRate,
        elementReflectionRatioInfo: data.elementReflectionRatioInfo,
        practicalSubjectInfo: data.practicalSubjectInfo,
        studentRecordRatio: data.studentRecordRatio,
        convertCut: data.convertCut,
        gradeCut: data.gradeCut,

        // 전년도 대학발표 통계자료
        passStatistics: data.passStatistics,
        convertedTotalScore: data.convertedTotalScore,
        convertedScore50: data.convertedScore50,
        convertedScore70: data.convertedScore70,
        gradeScore50: data.gradeScore50,
        gradeScore70: data.gradeScore70,
        changesFromPrevYear: data.changesFromPrevYear,
        waitlistRateInfo: data.waitlistRateInfo,

        // 스케줄 정보
        applicationPeriod: data.applicationPeriod,
        examLocationAnnouncement: data.examLocationAnnouncement,
        examDate: data.examDate,
        resultAnnouncement: data.resultAnnouncement,
        documentSubmissionPeriod: data.documentSubmissionPeriod,
        otherInfo: data.otherInfo,

        // 추가 정보
        eligibilityCriteria: data.eligibilityCriteria,
        minimumAcademicRequirement: data.minimumAcademicRequirement,
        gedAllowed: data.gedAllowed,

        // 학생부 반영 방법
        firstGradeRatio: data.firstGradeRatio ? data.firstGradeRatio : '',
        secondGradeRatio: data.secondGradeRatio ? data.secondGradeRatio : '',
        thirdGradeRatio: data.thirdGradeRatio ? data.thirdGradeRatio : '',
        subjectRatio: data.subjectRatio ? data.subjectRatio : '',
        attendanceRatio: data.attendanceRatio ? data.attendanceRatio : '',
        volunteerRatio: data.volunteerRatio ? data.volunteerRatio : '',
        reflectedSubjects: data.reflectedSubjects,
        gradeIndicator: data.gradeIndicator,

        // 등급별 점수
        grade1Score: data.grade1Score ? data.grade1Score : '',
        grade2Score: data.grade2Score ? data.grade2Score : '',
        grade3Score: data.grade3Score ? data.grade3Score : '',
        grade4Score: data.grade4Score ? data.grade4Score : '',
        grade5Score: data.grade5Score ? data.grade5Score : '',
        grade6Score: data.grade6Score ? data.grade6Score : '',
        grade7Score: data.grade7Score ? data.grade7Score : '',
        grade8Score: data.grade8Score ? data.grade8Score : '',
        grade9Score: data.grade9Score ? data.grade9Score : '',
      };

      if (initialData) {
        await updateEarlyAdmission({ id: initialData.id, ...formData });
      } else {
        await createEarlyAdmission(formData);
      }

      toast.success('수시전형 추가/수정에 성공했습니다.');
      router.replace(PageRoutes.ADMIN_EARLY_ADMISSIONS);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('수시전형 추가/수정에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {initialData ? '수시전형 수정' : '수시전형 추가'}
          </h1>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                router.back();
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
          <div className='col-span-6 space-y-4 lg:col-span-3'>
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid grid-cols-3 gap-2'>
                    <FormField
                      control={form.control}
                      name='year'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>연도</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='admissionName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>학교별 전형명</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 일반학생' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='departmentName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>학과명</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 융합디자인학과'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <FormField
                      control={form.control}
                      name='universityId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>대학교</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-[200px] justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? universities.find(
                                        (university) =>
                                          university.id.toString() ===
                                          field.value
                                      )?.name
                                    : '대학교 선택'}
                                  <ChevronsUpDown className='opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='대학교 검색' />
                                <CommandList>
                                  <CommandEmpty>
                                    검색 결과가 없습니다.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {universities.map((university) => (
                                      <CommandItem
                                        key={university.id}
                                        value={university.id.toString()}
                                        onSelect={() => {
                                          form.setValue(
                                            'universityId',
                                            university.id.toString()
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2',
                                            university.id.toString() ===
                                              field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {university.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='admissionTypeId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전형 유형</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-[200px] justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? admissionTypes.find(
                                        (type) =>
                                          type.id.toString() === field.value
                                      )?.name
                                    : '전형 유형 선택'}
                                  <ChevronsUpDown className='opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='전형 유형 검색' />
                                <CommandList>
                                  <CommandEmpty>
                                    검색 결과가 없습니다.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {admissionTypes.map((type) => (
                                      <CommandItem
                                        key={type.id}
                                        value={type.id.toString()}
                                        onSelect={() => {
                                          form.setValue(
                                            'admissionTypeId',
                                            type.id.toString()
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2',
                                            type.id.toString() === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {type.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    <FormField
                      control={form.control}
                      name='quota'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>모집인원</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 25' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='totalApplicants'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>지원인원</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 50' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='competitionRate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>경쟁률</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 2.00' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    <FormField
                      control={form.control}
                      name='lastYearQuota'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전년도 모집인원</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 25' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastYearApplicants'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전년도 지원인원</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 50' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastYearCompetitionRate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전년도 경쟁률</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 2.00' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <FormField
                      control={form.control}
                      name='elementReflectionRatioInfo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>요소 반영 비율 정보</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 학생부교과100, 서류100 등'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='practicalSubjectInfo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>실기 과목 정보</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 비실기, 기초디자인 4절/4시간 등'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    <FormField
                      control={form.control}
                      name='studentRecordRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>학생부총점/전형총점</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 150/500' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='convertCut'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>예상점수(환산점)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 197.5' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='gradeCut'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>예상점수(등급)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 2.28' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='searchTagIds'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>검색 태그</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between',
                                  !field.value?.length &&
                                    'text-muted-foreground'
                                )}
                              >
                                {field.value?.length > 0
                                  ? `${field.value.length}개의 태그 선택됨`
                                  : '태그 선택'}
                                <ChevronsUpDown className='opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='태그를 입력하세요...' />
                              <CommandList className='h-[200px] overflow-y-auto'>
                                <CommandEmpty>결과가 없습니다.</CommandEmpty>
                                {searchTags.map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    className='cursor-pointer'
                                    onSelect={() => {
                                      if (
                                        !field.value.includes(tag.id.toString())
                                      ) {
                                        field.onChange([
                                          ...field.value,
                                          tag.id.toString(),
                                        ]);
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2',
                                        field.value.includes(tag.id.toString())
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {tag.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {field.value.map((tagId) => {
                            const tag = searchTags.find(
                              (t) => t.id.toString() === tagId
                            );
                            return (
                              <Badge
                                key={tagId}
                                className='badge cursor-pointer'
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter((id) => id !== tagId)
                                  );
                                }}
                              >
                                {tag?.name}
                              </Badge>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 전형 일정 */}
            <Card>
              <CardHeader>
                <CardTitle>전형 일정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid gap-4 lg:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='applicationPeriod'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>원서접수기간</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 9. 9(월) ~ 13(금)17:00'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='examLocationAnnouncement'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>면접 일정 및 고사장 안내</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 10. 29(화)17:00
 *세부 고사일정은 9월 초(원서접수 이전) 안내 예정'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 lg:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='examDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>시험일</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 10. 10(목)' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='resultAnnouncement'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>합격자 발표</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 11. 12(화)17:00'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='documentSubmissionPeriod'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>서류제출 기한</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='예) 9. 9(월)12:00 ~ 20(금)18:00'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='otherInfo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>기타 정보</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='예) 학교장추천서 제출: 9. 19(목)9:00 ~ 25(수)18:00'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='col-span-6 space-y-4 lg:col-span-3'>
            {/* 전년도 대학발표 통계자료 */}
            <Card>
              <CardHeader>
                <CardTitle>전년도 대학발표 통계자료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='changesFromPrevYear'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전년도 대비 변경내용 및 포인트</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder='예) ◆ 변화 없음' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='passStatistics'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>합격자 통계</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='예) [수능최저] 충족인원:38 / 충족률: 63.3% (실질경쟁률: 6.3)
 [학생부교과 환산점수(1000)] 50%컷:996.83 / 70%컷:996.77
 [학생부교과 등급] 50%컷:2.64 / 70%컷:2.73'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-3 gap-2'>
                    <FormField
                      control={form.control}
                      name='convertedTotalScore'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>환산 총점</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 600' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='convertedScore50'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>환산점수(50%)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 300' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='convertedScore70'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>환산점수(70%)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 250' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <FormField
                      control={form.control}
                      name='gradeScore50'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>등급컷(50%)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 2.28' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='gradeScore70'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>등급컷(70%)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 2.52' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='waitlistRateInfo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전년도 예비합격 순위 및 충원율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='신설전형 or 14' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 지원 자격 */}
            <Card>
              <CardHeader>
                <CardTitle>지원 자격</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='eligibilityCriteria'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>지원자격 기준</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='예) 고등학교 졸업 예정 자 또는 법령에 의하여 고등학교 졸업학력과 동등이상의 학력이 있다고 인정되는 자'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='minimumAcademicRequirement'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>최저학력 기준</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='예) 국어, 수학, 영어, 탐구(상위1개과목)모두 응시하고, 상위2개 영역의 등급 합이 7등급이내  [공통]수능 한국사 6등급 이내'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='gedAllowed'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel>검정고시 지원 가능</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 학생부 반영 방법 */}
            <Card>
              <CardHeader>
                <CardTitle>학생부 반영 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid gap-4 lg:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='firstGradeRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1학년 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 100' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='secondGradeRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2학년 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 100' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='thirdGradeRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3학년 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 100' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 lg:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='subjectRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>교과 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 90' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='attendanceRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>출석 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 10' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='volunteerRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>봉사 반영비율</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 0' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='reflectedSubjects'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반영교과</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='예) 국어, 수학, 영어, 통합사회, 통합과학, 한국사, 사회(학년별, 교과별 가중치 없음) / 진로선택과목: A:1등급, B:2등급, C:4등급
 ※ 검정고시 합격자: 검정고시 전 과목 성적을 다음과 같이 석차등급으로 환산하고 이수..'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid gap-4 lg:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='gradeIndicator'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>활용지표</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='예) 석차등급, 이수단위, 성취도'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 등급별 점수 */}
                  <div className='grid gap-4 lg:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='grade1Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 30' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade2Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 29.4' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade3Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 28.5' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade4Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 27.6' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade5Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>5등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 26.7' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade6Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>6등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 25.8' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade7Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>7등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 24.9' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade8Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>8등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 24.9' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='grade9Score'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>9등급 반영점수</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='예) 24.9' />
                          </FormControl>
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
      </form>
    </Form>
  );
}
