'use client';
import { Bookmark } from '@/apis/hooks/use-bookmarks';
import { cn, toUrl } from '@/lib/utils';

import { AdmissionTypeBadge } from '@/components/badges/admission-type-badge';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageRoutes } from '@/constants/routes';
import { Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useScoreCalculation } from '@/hooks/use-score-calculation';
import { RegionBadge } from '@/components/badges/region-badge';

interface BookmarkItemProps {
  bookmark: Bookmark;
  isPreApplied: boolean;
  myScore: {
    success: boolean;
    score: number;
    error?: string;
    totalScore: number;
  };
  handlePreApply: (earlyAdmissionId: number, score: number) => void;
  handleDeleteBookmark: (earlyAdmissionId: number) => void;
}

export const BookmarkItem = ({
  bookmark,
  isPreApplied,
  myScore,
  handlePreApply,
  handleDeleteBookmark,
}: BookmarkItemProps) => {
  const {
    preApplyCount,
    minScore,
    maxScore,
    avgScore,
    myRank,
    sameScoreCount,
    // sortedScores
  } = useScoreCalculation(
    myScore.score,
    bookmark.earlyAdmission.preApplies.map((preApply) => preApply.score)
  );

  return (
    <TableRow key={bookmark.id}>
      <TableCell className='font-medium'>
        <RegionBadge name={bookmark.earlyAdmission.university.region.name} />
      </TableCell>
      <TableCell>{bookmark.earlyAdmission.university.name}</TableCell>
      <TableCell>
        <AdmissionTypeBadge name={bookmark.earlyAdmission.admissionType.name} />
      </TableCell>
      <TableCell>{bookmark.earlyAdmission.admissionName}</TableCell>
      <TableCell>{bookmark.earlyAdmission.departmentName}</TableCell>
      <TableCell>{bookmark.earlyAdmission.quota}</TableCell>

      <TableCell>
        {myScore.success ? (
          `${myScore.score.toFixed(2)} / ${myScore.totalScore}`
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={'destructive'}>에러</Badge>
            </TooltipTrigger>
            <TooltipContent>{myScore.error}</TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>{minScore}</TableCell>
      <TableCell>{avgScore}</TableCell>
      <TableCell>{maxScore}</TableCell>
      <TableCell>
        {myRank || '-'}({sameScoreCount}) / {preApplyCount}
      </TableCell>
      <TableCell>
        <Button
          size='sm'
          onClick={() =>
            handlePreApply(bookmark.earlyAdmission.id, myScore.score)
          }
          variant={isPreApplied ? 'outline' : 'default'}
        >
          {isPreApplied ? '취소' : '확정'}
        </Button>
      </TableCell>
      <TableCell>
        <Link
          href={toUrl(PageRoutes.REPORT, {
            id: bookmark.earlyAdmission.id.toString(),
          })}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          리포트
        </Link>
      </TableCell>
      <TableCell>
        <Button
          size='sm'
          variant='destructive'
          onClick={() => handleDeleteBookmark(bookmark.earlyAdmission.id)}
        >
          <Trash2Icon className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
};
