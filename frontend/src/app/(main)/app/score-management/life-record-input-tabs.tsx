'use client';

import React, { useMemo } from 'react';
import { useUserLifeRecord } from './use-user-life-record';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { MinusIcon } from 'lucide-react';
import { AttendanceInputItem } from './attendance-input-item';
import { SubjectInputItem } from './subject-input-item';
import { SelectSubjectInputItem } from './select-subject-item';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllSubjects } from '@/apis/hooks/use-subjects';
import { normalizeSubjectName } from '@/lib/utils';

export const LifeRecordInputTabs = () => {
  const { data: schoolSubjects } = useAllSubjects();

  const subjectGroups = schoolSubjects
    ?.map((n) => {
      return {
        ...n,
        subjects: n.subjects.filter((subject) => subject.typeCode !== 3),
      };
    })
    .filter((n) => n.subjects.length);

  const selectSubjectGroups = schoolSubjects
    ?.map((n) => {
      return {
        ...n,
        subjects: n.subjects.filter((subject) => subject.typeCode === 3),
      };
    })
    .filter((n) => n.subjects.length);

  const subjectNameToIdMapper = useMemo(() => {
    const mapper: { [key: string]: number } = {};
    schoolSubjects?.forEach((n) => {
      const normalizedName = normalizeSubjectName(n.name);
      mapper[normalizedName] = n.id;
    });
    return mapper;
  }, [schoolSubjects]);

  const {
    currentGrade,
    setCurrentGrade,
    subjects,
    selectSubjects,
    attendance,
    onChangeAttendanceValue,
    onChangeSelectSubjectValue,
    onChangeSubjectValue,
    onClickAddOrDelLine,
    onClickSaveGrade,
    isLoading,
    error,
    refetchSchoolRecord,
    // setMockSchoolRecord,

    onClickParseSchoolRecord,
    isUploading,
  } = useUserLifeRecord({ subjectNameToIdMapper });

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onClickParseSchoolRecord(file);
    }
  };

  const handleParseSchoolRecord = () => {
    // input에 id가 file인 요소 클릭
    const input = document.getElementById('file');
    if (input) {
      input.click();
    }
  };

  const renderGradeButtons = useMemo(
    () => (
      <div className='flex items-center gap-4'>
        {[1, 2, 3].map((grade) => (
          <Button
            key={grade}
            type='button'
            onClick={() => setCurrentGrade(grade)}
            variant={currentGrade === grade ? 'default' : 'outline'}
          >
            {grade}학년
          </Button>
        ))}
      </div>
    ),
    [currentGrade, setCurrentGrade]
  );

  const renderAttendanceSection = useMemo(
    () => (
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-semibold'>출결</h4>
        </div>
        <div className='space-y-2 overflow-x-auto p-2'>
          <div className='flex items-end space-x-2 text-xs font-semibold text-primary'>
            <div className='min-w-[80px]'>학년</div>
            <div className='min-w-[80px]'>수업일수</div>
            <div className='min-w-[200px] items-center'>
              <div className='text-center text-blue-500'>결석일수</div>
              <div className='flex items-center justify-around'>
                <div>질병</div>
                <div>무단</div>
                <div>기타</div>
              </div>
            </div>
            <div className='min-w-[200px] items-center'>
              <div className='text-center text-blue-500'>지각</div>
              <div className='flex items-center justify-around'>
                <div>질병</div>
                <div>무단</div>
                <div>기타</div>
              </div>
            </div>
            <div className='min-w-[200px] items-center'>
              <div className='text-center text-blue-500'>조퇴</div>
              <div className='flex items-center justify-around'>
                <div>질병</div>
                <div>무단</div>
                <div>기타</div>
              </div>
            </div>
            <div className='min-w-[200px] items-center'>
              <div className='text-center text-blue-500'>결과</div>
              <div className='flex items-center justify-around'>
                <div>질병</div>
                <div>무단</div>
                <div>기타</div>
              </div>
            </div>
          </div>
          <div className='pb-4'>
            <AttendanceInputItem
              attendanceItem={attendance}
              onChangeAttendanceValue={onChangeAttendanceValue}
            />
          </div>
        </div>
      </section>
    ),
    [attendance, onChangeAttendanceValue]
  );

  const renderSubjectSection = useMemo(
    () => (
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='text-lg font-semibold'>
              공통과목 / 일반선택과목 / 전문교과I / 전문교과II
            </h4>
            <p className='text-sm text-foreground/50'>
              석차 등급이 없는 교과의 경우 석차등급은 비워두시면 됩니다
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              className='p-2'
              onClick={() => onClickAddOrDelLine(false, false)}
            >
              <MinusIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='default'
              className='p-2'
              onClick={() => onClickAddOrDelLine(true, false)}
            >
              <PlusIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='space-y-2 overflow-x-auto p-2'>
          <div className='flex items-center space-x-2 text-xs font-semibold text-primary'>
            <div className='min-w-[80px]'>학기</div>
            <div className='min-w-[120px]'>교과</div>
            <div className='min-w-[120px]'>과목</div>
            <div className='min-w-[80px]'>단위수</div>
            <div className='min-w-[80px]'>원점수</div>
            <div className='min-w-[80px]'>과목평균</div>
            <div className='min-w-[80px]'>표준편차</div>
            <div className='min-w-[80px]'>성취도</div>
            <div className='min-w-[80px]'>수강자수</div>
            <div className='min-w-[80px]'>석차등급</div>
          </div>
          <div className='space-y-6 pb-6 lg:space-y-2'>
            {subjects.length ? (
              subjects.map((item, index) => (
                <SubjectInputItem
                  key={`normal-${item.subjectGroupId}-${index}`}
                  index={index}
                  onChangeSubjectValue={onChangeSubjectValue}
                  subject={item}
                  schoolSubjectGroups={subjectGroups || []}
                />
              ))
            ) : (
              <p className='py-8 text-center text-sm text-foreground/60'>
                우측 플러스 버튼을 눌러 과목을 추가해주세요 😄
              </p>
            )}
          </div>
        </div>
      </section>
    ),
    [subjects, onChangeSubjectValue, onClickAddOrDelLine, subjectGroups]
  );

  const renderSelectSubjectSection = useMemo(
    () => (
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-semibold'>진로선택과목</h4>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              className='p-2'
              onClick={() => onClickAddOrDelLine(false, true)}
            >
              <MinusIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='default'
              className='p-2'
              onClick={() => onClickAddOrDelLine(true, true)}
            >
              <PlusIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='space-y-2 overflow-x-auto p-2'>
          <div className='flex items-center gap-2 text-xs font-semibold text-primary'>
            <div className='min-w-[80px]'>학기</div>
            <div className='min-w-[120px]'>교과</div>
            <div className='min-w-[120px]'>과목</div>
            <div className='min-w-[70px]'>단위수</div>
            <div className='min-w-[70px]'>원점수</div>
            <div className='min-w-[70px]'>과목평균</div>
            <div className='min-w-[70px]'>성취도</div>
            <div className='min-w-[70px]'>수강자수</div>
            <div className='min-w-[196px]'>성취도별 분포비율(A,B,C)</div>
          </div>
          <div className='space-y-6 pb-6 lg:space-y-2'>
            {selectSubjects.length ? (
              selectSubjects.map((item, index) => (
                <SelectSubjectInputItem
                  key={`select-${item.subjectGroupId}-${index}`}
                  index={index}
                  subject={item}
                  onChangeSubjectValue={onChangeSelectSubjectValue}
                  schoolSubjectGroups={selectSubjectGroups || []}
                />
              ))
            ) : (
              <p className='py-8 text-center text-sm text-foreground/60'>
                우측 플러스 버튼을 눌러 과목을 추가해주세요 😄
              </p>
            )}
          </div>
        </div>
      </section>
    ),
    [
      selectSubjects,
      onChangeSelectSubjectValue,
      onClickAddOrDelLine,
      selectSubjectGroups,
    ]
  );

  if (isLoading) {
    return <LoadingSection />;
  }

  if (error) {
    return (
      <ErrorSection
        text='생기부 데이터를 불러오는데 실패했습니다.'
        onRetry={refetchSchoolRecord}
      />
    );
  }

  const hasData = subjects.length > 0 || selectSubjects.length > 0;

  return (
    <div className='pb-20'>
      {isUploading ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70'
          style={{ touchAction: 'none' }}
        >
          <div className='flex flex-col items-center justify-center'>
            <p className='animate-bounce pb-4 text-4xl'>🧐</p>
            <p className='pb-2 text-lg font-semibold text-white'>
              생기부 성적을 불러오는 중입니다...
            </p>
            <p className='text-sm text-white'>
              페이지를 나가지 않도록 주의해주세요.(30~40초 소요)
            </p>
          </div>
        </div>
      ) : null}

      <input
        type='file'
        accept='.pdf'
        onChange={onChangeFile}
        className='hidden'
        id='file'
      />

      {/* 생기부 PDF 업로드 섹션 */}
      {hasData ? (
        <section className='mb-6'>
          <div className='rounded-lg border-2 border-solid border-green-500/30 bg-green-50 p-6 text-center dark:bg-green-950/20'>
            <p className='mb-2 text-3xl'>✅</p>
            <p className='mb-1 text-sm font-medium text-green-700 dark:text-green-400'>
              생기부 업로드 완료
            </p>
            <p className='mb-4 text-xs text-muted-foreground'>
              아래에서 성적을 확인하고 수정한 뒤 저장해주세요
            </p>
            <Button
              variant='outline'
              type='button'
              onClick={handleParseSchoolRecord}
              className='gap-2 text-xs'
              size='sm'
            >
              📎 다시 업로드
            </Button>
          </div>
        </section>
      ) : (
        <section className='mb-6'>
          <div className='rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center transition-colors hover:border-primary/50'>
            <p className='mb-2 text-3xl'>📄</p>
            <p className='mb-1 text-sm font-medium'>
              PDF 생기부를 업로드하여 성적을 자동으로 불러옵니다
            </p>
            <p className='mb-4 text-xs text-muted-foreground'>
              업로드 후 아래에서 성적을 확인하고 수정할 수 있습니다
            </p>
            <Button
              type='button'
              onClick={handleParseSchoolRecord}
              className='gap-2'
            >
              📎 생기부 PDF 업로드
            </Button>
          </div>
        </section>
      )}

      {/* 데이터가 있을 때만 성적 섹션 표시 */}
      {hasData && (
        <>
          {renderGradeButtons}
          <div className='flex w-full flex-col items-center space-y-2 py-4'>
            <div className='w-full space-y-4 pt-4'>
              {renderAttendanceSection}
              {renderSubjectSection}
              {renderSelectSubjectSection}
              <div className='flex justify-end gap-2'>
                <Button onClick={onClickSaveGrade}>저장하기</Button>
              </div>
              <div className='flex flex-col items-end text-sm text-foreground/50'>
                <p className='text-right text-sm text-red-500'>
                  성적 수정 시 확정된 모의지원 데이터가 초기화됩니다.
                </p>
                <p>
                  성적 불러오기 후 누락된 과목 및 성적을 수정하고{' '}
                  <b>저장하기 버튼을 눌러주세요</b>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
