'use client';

import { useEarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import { useMySchoolRecord } from '@/apis/hooks/use-school-record';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PreApplySection } from '../_components/pre-apply-section';
import { ReportInfo } from '../_components/report-info';
import { useGetPreApplyScores } from '@/apis/hooks/use-bookmarks';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  ChartBarBigIcon,
  CircleAlertIcon,
  FileTextIcon,
  SchoolIcon,
} from 'lucide-react';
import { PageRoutes } from '@/constants/routes';
import { ReportSection } from '../_components/report-section';
import { EarlyAdmissionSection } from '../_components/early-admission-section';
import { useGetActiveSubscriptions } from '@/apis/hooks/use-payments';

export default function ReportPage() {
  const router = useRouter();
  const [selection, setSelection] = useState('1');
  const { id } = useParams<{ id: string }>();

  const {
    data: earlyAdmission,
    isPending: isEarlyAdmissionPending,
    isError: isEarlyAdmissionError,
    refetch: refetchEarlyAdmission,
  } = useEarlyAdmissionDetail(Number(id));
  const {
    data: schoolRecord,
    isPending: isSchoolRecordPending,
    isError: isSchoolRecordError,
    refetch: refetchSchoolRecord,
  } = useMySchoolRecord();
  const {
    data: preApplyScores,
    isPending: isPreApplyPending,
    isError: isPreApplyError,
    refetch: refetchPreApply,
  } = useGetPreApplyScores(Number(id));
  const { data: subscriptions } = useGetActiveSubscriptions();

  const isSubscribed = subscriptions?.some(
    (subscription) => subscription.serviceCode === 'S'
  );

  if (isEarlyAdmissionPending) return <LoadingSection />;
  if (isEarlyAdmissionError)
    return <ErrorSection onRetry={refetchEarlyAdmission} />;

  if (isSchoolRecordPending) return <LoadingSection />;
  if (isSchoolRecordError)
    return <ErrorSection onRetry={refetchSchoolRecord} />;

  if (isPreApplyPending) return <LoadingSection />;
  if (isPreApplyError) return <ErrorSection onRetry={refetchPreApply} />;

  return (
    <div className='px-4 py-8'>
      <section className='mx-auto max-w-7xl py-14 md:px-4'>
        <div className='flex flex-col gap-12 md:gap-10'>
          <div>
            <Button
              size={'sm'}
              variant={'ghost'}
              onClick={() => router.push(PageRoutes.APP_BOOKMARK)}
            >
              <ArrowLeftIcon className='size-4' /> 목록으로
            </Button>
          </div>
          <ReportInfo earlyAdmission={earlyAdmission} />
          <div className='space-y-8'>
            <div className='rounded-lg border bg-muted/30 p-4'>
              <h3 className='mb-3 flex items-center gap-2 font-semibold text-foreground text-red-500'>
                <CircleAlertIcon className='mt-0.5 size-5' /> 레포트 유의사항
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                {[
                  '모집인원은 대학별 수시모집 이월인원에 따라 변경될 수 있으니 꼭! 대학별 최종 정시 모집요강을 확인하시길 바랍니다.',
                  "분석REPORT는 지난 년도 대학발표 합격자 통계자료와 올해 변화된 내용을 토대로 '그리날다'에서 자체 분석한 자료로 실제 결과와 일치하지는 않습니다.",
                  '분석REPORT는 미대입시를 준비하는 학생, 학부모, 교사를 위한 참고자료일뿐 절대적인 기준은 아닙니다.',
                  "분석REPORT 내의 '내 환산점'은 해당 대학별 모집요강에 공지된 수능점수 산출방법(가감점 포함)을 최대한 따른 것이며, 산출방법이 명확하지 않은 대학은 오차가 발생할 가능성이 있습니다. 이에 대해 그리날다에게 법적인 책임을 물을 수 없습니다.",
                  '수능성적은 미대입시 특성상 합격에 절대적인 영향을 미치지 않습니다. 본인의 실기 경쟁력에 대한 실기담당 선생님의 의견을 반영 해야 합니다.',
                  '실기, 면접, 학생부의 전형요소 점수로 합격여부가 달라질 수 있습니다.',
                  '전형 요소에 따라 수능100%, 실기100% 전형의 경우 해당 내용 외의 내용은 표기되지 않습니다.',
                  '수능발표 이후 영역별 최고점을 반영하는 대학의 경우 해당 대학의 변환점이 달라질 수 있으니 사이트에 표기되는 내용을 꼭 확인해 주세요.',
                  '수능발표 이후 학교별 변환점수를 반영하는 대학의 경우 해당 대학의 변환점이 달라질 수 있으니 사이트에 표기되는 내용을 꼭 확인해 주세요.',
                ].map((text, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='mt-1 h-1.5 w-1.5 rounded-full bg-red-500/70' />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Tabs value={selection} onValueChange={setSelection}>
              <div className='relative'>
                <div className='overflow-auto'>
                  <div className='container min-w-fit'>
                    <TabsList className='h-auto'>
                      <TabsTrigger
                        className='flex items-center gap-2 text-base'
                        key={'1'}
                        value={'1'}
                      >
                        <ChartBarBigIcon className='size-4' /> 모의지원 현황
                      </TabsTrigger>
                      <TabsTrigger
                        className='flex items-center gap-2 text-base'
                        key={'2'}
                        value={'2'}
                      >
                        <FileTextIcon className='size-4' /> 리포트
                      </TabsTrigger>
                      <TabsTrigger
                        className='flex items-center gap-2 text-base'
                        key={'3'}
                        value={'3'}
                      >
                        <SchoolIcon className='size-4' />
                        모집요강
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </div>
              <div className='container'>
                <TabsContent key={'1'} value={'1'}>
                  <PreApplySection
                    schoolRecord={schoolRecord}
                    earlyAdmission={earlyAdmission}
                    preApplyScores={preApplyScores}
                  />
                </TabsContent>
                <TabsContent key={'2'} value={'2'}>
                  <ReportSection
                    schoolRecord={schoolRecord}
                    earlyAdmission={earlyAdmission}
                    preApplyScores={preApplyScores}
                    isSubscribed={isSubscribed ?? false}
                  />
                </TabsContent>
                <TabsContent key={'3'} value={'3'}>
                  <EarlyAdmissionSection earlyAdmission={earlyAdmission} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
