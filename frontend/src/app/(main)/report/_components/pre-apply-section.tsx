import { PreApplyChart } from './pre-apply-chart';
import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { EarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import { calcSubject } from '@/lib/calculators/calc-subject';
import { useMemo } from 'react';
import { useScoreCalculation } from '@/hooks/use-score-calculation';

export const PreApplySection = ({
  schoolRecord,
  earlyAdmission,
  preApplyScores,
}: {
  schoolRecord: UserSchoolRecord;
  earlyAdmission: EarlyAdmissionDetail;
  preApplyScores: { scores: number[] };
}) => {
  const myScore = useMemo(() => {
    return calcSubject(schoolRecord, {
      id: earlyAdmission.id,
      year: earlyAdmission.year,
      departmentName: earlyAdmission.departmentName,
      admissionName: earlyAdmission.admissionName,
      studentRecordRatio: earlyAdmission.studentRecordRatio,
      convertCut: earlyAdmission.convertCut,
      gradeCut: earlyAdmission.gradeCut,
      universityName: earlyAdmission.university.name,
    });
  }, [earlyAdmission, schoolRecord]);

  const {
    preApplyCount,
    minScore,
    maxScore,
    avgScore,
    myRank,
    sameScoreCount,
    // sortedScores
  } = useScoreCalculation(myScore.score, preApplyScores.scores);

  return (
    <div className='mt-12 space-y-4'>
      <div className='rounded-lg border bg-muted/30 p-4'>
        <h3 className='mb-3 font-semibold text-foreground'>
          모의지원 유의사항
        </h3>
        <ul className='space-y-2 text-sm text-muted-foreground'>
          <li className='flex items-start gap-2'>
            <span className='mt-1 h-1.5 w-1.5 rounded-full bg-primary/70' />
            <span>
              지원자의 성적이 해당대학에서 발표한 응시영역을 미충족 할 경우
              통계에서 제외됩니다.
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='mt-1 h-1.5 w-1.5 rounded-full bg-primary/70' />
            <span>
              지원자의 성적이 &quot;그리날다&quot;에서 학과별로 자체계산한 범위
              이하의 성적인 경우 허수범위로 설정됩니다.
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='mt-1 h-1.5 w-1.5 rounded-full bg-primary/70' />
            <span>
              허수범위는 모집단위별 예상합격 최저점에서 구간별 점수차가 일정배수
              이하일때를 뜻합니다.
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='mt-1 h-1.5 w-1.5 rounded-full bg-primary/70' />
            <span>허수범위의 성적은 지원자 리스트 통계에서 제외됩니다.</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='mt-1 h-1.5 w-1.5 rounded-full bg-primary/70' />
            <span>
              해당 학과에 지원한 지원자 모두가 &quot;허수범위&quot;성적인 경우
              본인의 성적 외의 정보는 표시되지 않습니다.
            </span>
          </li>
        </ul>
      </div>
      <section className='flex flex-col gap-4 md:col-span-2 md:grid md:gap-6 lg:grid-cols-2 lg:gap-8'>
        <div>
          <PreApplyChart
            myScore={myScore.score}
            maxScore={maxScore}
            avgScore={avgScore}
            minScore={minScore}
            chartMaxValue={myScore.totalScore}
          />
        </div>
        <div className='flex flex-col justify-center space-y-10 rounded-lg border bg-card px-8 py-4 shadow-sm'>
          <div className='space-y-4 rounded-md bg-background'>
            <h3 className='text-base font-semibold tracking-tight md:text-lg'>
              환산점으로 본 내 위치
            </h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>내 점수</p>
                <p className='text-base font-semibold text-primary md:text-lg'>
                  {Number(myScore.score).toFixed(2)}
                </p>
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>최고점</p>
                <p className='text-base font-semibold md:text-lg'>
                  {Number(maxScore).toFixed(2)}
                </p>
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>평균점</p>
                <p className='text-base font-semibold md:text-lg'>
                  {Number(avgScore).toFixed(2)}
                </p>
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>최저점</p>
                <p className='text-base font-semibold md:text-lg'>
                  {Number(minScore).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className='space-y-4 rounded-md bg-background'>
            <h3 className='text-base font-semibold tracking-tight md:text-lg'>
              석차등급으로 본 내 위치
            </h3>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>지원인원</p>
                <p className='text-base font-semibold md:text-lg'>
                  {preApplyCount} 명
                </p>
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>내 등수</p>
                <p className='text-base font-semibold text-primary md:text-lg'>
                  {myRank > 0 ? myRank : '- '}등
                </p>
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm text-muted-foreground'>동점자</p>
                <p className='text-base font-semibold md:text-lg'>
                  {sameScoreCount > 0 ? sameScoreCount : '0 '}명
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
