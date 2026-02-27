import { EarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import {
  Calendar,
  Clock,
  Users,
  GraduationCap,
  PaletteIcon,
  ClipboardCheck,
  PercentIcon,
} from 'lucide-react';

export const EarlyAdmissionSection = ({
  earlyAdmission,
}: {
  earlyAdmission: EarlyAdmissionDetail;
}) => {
  return (
    <div className='mt-12 space-y-4'>
      {/* 입시변화 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <Clock className='h-6 w-6 text-blue-500' />
          <h2 className='text-xl font-bold text-gray-800'>
            전년도 대비 입시 변화
          </h2>
        </div>
        <div className='rounded-lg bg-blue-50/50 p-4'>
          <p className='text-gray-700'>
            {earlyAdmission.earlyAdmissionPrevResult.changesFromPrevYear}
          </p>
        </div>
      </section>

      {/* 전형일정 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <Calendar className='h-6 w-6 text-green-500' />
          <h2 className='text-xl font-bold text-gray-800'>전형 일정</h2>
        </div>

        <div className='space-y-2'>
          {/* 원서접수 */}
          <div className='rounded-lg bg-green-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-green-700'>원서접수</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='w-32 font-semibold text-gray-700'>원서접수기간</p>
                <p className='flex-1'>
                  {earlyAdmission.earlyAdmissionSchedule.applicationPeriod}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='w-32 font-semibold text-gray-700'>서류제출기한</p>
                <p className='flex-1'>
                  {
                    earlyAdmission.earlyAdmissionSchedule
                      .documentSubmissionPeriod
                  }
                </p>
              </div>
            </div>
          </div>

          {/* 고사일정 */}
          <div className='rounded-lg bg-green-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-green-700'>고사일정</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <p className='w-32 font-semibold text-gray-700'>고사장안내</p>
                <p className='flex-1'>
                  {
                    earlyAdmission.earlyAdmissionSchedule
                      .examLocationAnnouncement
                  }
                </p>
              </div>
              <div className='space-y-2'>
                <p className='w-32 font-semibold text-gray-700'>시험일</p>
                <p className='flex-1'>
                  {earlyAdmission.earlyAdmissionSchedule.examDate}
                </p>
              </div>
              {earlyAdmission.earlyAdmissionSchedule.otherInfo && (
                <div className='space-y-2'>
                  <p className='w-32 font-semibold text-gray-700'>기타</p>
                  <p className='flex-1'>
                    {earlyAdmission.earlyAdmissionSchedule.otherInfo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 합격자발표 */}
          <div className='rounded-lg bg-green-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-green-700'>합격자발표</h3>
            <div className='space-y-2'>
              <p className='w-32 font-semibold text-gray-700'>발표일정</p>
              <p className='flex-1'>
                {earlyAdmission.earlyAdmissionSchedule.resultAnnouncement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 모집인원 및 1개년 모집결과 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <Users className='h-6 w-6 text-purple-500' />
          <h2 className='text-xl font-bold text-gray-800'>모집 현황</h2>
        </div>
        <div className='space-y-2'>
          <div className='rounded-lg bg-purple-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-purple-700'>
              올해 모집인원
            </h3>
            <p className='text-gray-700'>{earlyAdmission.quota}명</p>
          </div>

          <div className='rounded-lg bg-purple-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-purple-700'>
              전년도 통계자료
            </h3>
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='space-y-2'>
                  <p className='w-32 font-semibold text-gray-700'>모집인원</p>
                  <p className='flex-1'>{earlyAdmission.lastYearQuota}명</p>
                </div>
                <div className='space-y-2'>
                  <p className='w-32 font-semibold text-gray-700'>지원자</p>
                  <p className='flex-1'>
                    {earlyAdmission.lastYearApplicants}명
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='w-32 font-semibold text-gray-700'>경쟁률</p>
                  <p className='flex-1'>
                    {earlyAdmission.lastYearCompetitionRate}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='w-32 font-semibold text-gray-700'>
                    예비순위 충원율
                  </p>
                  <p className='flex-1'>
                    {earlyAdmission.earlyAdmissionPrevResult.waitlistRateInfo}
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='w-32 font-semibold text-gray-700'>합격자 통계</p>
                <p className='flex-1'>
                  {earlyAdmission.earlyAdmissionPrevResult.passStatistics}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전형 요소별 반영비율 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <PercentIcon className='h-6 w-6 text-amber-500' />
          <h2 className='text-xl font-bold text-gray-800'>
            전형 요소별 반영비율
          </h2>
        </div>
        <div className='space-y-2'>
          <div className='rounded-lg bg-amber-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-amber-700'>반영비율</h3>
            <p className='text-gray-700'>
              {earlyAdmission.elementReflectionRatioInfo}
            </p>
          </div>
        </div>
      </section>

      {/* 지원자격 및 기타 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <ClipboardCheck className='h-6 w-6 text-teal-500' />
          <h2 className='text-xl font-bold text-gray-800'>지원자격 및 기타</h2>
        </div>
        <div className='space-y-2'>
          <div className='rounded-lg bg-teal-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-teal-700'>지원자격</h3>
            <p className='text-gray-700'>
              {earlyAdmission.earlyAdmissionAdditionalInfo.eligibilityCriteria}
            </p>
          </div>
          <div className='rounded-lg bg-teal-50/50 p-4'>
            <h3 className='mb-3 font-semibold text-teal-700'>
              수능성적 반영 및 검정고시
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-semibold text-gray-700'>
                  최저학력기준
                </span>
                <p className='mt-1 text-gray-700'>
                  {
                    earlyAdmission.earlyAdmissionAdditionalInfo
                      .minimumAcademicRequirement
                  }
                </p>
              </div>
              <div>
                <span className='font-semibold text-gray-700'>검정고시</span>
                <p className='mt-1 text-gray-700'>
                  {earlyAdmission.earlyAdmissionAdditionalInfo.gedAllowed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 학생부 반영 방법 */}
      <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
        <div className='mb-6 flex items-center gap-2'>
          <GraduationCap className='h-6 w-6 text-indigo-500' />
          <h2 className='text-xl font-bold text-gray-800'>학생부 반영 방법</h2>
        </div>
        <div className='space-y-2'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {['1학년', '2학년', '3학년'].map((grade, index) => (
              <div key={grade} className='rounded-lg bg-indigo-50/50 p-4'>
                <h3 className='mb-2 font-semibold text-indigo-700'>{grade}</h3>
                <p className='text-gray-700'>
                  {
                    earlyAdmission.schoolRecordReflectionMethod[
                      `${['first', 'second', 'third'][index]}GradeRatio` as keyof typeof earlyAdmission.schoolRecordReflectionMethod
                    ]
                  }
                </p>
              </div>
            ))}
          </div>
          <div className='rounded-lg bg-indigo-50/50 p-4'>
            <h3 className='mb-2 font-semibold text-indigo-700'>등급별 점수</h3>
            <div className='grid grid-cols-9 gap-2 text-sm'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
                <div
                  key={grade}
                  className='rounded-md bg-white p-2 text-center shadow-sm'
                >
                  <div className='font-semibold text-indigo-600'>
                    {grade}등급
                  </div>
                  <div className='mt-1'>
                    {
                      earlyAdmission.schoolRecordReflectionMethod[
                        `grade${grade}Score` as keyof typeof earlyAdmission.schoolRecordReflectionMethod
                      ]
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 실기내용 */}
      {earlyAdmission.practicalSubjectInfo && (
        <section className='rounded-xl border border-gray-200 bg-white p-6 transition-all'>
          <div className='mb-6 flex items-center gap-2'>
            <PaletteIcon className='h-6 w-6 text-rose-500' />
            <h2 className='text-xl font-bold text-gray-800'>실기고사 내용</h2>
          </div>
          <div className='rounded-lg bg-rose-50/50 p-4'>
            <p className='text-gray-700'>
              {earlyAdmission.practicalSubjectInfo}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
