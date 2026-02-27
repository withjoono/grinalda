'use client';

import {
  useAddPreApply,
  useDeleteBookmark,
  useDeletePreApply,
  useMyBookmarks,
  useMyPreApplyIds,
} from '@/apis/hooks/use-bookmarks';
import { useMySchoolRecord } from '@/apis/hooks/use-school-record';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table';
import { calcSubject } from '@/lib/calculators/calc-subject';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { BookmarkItem } from './bookmark-item';

interface ScoreMap {
  [key: number]: {
    success: boolean;
    score: number;
    error?: string;
    totalScore: number;
  };
}

export default function AppBookmark() {
  const {
    data: bookmarks,
    isPending: isBookmarksPending,
    isError: isBookmarksError,
    refetch: refetchBookmarks,
  } = useMyBookmarks();

  const { data: schoolRecord } = useMySchoolRecord();

  const { data: preApplyIds } = useMyPreApplyIds();

  const { mutateAsync: addPreApply } = useAddPreApply();
  const { mutateAsync: deletePreApply } = useDeletePreApply();
  const { mutateAsync: deleteBookmark } = useDeleteBookmark();

  const earlyAdmissionScoreMap = useMemo(() => {
    if (!schoolRecord || !bookmarks) return {} as ScoreMap;
    return bookmarks.reduce<ScoreMap>((acc, bookmark) => {
      acc[bookmark.earlyAdmission.id] = calcSubject(schoolRecord, {
        id: bookmark.earlyAdmission.id,
        year: bookmark.earlyAdmission.year,
        departmentName: bookmark.earlyAdmission.departmentName,
        admissionName: bookmark.earlyAdmission.admissionName,
        studentRecordRatio: bookmark.earlyAdmission.studentRecordRatio,
        convertCut: bookmark.earlyAdmission.convertCut,
        gradeCut: bookmark.earlyAdmission.gradeCut,
        universityName: bookmark.earlyAdmission.university.name,
      });

      return acc;
    }, {});
  }, [bookmarks, schoolRecord]);

  const handlePreApply = useCallback(
    async (earlyAdmissionId: number, score: number) => {
      try {
        if (preApplyIds?.ids.includes(earlyAdmissionId)) {
          await deletePreApply(earlyAdmissionId);
          toast.success('모의지원 확정이 취소되었습니다.');
        } else {
          await addPreApply({ earlyAdmissionId, score });
          toast.success('모의지원 확정이 완료되었습니다.');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [addPreApply, deletePreApply, preApplyIds]
  );

  const handleDeleteBookmark = useCallback(
    async (earlyAdmissionId: number) => {
      try {
        await deleteBookmark(earlyAdmissionId);
        toast.success('북마크가 삭제되었습니다.');
      } catch (error) {
        console.error(error);
      }
    },
    [deleteBookmark]
  );

  return (
    <div className='w-full'>
      <div className='flex items-center justify-center pb-8'>
        <div className='flex flex-col items-center'>
          <h3 className='text-2xl font-bold'>모의지원 목록</h3>
          <p className='text-muted-foreground'>
            최대 6개까지 모의지원을 확정할 수 있습니다.
          </p>
        </div>
      </div>
      <div className='pt-12'>
        {isBookmarksPending ? (
          <LoadingSection />
        ) : isBookmarksError ? (
          <ErrorSection onRetry={refetchBookmarks} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[70px]'>지역</TableHead>
                <TableHead className='min-w-[120px]'>대학</TableHead>
                <TableHead className='min-w-[100px]'>전형유형</TableHead>
                <TableHead className='min-w-[100px]'>전형명</TableHead>
                <TableHead className='min-w-[140px]'>학과명</TableHead>
                <TableHead className='min-w-[70px]'>모집인원</TableHead>
                <TableHead className='min-w-[100px]'>내환산점/만점</TableHead>
                <TableHead className='min-w-[60px]'>최저점</TableHead>
                <TableHead className='min-w-[60px]'>평균점</TableHead>
                <TableHead className='min-w-[60px]'>최고점</TableHead>
                <TableHead className='min-w-[100px]'>
                  등수(동점자)/지원자
                </TableHead>
                <TableHead className='min-w-[60px]'>확정</TableHead>
                <TableHead className='min-w-[60px]'>리포트</TableHead>
                <TableHead className='min-w-[60px]'>삭제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-xs'>
              {bookmarks?.map((bookmark) => {
                return (
                  <BookmarkItem
                    key={bookmark.earlyAdmission.id}
                    bookmark={bookmark}
                    isPreApplied={
                      preApplyIds?.ids.includes(bookmark.earlyAdmission.id) ||
                      false
                    }
                    myScore={
                      earlyAdmissionScoreMap[bookmark.earlyAdmission.id] || {
                        success: false,
                        score: 0,
                        error: '전형 정보가 없습니다.',
                        totalScore: 0,
                      }
                    }
                    handlePreApply={handlePreApply}
                    handleDeleteBookmark={handleDeleteBookmark}
                  />
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
